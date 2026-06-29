import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { sendWelcomeEmail } from "./email.service";

// Removes an uploaded file from the uploads directory given its public URL
// (e.g. "/uploads/123.jpg"). Best-effort — never throws.
const removeUploadByUrl = (url?: string | null) => {
  if (!url) return;
  try {
    const filePath = path.join(process.cwd(), "uploads", path.basename(url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to remove upload:", err);
  }
};

export const createStudent = async (studentData: any) => {
  const { email, ...rest } = studentData;
  let generatedPassword: string | null = null;
  let studentName = rest.name;

  // Run the database operations in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Student record
    const student = await tx.student.create({
      data: { ...rest, email }
    });

    // 2. If email exists, create a User record for login
    if (email) {
      console.log(`Generating password for student with email: ${email}`);
      const existingUser = await tx.user.findUnique({ where: { email } });
      
      if (!existingUser) {
        generatedPassword = crypto.randomBytes(4).toString("hex"); // 8 characters
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            role: "STUDENT",
          }
        });

        // Link the student record to the user
        await tx.student.update({
          where: { id: student.id },
          data: { userId: user.id }
        });
      } else {
        // Link existing user to this student record
        await tx.student.update({
          where: { id: student.id },
          data: { userId: existingUser.id }
        });
      }
    }

    return { student };
  });

  // Send welcome email OUTSIDE the transaction so email failures don't rollback DB changes
  if (email && generatedPassword) {
    try {
      await sendWelcomeEmail(email, studentName, generatedPassword);
      console.log(`Welcome email sent to ${email}`);
    } catch (emailError: any) {
      if (emailError.responseCode === 535) {
        console.error(`\n[CRITICAL] EMAIL FAILED for ${email}: Google App Password Invalid (535). Please update your .env file with a valid 16-letter Google App Password!\n`);
      } else {
        console.error(`Failed to send welcome email to ${email}:`, emailError.message || emailError);
      }
      // Don't throw - the student was created successfully, email is best-effort
    }
  }

  return result;
};


export const getStudents = async () => {
  return prisma.student.findMany({
    orderBy: { createdAt: "desc" }
  });
};

export const getStudentById = async (id: string) => {
  return prisma.student.findUnique({
    where: { id }
  });
};

export const getStudentByUserId = async (userId: string) => {
  return prisma.student.findUnique({
    where: { userId },
    include: {
      marks: {
        orderBy: [{ grade: "asc" }, { term: "asc" }]
      }
    }
  });
};

export const updateStudent = async (id: string, data: any) => {
  return prisma.student.update({
    where: { id },
    data
  });
};

export const deleteStudent = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id }
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const deletedStudent = await tx.student.delete({
      where: { id }
    });

    if (student.userId) {
      await tx.user.delete({
        where: { id: student.userId }
      });
    }

    return deletedStudent;
  });
};

export const promoteStudents = async () => {
  return prisma.student.updateMany({
    data: {
      grade: {
        increment: 1
      }
    }
  });
};

// Updates a student's photo, identified by their linked user account. Used by
// the student-portal "update my photo" flow — a student may only ever change
// their own photo. Removes the previous photo file from disk.
export const updateStudentPhotoByUserId = async (userId: string, photoUrl: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) {
    const error: any = new Error("Student profile not found");
    error.status = 404;
    throw error;
  }

  removeUploadByUrl(student.photoUrl);

  return prisma.student.update({
    where: { id: student.id },
    data: { photoUrl },
  });
};
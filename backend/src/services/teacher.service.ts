import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendWelcomeEmail } from "./email.service";

export const getTeachers = async () => {
  return prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, name: true, email: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
};

// Public-safe list for the About page — only non-sensitive fields (no email).
export const getPublicTeachers = async () => {
  return prisma.user.findMany({
    where: { role: "TEACHER", isActive: true, name: { not: null } },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });
};

export const createTeacher = async (data: { name: string; email: string }) => {
  const { name, email } = data;
  if (!email) throw new Error("Email is required");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("A user with this email already exists");

  // Auto-generate a temporary password (same approach as students)
  const generatedPassword = crypto.randomBytes(4).toString("hex"); // 8 characters
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  const teacher = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "TEACHER",
    },
    select: { id: true, name: true, email: true, isActive: true, createdAt: true },
  });

  // Send the welcome email outside any transaction — email failures must not
  // undo the account creation.
  try {
    await sendWelcomeEmail(email, name || "Teacher", generatedPassword);
    console.log(`Welcome email sent to teacher ${email}`);
  } catch (emailError: any) {
    if (emailError.responseCode === 535) {
      console.error(`\n[CRITICAL] EMAIL FAILED for ${email}: Google App Password Invalid (535). Update EMAIL_PASS in .env.\n`);
    } else {
      console.error(`Failed to send welcome email to ${email}:`, emailError.message || emailError);
    }
  }

  return teacher;
};

export const deleteTeacher = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("Teacher not found");
  if (user.role !== "TEACHER") throw new Error("This account is not a teacher");
  return prisma.user.delete({ where: { id } });
};

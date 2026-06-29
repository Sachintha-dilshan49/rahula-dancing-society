import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import markRoutes from "./routes/mark.routes";
import achievementRoutes from "./routes/achievement.routes";
import galleryRoutes from "./routes/gallery.routes";
import pastpaperRoutes from "./routes/pastpaper.routes";
import announcementRoutes from "./routes/announcement.routes";
import noteRoutes from "./routes/note.routes";
import quizRoutes from "./routes/quiz.routes";
import teacherRoutes from "./routes/teacher.routes";
import statsRoutes from "./routes/stats.routes";

const app = express();

/* Middlewares */
// In production set FRONTEND_URL to your deployed site to lock CORS to it;
// when unset (local dev) all origins are allowed.
app.use(cors(process.env.FRONTEND_URL ? { origin: process.env.FRONTEND_URL } : undefined));
app.use(express.json());

/* Static Files – serve uploaded media */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/pastpapers", pastpaperRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/stats", statsRoutes);

export default app;
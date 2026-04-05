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

const app = express();

/* Middlewares */
app.use(cors());
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

export default app;
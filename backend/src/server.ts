import app from "./app";
import { ensureAdmin } from "./config/seedAdmin";

// Fail fast on missing configuration rather than crashing later with a cryptic
// error (e.g. signing a JWT with an undefined secret on the first login).
const REQUIRED_ENV = ["JWT_SECRET", "DATABASE_URL"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    `[config] Missing required environment variable(s): ${missingEnv.join(", ")}.\n` +
      `Set them in backend/.env (see backend/.env.example) before starting the server.`
  );
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await ensureAdmin();
  } catch (error) {
    console.error("[seed] Failed to ensure hardcoded admin:", error);
  }
});
import app from "./app";
import { ensureAdmin } from "./config/seedAdmin";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await ensureAdmin();
  } catch (error) {
    console.error("[seed] Failed to ensure hardcoded admin:", error);
  }
});
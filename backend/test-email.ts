import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, ".env") });

import { sendWelcomeEmail } from "./src/services/email.service";

async function runTest() {
  console.log("-----------------------------------------");
  console.log("EMAIL TESTING SCRIPT STARTED");
  console.log("-----------------------------------------");
  console.log(`Using Email USER: ${process.env.EMAIL_USER}`);
  console.log(`Using App Password: ${process.env.EMAIL_PASS ? "********" + process.env.EMAIL_PASS.slice(-4) : "MISSING"}`);
  
  try {
    console.log("Attempting to connect to Gmail servers...");
    await sendWelcomeEmail(process.env.EMAIL_USER as string, "Test Admin", "password123");
    console.log("\n✅ SUCCESS! Email was sent successfully to " + process.env.EMAIL_USER);
  } catch (err: any) {
    console.log("\n❌ ERROR: FAILED TO SEND EMAIL");
    console.log("Error details from Google:");
    console.log(err.message);
    
    if (err.responseCode === 535) {
      console.log("\n⚠️ DIAGNOSIS: Google rejected your password (Error 535).");
      console.log("This means the 16-letter App Password in your .env file is either:");
      console.log("  1. Expired or deleted from your Google Account.");
      console.log("  2. Two-Step Verification might be turned OFF on your Google account.");
      console.log("\nYou MUST generate a brand new App Password from https://myaccount.google.com/security and put it in .env.");
    }
  }
}

runTest();

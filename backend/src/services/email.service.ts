import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email: string, name: string, password: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Rahula Dancing Society" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Rahula Dancing Society – Your Login Details",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <!-- Header -->
            <div style="background:#0a1d56;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:0.5px;">Rahula Dancing Society</h1>
              <p style="margin:6px 0 0;color:#a0aec0;font-size:13px;">Student Portal Access</p>
            </div>
            <!-- Body -->
            <div style="padding:40px;">
              <p style="color:#374151;font-size:16px;margin:0 0 8px;">Hi <strong>${name}</strong>,</p>
              <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 28px;">
                Welcome to the Rahula Dancing Society! Your student account has been created. 
                Use the details below to log in to the portal.
              </p>

              <!-- Credentials Box -->
              <div style="background:#f1f5f9;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
                <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Your Login Credentials</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#6b7280;font-size:13px;width:100px;">Email</td>
                    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#1e293b;font-size:13px;font-weight:600;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;font-size:13px;">Password</td>
                    <td style="padding:10px 0;color:#0a1d56;font-size:18px;font-weight:700;font-family:monospace;letter-spacing:2px;">${password}</td>
                  </tr>
                </table>
              </div>

              <!-- Warning -->
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
                <p style="margin:0;color:#92400e;font-size:13px;">
                  ⚠️ &nbsp;Please log in and <strong>change your password</strong> after your first login to keep your account secure.
                </p>
              </div>

              <p style="color:#6b7280;font-size:13px;margin:0;">
                If you have any questions, please contact your teacher or the school administration.
              </p>
            </div>
            <!-- Footer -->
            <div style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Rahula Dancing Society &nbsp;·&nbsp; This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};
import nodemailer from 'nodemailer';
import { env } from './environment';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

let transporter: nodemailer.Transporter | null = null;

function createTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('Email service not configured. SMTP credentials missing.');
    return null;
  }

  return nodemailer.createTransporter({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!transporter) {
    transporter = createTransporter();
  }

  if (!transporter) {
    console.error('Cannot send email: Email service not configured');
    return false;
  }

  try {
    await transporter.sendMail({
      from: env.FROM_EMAIL || env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.env.HOST || 'localhost:5000'}/reset-password?token=${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your account. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this reset, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
    text: `Password reset requested. Visit: ${resetUrl}`,
  });
}

export async function sendEmailVerification(email: string, verificationToken: string): Promise<boolean> {
  const verifyUrl = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.env.HOST || 'localhost:5000'}/verify-email?token=${verificationToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Welcome! Please verify your email address by clicking the link below:</p>
      <a href="${verifyUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html,
    text: `Please verify your email: ${verifyUrl}`,
  });
}
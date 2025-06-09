import { User, UserRole } from '../types/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// SendGrid Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey', // SendGrid requires this to be 'apikey'
    pass: process.env.SENDGRID_API_KEY,
  },
});

export class AuthService {
  // Validate email format
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Verify email configuration and connectivity
  private async verifyEmailService(): Promise<boolean> {
    try {
      await transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }

  // Generate OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via email with verification
  private async sendOTPEmail(email: string, otp: string): Promise<boolean> {
    try {
      // Verify email service first
      const isEmailServiceWorking = await this.verifyEmailService();
      if (!isEmailServiceWorking) {
        throw new Error('Email service is not configured properly');
      }

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Verify Your Account',
        html: `
          <h1>Account Verification</h1>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        `,
      });
      return true;
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send verification email. Please check your email configuration.');
    }
  }

  // Register new user
  async register(email: string, password: string, role: UserRole): Promise<{ user: User; otp: string }> {
    // Validate email format
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        isVerified: false,
      },
    });

    // Generate and store OTP
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    try {
      await prisma.oTPVerification.create({
        data: {
          userId: user.id,
          otp,
          expiresAt,
        },
      });

      // Send OTP email
      const emailSent = await this.sendOTPEmail(email, otp);
      if (!emailSent) {
        // If email fails, delete the user and OTP record
        await prisma.oTPVerification.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        throw new Error('Failed to send verification email');
      }

      return { user, otp };
    } catch (error) {
      // Clean up if anything fails
      await prisma.user.delete({ where: { id: user.id } });
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(userId: string, otp: string): Promise<boolean> {
    const verification = await prisma.oTPVerification.findFirst({
      where: {
        userId,
        otp,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      throw new Error('Invalid or expired OTP');
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    // Delete used OTP
    await prisma.oTPVerification.delete({
      where: { id: verification.id },
    });

    return true;
  }

  // Login
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your account first');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user };
  }
} 
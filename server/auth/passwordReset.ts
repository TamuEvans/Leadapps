import { Request, Response } from 'express';
import { authService } from '../auth';
import { sendPasswordResetEmail } from '../email';

export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const { resetToken } = await authService.requestPasswordReset(email);
    
    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);
    
    if (!emailSent) {
      console.error('Failed to send password reset email');
      // Don't reveal this to the user for security
    }
    
    // Always return success to prevent email enumeration
    res.json({ 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.json({ 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
    
    await authService.resetPassword(token, newPassword);
    
    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ message: error.message || 'Password reset failed' });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }
    
    await authService.verifyEmail(token);
    
    res.json({ message: 'Email verified successfully. You can now access all features.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ message: error.message || 'Email verification failed' });
  }
}
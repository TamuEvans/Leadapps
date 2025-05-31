import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

// File type validation
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt'];

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create secure upload directory structure
    const uploadDir = path.join(process.cwd(), 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Check file extension
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file extension'));
  }
  
  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type'));
  }
  
  cb(null, true);
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files per request
  },
});

// Document type validation for different purposes
export const documentTypes = {
  transcript: ['application/pdf'],
  profileImage: ['image/jpeg', 'image/png'],
  personalStatement: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  certificate: ['application/pdf'],
} as const;

export function validateDocumentType(file: Express.Multer.File, type: keyof typeof documentTypes): boolean {
  return documentTypes[type].includes(file.mimetype as any);
}

// Virus scanning placeholder (would integrate with actual antivirus in production)
export async function scanFileForViruses(filePath: string): Promise<boolean> {
  // In production, integrate with ClamAV or similar
  // For now, return true (safe)
  return true;
}

// File cleanup utility
export function cleanupFile(filePath: string): void {
  const fs = require('fs');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
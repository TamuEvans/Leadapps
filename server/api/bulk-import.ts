import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { z } from 'zod';
import { insertUniversitySchema, insertProgramSchema } from '@shared/schema';
import type { Request, Response } from 'express';

const router = express.Router();

// Configure multer for file upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to require admin role
const requireAdmin = (req: Request, res: Response, next: express.NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Helper function to parse CSV/Excel files
async function parseFile(file: Express.Multer.File): Promise<any[]> {
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
  
  if (fileExtension === 'csv') {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = Readable.from(file.buffer);
      
      stream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  } else {
    throw new Error('Unsupported file format. Please upload CSV or Excel file.');
  }
}

// Helper function to convert array string fields
function parseArrayField(value: any): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return undefined;
}

// Helper function to parse JSON fields
function parseJSONField(value: any): any {
  if (!value) return undefined;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return undefined;
}

// Bulk import universities
router.post('/universities', requireAdmin, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const data = await parseFile(req.file);
    
    // Transform and validate data
    const universities = data.map(row => {
      const university = {
        name: row.name || row.Name,
        country: row.country || row.Country,
        city: row.city || row.City,
        locations: parseArrayField(row.locations || row.Locations),
        logoUrl: row.logoUrl || row['Logo URL'] || row.logo_url,
        images: parseArrayField(row.images || row.Images),
        websiteUrl: row.websiteUrl || row['Website URL'] || row.website_url,
        overview: row.overview || row.Overview,
        founded: row.founded ? parseInt(row.founded) : undefined,
        schoolId: row.schoolId || row['School ID'] || row.school_id,
        institutionType: row.institutionType || row['Institution Type'] || row.institution_type,
        features: parseArrayField(row.features || row.Features)?.map(f => ({ feature: f })),
        avgCostOfLiving: row.avgCostOfLiving || row['Avg Cost of Living'] ? parseInt(row.avgCostOfLiving || row['Avg Cost of Living']) : undefined,
        tuitionMin: row.tuitionMin || row['Tuition Min'] ? parseInt(row.tuitionMin || row['Tuition Min']) : undefined,
        tuitionMax: row.tuitionMax || row['Tuition Max'] ? parseInt(row.tuitionMax || row['Tuition Max']) : undefined,
        topDisciplines: parseArrayField(row.topDisciplines || row['Top Disciplines'] || row.top_disciplines),
        programLevels: parseArrayField(row.programLevels || row['Program Levels'] || row.program_levels),
        description: row.description || row.Description,
        acceptsDirectApplications: row.acceptsDirectApplications === 'true' || row.acceptsDirectApplications === true,
        applicationFee: row.applicationFee ? parseInt(row.applicationFee) : undefined,
        applicationDeadlines: parseJSONField(row.applicationDeadlines || row['Application Deadlines']),
        apiEndpoint: row.apiEndpoint || row['API Endpoint'] || row.api_endpoint,
        apiKey: row.apiKey || row['API Key'] || row.api_key,
      };

      // Validate against schema
      return insertUniversitySchema.parse(university);
    });

    // Import to database
    const storage = req.app.get('storage');
    const results = await Promise.all(
      universities.map(uni => storage.createUniversity(uni))
    );

    res.json({
      message: `Successfully imported ${results.length} universities`,
      count: results.length,
      universities: results
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    res.status(400).json({ 
      message: 'Import failed', 
      error: error.message,
      details: error.issues || undefined
    });
  }
});

// Bulk import programs
router.post('/programs', requireAdmin, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const data = await parseFile(req.file);
    
    // Transform and validate data
    const programs = data.map(row => {
      const program = {
        universityId: parseInt(row.universityId || row['University ID'] || row.university_id),
        name: row.name || row.Name,
        images: parseArrayField(row.images || row.Images),
        summary: row.summary || row.Summary,
        degree: row.degree || row.Degree,
        level: row.level || row.Level,
        discipline: row.discipline || row.Discipline,
        duration: row.duration || row.Duration,
        tuitionFee: row.tuitionFee || row['Tuition Fee'] ? parseInt(row.tuitionFee || row['Tuition Fee']) : undefined,
        currency: row.currency || row.Currency || 'USD',
        avgLivingExpenses: row.avgLivingExpenses || row['Avg Living Expenses'] ? parseInt(row.avgLivingExpenses || row['Avg Living Expenses']) : undefined,
        applicationFee: row.applicationFee || row['Application Fee'] ? parseInt(row.applicationFee || row['Application Fee']) : undefined,
        applicationDeadline: row.applicationDeadline || row['Application Deadline'] || undefined,
        admissionRequirements: parseJSONField(row.admissionRequirements || row['Admission Requirements']),
        intakes: parseArrayField(row.intakes || row.Intakes),
        startDates: parseArrayField(row.startDates || row['Start Dates'])?.map(d => ({ date: d })),
        similarPrograms: parseArrayField(row.similarPrograms || row['Similar Programs'])?.map(p => ({ programId: p })),
        description: row.description || row.Description,
        requirements: parseJSONField(row.requirements || row.Requirements),
      };

      // Validate against schema
      return insertProgramSchema.parse(program);
    });

    // Import to database
    const storage = req.app.get('storage');
    const results = await Promise.all(
      programs.map(prog => storage.createProgram(prog))
    );

    res.json({
      message: `Successfully imported ${results.length} programs`,
      count: results.length,
      programs: results
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    res.status(400).json({ 
      message: 'Import failed', 
      error: error.message,
      details: error.issues || undefined
    });
  }
});

// Download template for universities
router.get('/templates/universities', requireAdmin, (req: Request, res: Response) => {
  const template = [
    {
      name: 'Example University',
      country: 'United States',
      city: 'New York',
      locations: 'Main Campus, Downtown Campus',
      logoUrl: 'https://example.com/logo.png',
      images: 'https://example.com/img1.jpg, https://example.com/img2.jpg',
      websiteUrl: 'https://example.edu',
      overview: 'A leading institution for higher education',
      founded: 1850,
      schoolId: 'UNI001',
      institutionType: 'Public',
      features: 'Research Excellence, International Programs, Career Services',
      avgCostOfLiving: 2000,
      tuitionMin: 10000,
      tuitionMax: 50000,
      topDisciplines: 'Computer Science, Business, Engineering',
      programLevels: 'Bachelor, Master, PhD',
      description: 'Detailed description here',
      acceptsDirectApplications: 'true',
      applicationFee: 100,
    }
  ];

  const ws = xlsx.utils.json_to_sheet(template);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Universities');
  
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  
  res.setHeader('Content-Disposition', 'attachment; filename=universities_template.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

// Download template for programs
router.get('/templates/programs', requireAdmin, (req: Request, res: Response) => {
  const template = [
    {
      universityId: 1,
      name: 'Bachelor of Science in Computer Science',
      images: 'https://example.com/prog1.jpg, https://example.com/prog2.jpg',
      summary: 'Comprehensive CS program',
      degree: 'Bachelor of Science',
      level: 'Undergraduate',
      discipline: 'Computer Science',
      duration: '4 years',
      tuitionFee: 30000,
      currency: 'USD',
      avgLivingExpenses: 15000,
      applicationFee: 75,
      applicationDeadline: '2024-12-31',
      admissionRequirements: '{"gpa": 3.0, "sat": 1200}',
      intakes: 'Fall, Spring',
      startDates: 'September, January',
      similarPrograms: '2, 3, 4',
      description: 'Detailed program description',
      requirements: '{"prerequisites": ["Math", "Physics"]}'
    }
  ];

  const ws = xlsx.utils.json_to_sheet(template);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Programs');
  
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  
  res.setHeader('Content-Disposition', 'attachment; filename=programs_template.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

export default router;

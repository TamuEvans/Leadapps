const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedExamResources() {
  try {
    console.log('Adding exam resources...');

    // Insert sample exam resources
    const examResources = [
      {
        title: 'CSEC Mathematics Complete Guide',
        description: 'Comprehensive mathematics guide covering all CSEC syllabus topics',
        examType: 'CSEC',
        subject: 'Mathematics',
        resourceType: 'pdf',
        difficulty: 'intermediate',
        duration: 180,
        isPremium: false
      },
      {
        title: 'CAPE Biology Unit 1 Practice Tests',
        description: 'Practice tests for CAPE Biology Unit 1 with detailed explanations',
        examType: 'CAPE',
        subject: 'Biology',
        resourceType: 'quiz',
        difficulty: 'advanced',
        duration: 120,
        isPremium: false
      },
      {
        title: 'SAT Math Problem Sets',
        description: 'Comprehensive SAT mathematics practice problems with solutions',
        examType: 'SAT',
        subject: 'Mathematics',
        resourceType: 'practice_test',
        difficulty: 'intermediate',
        duration: 90,
        isPremium: false
      },
      {
        title: 'CSEC English Language Papers',
        description: 'Past papers and practice questions for CSEC English Language',
        examType: 'CSEC',
        subject: 'English',
        resourceType: 'pdf',
        difficulty: 'intermediate',
        duration: 150,
        isPremium: false
      },
      {
        title: 'BGCSE Science Flashcards',
        description: 'Interactive flashcards covering key BGCSE science concepts',
        examType: 'BGCSE',
        subject: 'Science',
        resourceType: 'flashcards',
        difficulty: 'beginner',
        duration: 45,
        isPremium: false
      }
    ];

    for (const resource of examResources) {
      await pool.query(
        `INSERT INTO exam_resources (title, description, exam_type, subject, resource_type, difficulty, duration, is_premium, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
        [
          resource.title,
          resource.description,
          resource.examType,
          resource.subject,
          resource.resourceType,
          resource.difficulty,
          resource.duration,
          resource.isPremium
        ]
      );
    }

    console.log('✓ Exam resources added successfully');
  } catch (error) {
    console.error('Error seeding exam resources:', error);
  } finally {
    await pool.end();
  }
}

seedExamResources();
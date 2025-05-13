import { db } from './db';
import { universities, programs } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Check if we have any universities already
    const existingUniversities = await db.select({ count: sql`count(*)` })
      .from(universities);
    
    if (existingUniversities.length > 0 && Number(existingUniversities[0].count) > 0) {
      console.log(`Database already has ${existingUniversities[0].count} universities. Skipping seeding.`);
      return;
    }
    
    // Insert universities
    console.log('Inserting universities...');
    const universityData = [
      // Caribbean Universities
      {
        name: "University of the West Indies",
        country: "Jamaica",
        city: "Kingston",
        logoUrl: "/university-logos/uwi.png",
        websiteUrl: "https://www.uwi.edu/",
        description: "The premier educational institution in the Caribbean, serving over 18 countries across the region."
      },
      {
        name: "University of Technology",
        country: "Jamaica",
        city: "Kingston",
        logoUrl: "/university-logos/utech.png",
        websiteUrl: "https://www.utech.edu.jm/",
        description: "One of the leading universities in Jamaica focused on technological innovation and development."
      },
      {
        name: "St. George's University",
        country: "Grenada",
        city: "St. George's",
        logoUrl: "/university-logos/sgu.png",
        websiteUrl: "https://www.sgu.edu/",
        description: "Renowned medical and veterinary school in the Caribbean with graduates practicing worldwide."
      },
      {
        name: "University of Trinidad and Tobago",
        country: "Trinidad",
        city: "Port of Spain",
        logoUrl: "/university-logos/utt.png",
        websiteUrl: "https://u.tt/",
        description: "National university focused on developing industrial innovation and entrepreneurship."
      },
      
      // US Universities
      {
        name: "Harvard University",
        country: "US",
        city: "Cambridge",
        logoUrl: "/university-logos/harvard.png",
        websiteUrl: "https://www.harvard.edu/",
        description: "One of the world's most prestigious universities, offering excellence across diverse fields."
      },
      {
        name: "Massachusetts Institute of Technology",
        country: "US",
        city: "Cambridge",
        logoUrl: "/university-logos/mit.png",
        websiteUrl: "https://www.mit.edu/",
        description: "World-leading institution focused on science, engineering, and technological innovation."
      },
      {
        name: "University of California, Berkeley",
        country: "US",
        city: "Berkeley",
        logoUrl: "/university-logos/berkeley.png",
        websiteUrl: "https://www.berkeley.edu/",
        description: "Public research university renowned for its academic excellence and progressive values."
      },
      
      // UK Universities
      {
        name: "University of Oxford",
        country: "UK",
        city: "Oxford",
        logoUrl: "/university-logos/oxford.png",
        websiteUrl: "https://www.ox.ac.uk/",
        description: "The oldest university in the English-speaking world with a rich history of academic excellence."
      },
      {
        name: "Imperial College London",
        country: "UK",
        city: "London",
        logoUrl: "/university-logos/imperial.png",
        websiteUrl: "https://www.imperial.ac.uk/",
        description: "World-class university specializing in science, engineering, medicine, and business."
      },
      {
        name: "University of Edinburgh",
        country: "UK",
        city: "Edinburgh",
        logoUrl: "/university-logos/edinburgh.png",
        websiteUrl: "https://www.ed.ac.uk/",
        description: "One of Scotland's ancient universities with a strong reputation for research and innovation."
      },
      
      // Canadian Universities
      {
        name: "University of Toronto",
        country: "Canada",
        city: "Toronto",
        logoUrl: "/university-logos/toronto.png",
        websiteUrl: "https://www.utoronto.ca/",
        description: "Canada's leading institution for learning, discovery, and knowledge creation."
      },
      {
        name: "McGill University",
        country: "Canada",
        city: "Montreal",
        logoUrl: "/university-logos/mcgill.png",
        websiteUrl: "https://www.mcgill.ca/",
        description: "One of Canada's best-known institutions of higher learning and a leading university worldwide."
      }
    ];
    
    // Insert universities
    for (const uni of universityData) {
      await db.insert(universities).values(uni);
    }
    
    console.log(`Inserted ${universityData.length} universities`);
    
    // Fetch the inserted universities to get their IDs
    const insertedUniversities = await db.select().from(universities);
    console.log('Inserting programs...');
    
    // Create programs for each university
    for (const uni of insertedUniversities) {
      // Different program sets based on university type
      if (uni.country === "Jamaica" || uni.country === "Trinidad" || uni.country === "Grenada") {
        // Caribbean university programs
        await insertCaribbeanPrograms(uni.id);
      } else if (uni.country === "US") {
        // US university programs
        await insertUSPrograms(uni.id);
      } else if (uni.country === "UK") {
        // UK university programs
        await insertUKPrograms(uni.id);
      } else if (uni.country === "Canada") {
        // Canadian university programs
        await insertCanadianPrograms(uni.id);
      }
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function insertCaribbeanPrograms(universityId: number) {
  const caribbeanPrograms = [
    {
      universityId,
      name: "Medicine",
      degree: "MD",
      level: "Doctoral",
      discipline: "Medical Sciences",
      duration: "4 years",
      tuitionFee: 25000,
      currency: "USD",
      description: "Comprehensive medical education preparing students for a career in medicine."
    },
    {
      universityId,
      name: "Computer Science",
      degree: "BSc",
      level: "Undergraduate",
      discipline: "Computing",
      duration: "3 years",
      tuitionFee: 5000,
      currency: "USD",
      description: "Study of algorithms, programming languages, and computer systems design."
    },
    {
      universityId,
      name: "Business Administration",
      degree: "BBA",
      level: "Undergraduate",
      discipline: "Business",
      duration: "3 years",
      tuitionFee: 4500,
      currency: "USD",
      description: "Foundation in business principles, management, and organizational operations."
    },
    {
      universityId,
      name: "Tourism Management",
      degree: "BSc",
      level: "Undergraduate",
      discipline: "Hospitality",
      duration: "3 years",
      tuitionFee: 4000,
      currency: "USD",
      description: "Specialized program focusing on the tourism and hospitality sectors."
    },
    {
      universityId,
      name: "Education",
      degree: "BEd",
      level: "Undergraduate",
      discipline: "Education",
      duration: "4 years",
      tuitionFee: 4200,
      currency: "USD",
      description: "Teacher training program preparing educators for primary and secondary education."
    }
  ];
  
  for (const program of caribbeanPrograms) {
    await db.insert(programs).values(program);
  }
  
  console.log(`Inserted ${caribbeanPrograms.length} Caribbean programs for university ID ${universityId}`);
}

async function insertUSPrograms(universityId: number) {
  const usPrograms = [
    {
      universityId,
      name: "Computer Science",
      degree: "BS",
      level: "Undergraduate",
      discipline: "Computing",
      duration: "4 years",
      tuitionFee: 45000,
      currency: "USD",
      description: "Comprehensive study of computing systems, algorithms, and software development."
    },
    {
      universityId,
      name: "Mechanical Engineering",
      degree: "BS",
      level: "Undergraduate",
      discipline: "Engineering",
      duration: "4 years",
      tuitionFee: 48000,
      currency: "USD",
      description: "Study of physical systems, machine design, and thermal engineering."
    },
    {
      universityId,
      name: "Business Analytics",
      degree: "MS",
      level: "Graduate",
      discipline: "Business",
      duration: "2 years",
      tuitionFee: 55000,
      currency: "USD",
      description: "Advanced degree focused on data analysis for business decision-making."
    },
    {
      universityId,
      name: "Psychology",
      degree: "BA",
      level: "Undergraduate",
      discipline: "Social Sciences",
      duration: "4 years",
      tuitionFee: 42000,
      currency: "USD",
      description: "Study of human behavior, mental processes, and psychological theories."
    },
    {
      universityId,
      name: "Public Health",
      degree: "MPH",
      level: "Graduate",
      discipline: "Health Sciences",
      duration: "2 years",
      tuitionFee: 50000,
      currency: "USD",
      description: "Professional degree preparing students for careers in public health and health services."
    }
  ];
  
  for (const program of usPrograms) {
    await db.insert(programs).values(program);
  }
  
  console.log(`Inserted ${usPrograms.length} US programs for university ID ${universityId}`);
}

async function insertUKPrograms(universityId: number) {
  const ukPrograms = [
    {
      universityId,
      name: "Economics",
      degree: "BSc",
      level: "Undergraduate",
      discipline: "Social Sciences",
      duration: "3 years",
      tuitionFee: 20000,
      currency: "GBP",
      description: "Study of economic systems, markets, and financial policies."
    },
    {
      universityId,
      name: "Artificial Intelligence",
      degree: "MSc",
      level: "Graduate",
      discipline: "Computing",
      duration: "1 year",
      tuitionFee: 25000,
      currency: "GBP",
      description: "Advanced study of AI algorithms, machine learning, and computational intelligence."
    },
    {
      universityId,
      name: "International Relations",
      degree: "BA",
      level: "Undergraduate",
      discipline: "Social Sciences",
      duration: "3 years",
      tuitionFee: 19000,
      currency: "GBP",
      description: "Study of global politics, international organizations, and diplomatic relations."
    },
    {
      universityId,
      name: "Chemical Engineering",
      degree: "MEng",
      level: "Undergraduate",
      discipline: "Engineering",
      duration: "4 years",
      tuitionFee: 24000,
      currency: "GBP",
      description: "Integrated master's program covering chemical processes and engineering principles."
    },
    {
      universityId,
      name: "Law",
      degree: "LLB",
      level: "Undergraduate",
      discipline: "Law",
      duration: "3 years",
      tuitionFee: 22000,
      currency: "GBP",
      description: "Qualifying law degree for aspiring solicitors and barristers."
    }
  ];
  
  for (const program of ukPrograms) {
    await db.insert(programs).values(program);
  }
  
  console.log(`Inserted ${ukPrograms.length} UK programs for university ID ${universityId}`);
}

async function insertCanadianPrograms(universityId: number) {
  const canadianPrograms = [
    {
      universityId,
      name: "Environmental Science",
      degree: "BSc",
      level: "Undergraduate",
      discipline: "Sciences",
      duration: "4 years",
      tuitionFee: 30000,
      currency: "CAD",
      description: "Interdisciplinary study of environmental systems and sustainability challenges."
    },
    {
      universityId,
      name: "Data Science",
      degree: "MSc",
      level: "Graduate",
      discipline: "Computing",
      duration: "2 years",
      tuitionFee: 35000,
      currency: "CAD",
      description: "Advanced program combining statistics, computing, and domain expertise."
    },
    {
      universityId,
      name: "Nursing",
      degree: "BScN",
      level: "Undergraduate",
      discipline: "Health Sciences",
      duration: "4 years",
      tuitionFee: 28000,
      currency: "CAD",
      description: "Professional program preparing registered nurses for healthcare settings."
    },
    {
      universityId,
      name: "Urban Planning",
      degree: "MUP",
      level: "Graduate",
      discipline: "Social Sciences",
      duration: "2 years",
      tuitionFee: 32000,
      currency: "CAD",
      description: "Professional program focused on city planning, development, and community design."
    },
    {
      universityId,
      name: "Finance",
      degree: "BCom",
      level: "Undergraduate",
      discipline: "Business",
      duration: "4 years",
      tuitionFee: 29000,
      currency: "CAD",
      description: "Specialized business program focusing on financial markets and corporate finance."
    }
  ];
  
  for (const program of canadianPrograms) {
    await db.insert(programs).values(program);
  }
  
  console.log(`Inserted ${canadianPrograms.length} Canadian programs for university ID ${universityId}`);
}

// Run the seed function
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
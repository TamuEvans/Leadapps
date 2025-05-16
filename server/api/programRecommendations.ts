import { Router } from "express";
import OpenAI from "openai";
import { storage } from "../storage";
import { requireAuth } from "../auth/authMiddleware";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a router for program recommendations
const programRecommendationsRouter = Router();

// Get AI-powered program recommendations based on student profile
programRecommendationsRouter.get("/:profileId", requireAuth, async (req, res) => {
  try {
    const { profileId } = req.params;
    
    // Get the student profile
    const profile = await storage.getStudentProfile(parseInt(profileId));
    
    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    // Get related education history
    const schools = await storage.getSchoolsByProfileId(profile.id);
    
    // Get test scores
    const tests = await storage.getTestsByProfileId(profile.id);
    
    // Get work experiences
    const workExperiences = await storage.getWorkExperiencesByProfileId(profile.id);
    
    // Generate program recommendations
    const recommendations = await generateProgramRecommendations(profile, schools, tests, workExperiences);
    
    res.json(recommendations);
  } catch (error) {
    console.error("Error generating program recommendations:", error);
    res.status(500).json({ 
      message: "Failed to generate program recommendations",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Use OpenAI to generate program recommendations
async function generateProgramRecommendations(profile: any, schools: any[], tests: any[], workExperiences: any[]) {
  try {
    // Create a consolidated profile for AI analysis
    const consolidatedProfile = {
      personalInfo: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        nationality: profile.countryOfCitizenship,
        currentCountry: profile.country,
      },
      academicPreferences: {
        intendedFieldsOfStudy: profile.intendedFieldsOfStudy,
        preferredStudyLevel: profile.preferredStudyLevel,
        expectedStartTerm: profile.expectedStartTerm,
        expectedStartYear: profile.expectedStartYear,
        preferredStudyDestinations: profile.preferredStudyDestinations,
        onlineLearningInterest: profile.onlineLearningInterest,
        fundingSources: profile.fundingSources,
        scholarshipInterest: profile.scholarshipInterest,
      },
      educationBackground: {
        educationCountry: profile.educationCountry,
        highestEducationLevel: profile.highestEducationLevel,
        gradingScheme: profile.gradingScheme,
        overallGrade: profile.overallGrade,
        schools: schools.map(school => ({
          name: school.name,
          country: school.country,
          city: school.city,
          level: school.level,
          degree: school.degree,
          major: school.major,
          fromDate: school.fromDate,
          toDate: school.toDate,
          graduationDate: school.graduationDate,
        })),
      },
      testScores: tests.map(test => ({
        testName: test.testName,
        score: test.score,
        dateTaken: test.dateTaken,
      })),
      workExperience: workExperiences.map(exp => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        country: exp.country,
        city: exp.city,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
      })),
    };

    // Get a list of programs from the database to use as reference
    // Limit to a reasonable number for the AI to process
    const universities = await storage.getUniversities(30);
    const programsList = [];
    
    for (const uni of universities) {
      const uniPrograms = await storage.getProgramsByUniversity(uni.id, 10);
      programsList.push(...uniPrograms.map(program => ({
        id: program.id,
        universityId: program.universityId,
        universityName: uni.name,
        universityCountry: uni.country,
        universityCity: uni.city,
        programName: program.name,
        degree: program.degree,
        level: program.level,
        discipline: program.discipline,
        duration: program.duration,
        tuitionFee: program.tuitionFee,
        currency: program.currency,
        description: program.description,
      })));
    }
    
    // Create a prompt for OpenAI
    const prompt = `
You are an expert educational counselor tasked with recommending suitable university programs for a student based on their profile and academic background.

The student profile data is provided below:
${JSON.stringify(consolidatedProfile, null, 2)}

Here is a sample of available university programs:
${JSON.stringify(programsList, null, 2)}

Based on the student's profile, academic background, and preferences, recommend the 5 most suitable university programs from the provided list.
Consider factors such as:
1. Alignment with intended fields of study and career goals
2. Appropriate study level based on current education
3. Geographic preferences
4. Financial considerations and scholarship opportunities
5. Academic qualifications and test scores
6. Previous educational performance and work experience

For each recommended program, provide:
1. A score out of 100 indicating the match quality
2. A detailed explanation of why this program is a good fit (3-4 sentences)
3. Any specific prerequisites or additional requirements the student should be aware of
4. Potential scholarship opportunities for this program (if applicable)

Format your response as a JSON object with the following structure:
{
  "recommendations": [
    {
      "programId": number,
      "universityName": string,
      "programName": string,
      "matchScore": number (0-100),
      "matchReason": string,
      "prerequisites": string,
      "scholarshipOpportunities": string
    },
    ...
  ],
  "alternativePathways": string (provide alternative educational pathways if the current options aren't ideal)
}

Ensure your recommendations are evidence-based, specific to the student's profile, and academically sound.
`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert educational counselor and university program advisor." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5, // Lower temperature for more consistent recommendations
      response_format: { type: "json_object" }
    });

    // Extract and parse the response
    const responseContent = response.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the JSON response
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error generating program recommendations with OpenAI:", error);
    
    // Provide a fallback response in case of OpenAI API failure
    return {
      recommendations: [],
      alternativePathways: "We're unable to generate program recommendations at this time. Please try again later or contact a counselor for personalized advice."
    };
  }
}

export default programRecommendationsRouter;
import { Router } from "express";
import OpenAI from "openai";
import { storage } from "../storage";
import { z } from "zod";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a router for personality assessment
const personalityAssessmentRouter = Router();

// Schema for personality assessments
const personalityResultSchema = z.object({
  id: z.string(),
  userId: z.number().optional(),
  assessmentDate: z.string(),
  personalitySummary: z.string(),
  learningStyle: z.object({
    title: z.string(),
    description: z.string(),
    characteristics: z.array(z.string()),
  }),
  strengths: z.array(z.string()),
  interestAreas: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      description: z.string(),
    })
  ),
  idealEnvironment: z.object({
    description: z.string(),
    characteristics: z.array(z.string()),
  }),
  careerSuggestions: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      matchScore: z.number(),
    })
  ),
  educationSuggestions: z.array(
    z.object({
      field: z.string(),
      description: z.string(),
      matchScore: z.number(),
    })
  ),
  // Additional astrological, human design, and enneagram data
  astrology: z.object({
    sunSign: z.string(),
    moonSign: z.string(),
    ascendantSign: z.string(),
    planetaryPlacements: z.array(
      z.object({
        planet: z.string(),
        sign: z.string(),
        house: z.number().optional(),
        interpretation: z.string(),
      })
    ),
    summary: z.string(),
  }).optional(),
  humanDesign: z.object({
    type: z.string(),
    authority: z.string(),
    profile: z.string(),
    definition: z.string(),
    centers: z.array(
      z.object({
        name: z.string(),
        status: z.string(),
        meaning: z.string(),
      })
    ),
    summary: z.string(),
  }).optional(),
  enneagram: z.object({
    primaryType: z.string(),
    wing: z.string(),
    triad: z.string(),
    growthPath: z.string(),
    stressPath: z.string(),
    description: z.string(),
  }).optional(),
});

// In-memory storage for assessment results (in a real app, this would be in a database)
const assessmentResults: Record<string, z.infer<typeof personalityResultSchema>> = {};

// Submit a personality assessment
personalityAssessmentRouter.post("/", async (req, res) => {
  try {
    // In a real app, we'd validate the assessment data here
    const assessmentData = req.body;
    
    // Make a copy of the assessment data to pass to OpenAI
    const assessmentDataCopy = JSON.parse(JSON.stringify(assessmentData));
    
    // Generate a unique ID for the assessment
    const assessmentId = Date.now().toString();
    
    // Analyze the assessment data with OpenAI
    const result = await analyzePersonality(assessmentDataCopy);
    
    // Get the authenticated user ID if available
    // Using any type since the user object structure depends on auth implementation
    const userId = (req.user as any)?.claims?.sub;
    
    // Store the assessment result
    const assessmentResult = {
      id: assessmentId,
      userId,
      assessmentDate: new Date().toISOString(),
      ...result,
    };
    
    // Save the result (in memory for this example)
    assessmentResults[assessmentId] = assessmentResult;
    
    // Return the assessment ID to the client
    res.status(201).json({ id: assessmentId });
  } catch (error) {
    console.error("Error processing assessment:", error);
    res.status(500).json({ message: "Failed to process assessment" });
  }
});

// Get a specific assessment result
personalityAssessmentRouter.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const result = assessmentResults[id];
    
    if (!result) {
      return res.status(404).json({ message: "Assessment result not found" });
    }
    
    // In a real app, we'd check if the user has permission to view this result
    
    res.json(result);
  } catch (error) {
    console.error("Error retrieving assessment result:", error);
    res.status(500).json({ message: "Failed to retrieve assessment result" });
  }
});

// Use OpenAI to analyze the personality assessment
async function analyzePersonality(assessmentData: any) {
  try {
    // Check if the assessment data includes date of birth
    const hasDOB = assessmentData.demographics?.dateOfBirth || assessmentData.personalInfo?.dateOfBirth || assessmentData.dateOfBirth;
    
    // Create a structured prompt for OpenAI
    let prompt = `
You are an expert career and education counselor tasked with analyzing a student's personality assessment results.
The assessment is designed to identify learning styles, strengths, interests, and ideal work environments.

The assessment data is provided below in JSON format:
${JSON.stringify(assessmentData, null, 2)}

Based on this data, create a comprehensive personality profile with the following components:
1. A personal summary paragraph (300-400 words) that synthesizes key traits and offers personalized insights
2. Learning style analysis (title, description, and 5-6 characteristics)
3. Top 5 strengths based on the assessment responses
4. Interest areas ranked by score with descriptions
5. Ideal environment analysis (description and 5-6 key characteristics)
6. Career suggestions (5 specific careers with descriptions and match scores)
7. Education path suggestions (5 specific fields with descriptions and match scores)
`;

    // Add astrological, human design, and enneagram instructions if date of birth is available
    if (hasDOB) {
      prompt += `
8. Astrological profile based on the provided date of birth including:
   - Sun sign, Moon sign, and Ascendant (Rising) sign with brief interpretation
   - Key planetary placements and their significance
   - Overall astrological summary relating to career, education, and personality

9. Human Design profile based on the provided date of birth including:
   - Type (Manifestor, Generator, Manifesting Generator, Projector, or Reflector)
   - Authority (Emotional, Sacral, Splenic, Ego, Self, etc.)
   - Profile (ex: 1/3, 4/6, etc.)
   - Definition type (Single, Split, Triple Split, Quadruple Split)
   - Energy centers status (Defined, Undefined, Open) and their meaning
   - Summary of how human design influences their learning and work style

10. Enneagram profile including:
    - Primary type (1-9) with brief description
    - Likely wing
    - Triad (Heart, Head, or Gut)
    - Growth and stress directions
    - Description of how this enneagram type manifests in learning and career contexts
`;
    }

    prompt += `
Format your response as a JSON object with the following structure:
{
  "personalitySummary": "string",
  "learningStyle": {
    "title": "string",
    "description": "string",
    "characteristics": ["string", "string", ...]
  },
  "strengths": ["string", "string", ...],
  "interestAreas": [
    {
      "name": "string",
      "score": number,
      "description": "string"
    },
    ...
  ],
  "idealEnvironment": {
    "description": "string",
    "characteristics": ["string", "string", ...]
  },
  "careerSuggestions": [
    {
      "name": "string",
      "description": "string",
      "matchScore": number
    },
    ...
  ],
  "educationSuggestions": [
    {
      "field": "string",
      "description": "string",
      "matchScore": number
    },
    ...
  ]`;

    // Add astrological, human design, and enneagram schema if date of birth is available
    if (hasDOB) {
      prompt += `,
  "astrology": {
    "sunSign": "string",
    "moonSign": "string",
    "ascendantSign": "string",
    "planetaryPlacements": [
      {
        "planet": "string",
        "sign": "string",
        "house": number,
        "interpretation": "string"
      },
      ...
    ],
    "summary": "string"
  },
  "humanDesign": {
    "type": "string",
    "authority": "string",
    "profile": "string",
    "definition": "string",
    "centers": [
      {
        "name": "string",
        "status": "string",
        "meaning": "string"
      },
      ...
    ],
    "summary": "string"
  },
  "enneagram": {
    "primaryType": "string",
    "wing": "string",
    "triad": "string",
    "growthPath": "string",
    "stressPath": "string",
    "description": "string"
  }`;
    }

    prompt += `
}

Provide thoughtful, specific recommendations tailored to the individual's unique profile. Focus on practical, actionable insights.
`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert educational counselor and career advisor." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
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
    console.error("Error analyzing personality with OpenAI:", error);
    
    // Check if DOB was provided to determine what fallback data to include
    const hasDOB = assessmentData.demographics?.dateOfBirth || assessmentData.personalInfo?.dateOfBirth || assessmentData.dateOfBirth;
    
    // Provide a fallback response in case of OpenAI API failure
    const fallbackResponse = {
      personalitySummary: "We're currently unable to generate a personality summary. Please try again later.",
      learningStyle: {
        title: "Learning Style Analysis Unavailable",
        description: "Our analysis service is temporarily unavailable. Please try again later.",
        characteristics: ["Service temporarily unavailable"]
      },
      strengths: ["Analysis currently unavailable"],
      interestAreas: [
        {
          name: "Data Analysis",
          score: 3,
          description: "Interest in working with data and statistics."
        },
        {
          name: "Creative Work",
          score: 3,
          description: "Interest in creative and artistic endeavors."
        },
        {
          name: "Helping Others",
          score: 3,
          description: "Interest in careers focused on supporting and assisting others."
        }
      ],
      idealEnvironment: {
        description: "Environment analysis currently unavailable.",
        characteristics: ["Service temporarily unavailable"]
      },
      careerSuggestions: [
        {
          name: "Career analysis unavailable",
          description: "Please try again later.",
          matchScore: 0
        }
      ],
      educationSuggestions: [
        {
          field: "Education analysis unavailable",
          description: "Please try again later.",
          matchScore: 0
        }
      ]
    };
    
    // Add fallback astrological, human design and enneagram data if DOB was provided
    if (hasDOB) {
      (fallbackResponse as any).astrology = {
        sunSign: "Analysis unavailable",
        moonSign: "Analysis unavailable",
        ascendantSign: "Analysis unavailable",
        planetaryPlacements: [
          {
            planet: "Analysis unavailable",
            sign: "Analysis unavailable",
            interpretation: "Astrological analysis temporarily unavailable."
          }
        ],
        summary: "Astrological analysis temporarily unavailable. Please try again later."
      };
      
      (fallbackResponse as any).humanDesign = {
        type: "Analysis unavailable",
        authority: "Analysis unavailable",
        profile: "Analysis unavailable",
        definition: "Analysis unavailable",
        centers: [
          {
            name: "Analysis unavailable",
            status: "Analysis unavailable",
            meaning: "Human Design analysis temporarily unavailable."
          }
        ],
        summary: "Human Design analysis temporarily unavailable. Please try again later."
      };
      
      (fallbackResponse as any).enneagram = {
        primaryType: "Analysis unavailable",
        wing: "Analysis unavailable",
        triad: "Analysis unavailable",
        growthPath: "Analysis unavailable",
        stressPath: "Analysis unavailable",
        description: "Enneagram analysis temporarily unavailable. Please try again later."
      };
    }
    
    return fallbackResponse;
  }
}

export default personalityAssessmentRouter;
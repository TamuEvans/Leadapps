import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Service to interact with OpenAI API
 */
export class OpenAIService {
  /**
   * Generate program recommendations based on student profile
   * @param studentProfile The student profile data
   * @param existingProgramIds Optional array of program IDs to exclude from recommendations
   * @returns Array of recommended programs with match scores and reasons
   */
  async generateProgramRecommendations(studentProfile: any, existingProgramIds: number[] = []) {
    try {
      // Format the student profile data for OpenAI
      const profileData = {
        personalDetails: {
          name: studentProfile.firstName + " " + studentProfile.lastName,
          age: studentProfile.age,
          nationality: studentProfile.nationality,
          gender: studentProfile.gender,
          currentCountry: studentProfile.currentCountry
        },
        education: {
          highestEducation: studentProfile.highestEducation,
          gpa: studentProfile.gpa,
          schools: studentProfile.schools || [],
          testScores: studentProfile.tests || []
        },
        preferences: {
          studyLevels: studentProfile.studyLevels || ['Undergraduate', 'Graduate'],
          studyCountries: studentProfile.studyCountries || ['Jamaica', 'United States', 'Canada', 'United Kingdom'],
          disciplines: studentProfile.disciplines || ['Computer Science', 'Business Administration', 'Engineering'],
          careerGoals: studentProfile.careerGoals || 'Technology sector career'
        },
        workExperience: studentProfile.workExperiences || []
      };
      
      // Create a prompt for OpenAI
      const systemMessage = `You are an expert educational counselor specializing in university programs. Your task is to analyze student profile data and recommend the most suitable academic programs.
      
      Consider the following factors in your recommendations:
      1. Academic history and qualifications (GPA, test scores, previous education)
      2. Career goals and personal interests
      3. Preferred study locations and disciplines
      4. Suitability of program level (undergraduate, graduate, etc.)
      
      For each recommendation, provide:
      - A match score (percentage from 0-100)
      - Specific reasons why this program is a good match
      - Program details (university, location, level, discipline)
      
      Focus on being specific and personalized. If the student profile is incomplete, make reasonable assumptions based on available data.`;

      const userMessage = `Given the following student profile, recommend 5 suitable academic programs. Prioritize programs that match the student's qualifications, preferences, and career goals. Don't recommend any program with IDs in this list: [${existingProgramIds.join(', ')}].
      
      Student Profile:
      ${JSON.stringify(profileData, null, 2)}
      
      Provide your recommendations in a structured JSON format as follows:
      {
        "recommendations": [
          {
            "programName": "Program Name",
            "universityName": "University Name",
            "universityLocation": "Country/Region",
            "matchScore": 85,
            "matchReasons": ["Reason 1", "Reason 2", "Reason 3", "Reason 4"],
            "level": "Undergraduate/Graduate/etc.",
            "discipline": "Subject Area",
            "degree": "Degree Type (Optional)"
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Using the latest model
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" }, // Request JSON response
        temperature: 0.7 // Some creativity while maintaining relevance
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      // Parse the JSON response
      const parsedContent = JSON.parse(content);
      // Extract recommendations array - the structure depends on how OpenAI formats its response
      const recommendations = parsedContent.recommendations || parsedContent;
      
      return recommendations;
    } catch (error: any) {
      console.error("OpenAI recommendation generation failed:", error.message);
      throw new Error(`Failed to generate program recommendations: ${error.message}`);
    }
  }
}

export default new OpenAIService();
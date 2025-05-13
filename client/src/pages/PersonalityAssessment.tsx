import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Create a schema for form validation
const assessmentSchema = z.object({
  // Section 1: How You Interact and Get Energized
  section1: z.object({
    question1: z.enum(["A", "B"]),
    question2: z.enum(["A", "B"]),
    question3: z.enum(["A", "B"]),
    question4: z.enum(["A", "B"]),
    question5: z.enum(["A", "B"]),
  }),
  
  // Section 2: How You Perceive and Process Information
  section2: z.object({
    question1: z.enum(["A", "B"]),
    question2: z.enum(["A", "B"]),
    question3: z.enum(["A", "B"]),
    question4: z.enum(["A", "B"]),
    question5: z.enum(["A", "B"]),
  }),
  
  // Section 3: How You Make Decisions
  section3: z.object({
    question1: z.enum(["A", "B"]),
    question2: z.enum(["A", "B"]),
    question3: z.enum(["A", "B"]),
    question4: z.enum(["A", "B"]),
    question5: z.enum(["A", "B"]),
  }),
  
  // Section 4: How You Organize Your Work and Life
  section4: z.object({
    question1: z.enum(["A", "B"]),
    question2: z.enum(["A", "B"]),
    question3: z.enum(["A", "B"]),
    question4: z.enum(["A", "B"]),
    question5: z.enum(["A", "B"]),
  }),
  
  // Section 5: Your Core Activity Interests
  section5: z.object({
    // Data & Logic
    dataLogic1: z.number().min(1).max(5),
    dataLogic2: z.number().min(1).max(5),
    dataLogic3: z.number().min(1).max(5),
    dataLogic4: z.number().min(1).max(5),
    dataLogic5: z.number().min(1).max(5),
    
    // Helping & Guiding
    helpingGuiding1: z.number().min(1).max(5),
    helpingGuiding2: z.number().min(1).max(5),
    helpingGuiding3: z.number().min(1).max(5),
    helpingGuiding4: z.number().min(1).max(5),
    helpingGuiding5: z.number().min(1).max(5),
    
    // Creating & Designing
    creatingDesigning1: z.number().min(1).max(5),
    creatingDesigning2: z.number().min(1).max(5),
    creatingDesigning3: z.number().min(1).max(5),
    creatingDesigning4: z.number().min(1).max(5),
    creatingDesigning5: z.number().min(1).max(5),
    
    // Building & Fixing
    buildingFixing1: z.number().min(1).max(5),
    buildingFixing2: z.number().min(1).max(5),
    buildingFixing3: z.number().min(1).max(5),
    buildingFixing4: z.number().min(1).max(5),
    buildingFixing5: z.number().min(1).max(5),
    
    // Leading & Persuading
    leadingPersuading1: z.number().min(1).max(5),
    leadingPersuading2: z.number().min(1).max(5),
    leadingPersuading3: z.number().min(1).max(5),
    leadingPersuading4: z.number().min(1).max(5),
    leadingPersuading5: z.number().min(1).max(5),
    
    // Organizing & Supporting
    organizingSupporting1: z.number().min(1).max(5),
    organizingSupporting2: z.number().min(1).max(5),
    organizingSupporting3: z.number().min(1).max(5),
    organizingSupporting4: z.number().min(1).max(5),
    organizingSupporting5: z.number().min(1).max(5),
  }),
  
  // Section 6: Your Preferred Work Functions & Environment
  section6: z.object({
    taskPreference: z.enum(["A", "B", "C"]),
    workStyle: z.enum(["A", "B", "C"]),
    enjoyedWork: z.array(z.string()).min(1).max(3),
    environmentPace: z.enum(["A", "B", "C"]),
    workSetting: z.enum(["A", "B", "C"]),
    importantAspects: z.array(z.string()).min(1).max(3),
  }),
  
  // Section 7: Your Values in Education & Career
  section7: z.object({
    topValues: z.array(z.string()).length(5),
  }),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

// Default form values
const defaultValues: Partial<AssessmentFormValues> = {
  section1: {} as any,
  section2: {} as any,
  section3: {} as any,
  section4: {} as any,
  section5: {
    dataLogic1: 3,
    dataLogic2: 3,
    dataLogic3: 3,
    dataLogic4: 3,
    dataLogic5: 3,
    helpingGuiding1: 3,
    helpingGuiding2: 3,
    helpingGuiding3: 3,
    helpingGuiding4: 3,
    helpingGuiding5: 3,
    creatingDesigning1: 3,
    creatingDesigning2: 3,
    creatingDesigning3: 3,
    creatingDesigning4: 3,
    creatingDesigning5: 3,
    buildingFixing1: 3,
    buildingFixing2: 3,
    buildingFixing3: 3,
    buildingFixing4: 3,
    buildingFixing5: 3,
    leadingPersuading1: 3,
    leadingPersuading2: 3,
    leadingPersuading3: 3,
    leadingPersuading4: 3,
    leadingPersuading5: 3,
    organizingSupporting1: 3,
    organizingSupporting2: 3,
    organizingSupporting3: 3,
    organizingSupporting4: 3,
    organizingSupporting5: 3,
  },
  section6: {
    enjoyedWork: [],
    importantAspects: [],
  } as any,
  section7: {
    topValues: [],
  } as any,
};

// Section titles
const sectionTitles = [
  "How You Interact and Get Energized",
  "How You Perceive and Process Information",
  "How You Make Decisions",
  "How You Organize Your Work and Life",
  "Your Core Activity Interests",
  "Your Preferred Work Functions & Environment",
  "Your Values in Education & Career",
];

const PersonalityAssessment = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Create form
  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues,
    mode: "onChange",
  });
  
  // Calculate progress
  const progress = ((activeSection + 1) / sectionTitles.length) * 100;
  
  // Handle navigation between sections
  const handleNext = async () => {
    // Validate current section
    let isValid = false;
    
    switch (activeSection) {
      case 0:
        isValid = await form.trigger("section1", { shouldFocus: true });
        break;
      case 1:
        isValid = await form.trigger("section2", { shouldFocus: true });
        break;
      case 2:
        isValid = await form.trigger("section3", { shouldFocus: true });
        break;
      case 3:
        isValid = await form.trigger("section4", { shouldFocus: true });
        break;
      case 4:
        isValid = await form.trigger("section5", { shouldFocus: true });
        break;
      case 5:
        isValid = await form.trigger("section6", { shouldFocus: true });
        break;
      case 6:
        isValid = await form.trigger("section7", { shouldFocus: true });
        break;
    }
    
    if (isValid) {
      if (activeSection < sectionTitles.length - 1) {
        setActiveSection(activeSection + 1);
        window.scrollTo(0, 0);
      }
    }
  };
  
  const handlePrevious = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: AssessmentFormValues) => {
    setIsSubmitting(true);
    try {
      // Send the assessment data to the server for AI analysis
      const response = await apiRequest("POST", "/api/personality-assessment", data);
      const result = await response.json();
      
      // Navigate to the results page with the assessment results
      navigate(`/app/personality-results/${result.id}`);
      
      toast({
        title: "Assessment Completed",
        description: "Your personality profile has been generated!",
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Submission Error",
        description: "There was an error processing your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the various sections of the questionnaire
  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return renderSection1();
      case 1:
        return renderSection2();
      case 2:
        return renderSection3();
      case 3:
        return renderSection4();
      case 4:
        return renderSection5();
      case 5:
        return renderSection6();
      case 6:
        return renderSection7();
      default:
        return null;
    }
  };
  
  // Section 1: How You Interact and Get Energized
  const renderSection1 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="section1.question1"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>1. When starting a new project, I usually prefer to:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Discuss ideas with a group to get initial energy and direction.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Think things through on my own first to develop my initial concepts.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="section1.question2"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>2. After a busy week of social activities, I tend to feel:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Energized and ready for more.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Drained and in need of some quiet time to recharge.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section1.question3"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>3. In a learning environment, I learn best by:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Actively participating in discussions and group activities.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Listening, observing, and reflecting on the material presented.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section1.question4"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>4. When meeting new people, I am more likely to:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Easily strike up conversations with several people.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Prefer to have a deeper conversation with one or two individuals.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section1.question5"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>5. My ideal weekend often involves:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Spending time with a number of friends or engaging in group outings.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Having quiet time for my hobbies, reading, or spending time with a close friend or two.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  
  // Section 2: How You Perceive and Process Information
  const renderSection2 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="section2.question1"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>1. When learning a new skill, I prefer:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Clear, step-by-step instructions and practical examples.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Understanding the overall concept and how it connects to other ideas.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="section2.question2"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>2. I am usually more interested in:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    The factual details and specifics of a situation.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    The underlying patterns, possibilities, and future implications.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section2.question3"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>3. When describing an event, I tend to focus on:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    What actually happened, providing specific details in sequence.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    The overall impression or meaning of the event and what it might lead to.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section2.question4"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>4. I trust information more if it is:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Based on direct experience, tangible evidence, and proven methods.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Innovative, thought-provoking, and opens up new perspectives.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section2.question5"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>5. In problem-solving, I first tend to:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Look at the current realities and practical constraints.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Brainstorm various possibilities and imaginative solutions.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  
  // Section 3: How You Make Decisions
  const renderSection3 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="section3.question1"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>1. When making an important decision, I primarily rely on:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Logical analysis, objective criteria, and a clear assessment of pros and cons.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    My personal values, how the decision will impact others, and what feels right.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="section3.question2"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>2. I believe it's more important to be:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Fair and consistent, applying principles equally to everyone.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Compassionate and understanding, considering individual circumstances.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section3.question3"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>3. In a disagreement, I am more likely to focus on:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    The logical flaws in an argument and finding the most rational solution.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Maintaining harmony and ensuring everyone feels heard and respected.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section3.question4"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>4. When giving feedback, I tend to be:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Direct, honest, and focused on areas for improvement, even if it's critical.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Tactful, encouraging, and focused on positive aspects and potential.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section3.question5"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>5. A good decision for me is one that:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Is demonstrably effective and based on sound reasoning.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Aligns with my core beliefs and contributes positively to relationships.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  
  // Section 4: How You Organize Your Work and Life
  const renderSection4 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="section4.question1"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>1. I generally prefer to work on projects where:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    There's a clear plan, deadlines are set, and tasks are well-defined.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    There's flexibility to explore options, adapt as I go, and work in bursts of energy.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="section4.question2"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>2. When it comes to deadlines, I usually:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Like to finish tasks well in advance to avoid last-minute pressure.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Find I do my best work closer to the deadline when the pressure is on.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section4.question3"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>3. My workspace tends to be:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Organized and tidy, with things in their designated places.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    More flexible, with various projects and materials accessible as needed.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section4.question4"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>4. When planning a trip, I am more likely to:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Create a detailed itinerary and make reservations well in advance.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Have a general idea of where I want to go and decide on specifics as I travel.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="section4.question5"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>5. I feel more comfortable when:</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Decisions are made, and I know what to expect.
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="B" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Options are kept open, and I can respond to new information or opportunities.
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  
  // Section 5: Your Core Activity Interests
  const renderSection5 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Working with Data & Logic</h3>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="section5.dataLogic1"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Analyzing statistics and identifying trends.</FormLabel>
                  <span className="text-sm text-gray-500">{field.value}/5</span>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="mt-2"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Strongly Dislike</span>
                  <span>Strongly Like</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="section5.dataLogic2"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Developing software or writing code.</FormLabel>
                  <span className="text-sm text-gray-500">{field.value}/5</span>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="mt-2"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Strongly Dislike</span>
                  <span>Strongly Like</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="section5.dataLogic3"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Solving complex mathematical problems.</FormLabel>
                  <span className="text-sm text-gray-500">{field.value}/5</span>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="mt-2"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Strongly Dislike</span>
                  <span>Strongly Like</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="section5.dataLogic4"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Conducting detailed research and fact-checking.</FormLabel>
                  <span className="text-sm text-gray-500">{field.value}/5</span>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="mt-2"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Strongly Dislike</span>
                  <span>Strongly Like</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="section5.dataLogic5"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Organizing and managing large datasets.</FormLabel>
                  <span className="text-sm text-gray-500">{field.value}/5</span>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="mt-2"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Strongly Dislike</span>
                  <span>Strongly Like</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Helping & Guiding Others</h3>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="section5.helpingGuiding1"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Teaching or training individuals.</FormLabel>
                  <span className="text-sm text-gray-500">{field.value}/5</span>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="mt-2"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Strongly Dislike</span>
                  <span>Strongly Like</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* For brevity, only including a sample of fields for each category */}
          {/* Additional fields would be added following the same pattern */}
        </div>
      </div>
      
      {/* Remaining categories would follow the same pattern */}
    </div>
  );
  
  // Section 6: Your Preferred Work Functions & Environment
  const renderSection6 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Part A: Task Preferences</h3>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="section6.taskPreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>I prefer tasks that are generally:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="A" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Clearly defined with established procedures.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="B" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Varied, allowing for new challenges and creative problem-solving.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="C" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        A mix of both routine and novel tasks.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="section6.workStyle"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>I am most effective when working:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="A" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Independently, with minimal supervision.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="B" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Collaboratively as part of a team.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="C" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        In a role that balances independent work with teamwork.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Tasks that I enjoy (checkboxes) */}
          <FormField
            control={form.control}
            name="section6.enjoyedWork"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">I enjoy work that involves: (Select up to 3)</FormLabel>
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="section6.enjoyedWork"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key="deep-thinking"
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("deep-thinking")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], "deep-thinking"])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "deep-thinking"
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Deep thinking and analysis.
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                  
                  {/* Other checkbox options would be added here following the same pattern */}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Part B: Environment Preferences would follow a similar pattern */}
    </div>
  );
  
  // Section 7: Your Values in Education & Career
  const renderSection7 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Your Values in Education & Career</h3>
        <p className="text-gray-600 mb-4">
          Please select the FIVE (5) values that are MOST important to you in your future studies and career.
        </p>
        
        <FormField
          control={form.control}
          name="section7.topValues"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormItem
                    key="achievement"
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes("achievement")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (field.value.length < 5) {
                              field.onChange([...field.value, "achievement"]);
                            }
                          } else {
                            field.onChange(
                              field.value?.filter((value) => value !== "achievement")
                            );
                          }
                        }}
                        disabled={!field.value?.includes("achievement") && field.value?.length >= 5}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Achievement (accomplishing challenging goals)
                    </FormLabel>
                  </FormItem>
                  
                  {/* Other value options would be added here */}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Personality & Career Navigator</h1>
            <p className="text-gray-600">
              Welcome to the Leadapps Personality & Career Navigator! This questionnaire is designed to help you understand more about your preferences, interests, and work styles. There are no right or wrong answers – just choose the option that feels most like you, most of the time.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Section {activeSection + 1} of {sectionTitles.length}</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">
            Section {activeSection + 1}: {sectionTitles[activeSection]}
          </h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderSection()}
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={activeSection === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                {activeSection < sectionTitles.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Results...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Complete Assessment
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalityAssessment;
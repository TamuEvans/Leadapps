// CSEC English A & B Study Content System
// Based on the official CXC syllabus

export interface StudyNote {
  id: string;
  title: string;
  subject: 'English A' | 'English B';
  topic: string;
  content: string;
  keyPoints: string[];
  examples: string[];
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

export interface Flashcard {
  id: string;
  subject: 'English A' | 'English B';
  topic: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

export interface Question {
  id: string;
  subject: 'English A' | 'English B';
  paper: string;
  topic: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

export interface PracticeTest {
  id: string;
  title: string;
  subject: 'English A' | 'English B';
  paper: string;
  duration: number; // minutes
  totalMarks: number;
  questions: Question[];
  instructions: string;
}

// CSEC English A Study Notes
export const englishAStudyNotes: StudyNote[] = [
  {
    id: 'ea-comp-1',
    title: 'Reading Comprehension Strategies',
    subject: 'English A',
    topic: 'Comprehension',
    content: `Reading comprehension is a fundamental skill in CSEC English A. It involves understanding explicit and implicit meanings, making inferences, and analyzing texts critically.

Key strategies include:
1. Preview the text before reading
2. Identify the main idea and supporting details
3. Look for context clues to understand unfamiliar words
4. Make connections between ideas
5. Draw logical conclusions and inferences`,
    keyPoints: [
      'Recognize facts stated explicitly',
      'Extract specific and implied information',
      'Identify time sequences and cause-effect relationships',
      'Distinguish between main and subordinate ideas',
      'Differentiate denotative and connotative language'
    ],
    examples: [
      'Explicit information: "The meeting will be held at 3 PM"',
      'Implicit information: "She glanced at her watch nervously" (implies concern about time)',
      'Denotative: "Home" = a place where one lives',
      'Connotative: "Home" = comfort, security, belonging'
    ],
    difficulty: 'Basic'
  },
  {
    id: 'ea-gram-1',
    title: 'Parts of Speech and Grammar',
    subject: 'English A',
    topic: 'Grammar',
    content: `Understanding parts of speech is essential for effective communication in Caribbean Standard English (CSE).

The eight parts of speech are:
1. Nouns - naming words (person, place, thing, idea)
2. Pronouns - replace nouns (he, she, it, they)
3. Verbs - action or being words (run, think, is, were)
4. Adjectives - describe nouns (beautiful, large, green)
5. Adverbs - modify verbs, adjectives, or other adverbs (quickly, very, well)
6. Prepositions - show relationships (in, on, under, between)
7. Conjunctions - join words or groups (and, but, or, because)
8. Interjections - express emotion (oh!, wow!, alas!)`,
    keyPoints: [
      'Nouns can be common, proper, concrete, abstract, collective',
      'Verbs show tense (past, present, future) and mood',
      'Adjectives can be comparative or superlative',
      'Adverbs often end in -ly but not always',
      'Prepositions are followed by objects'
    ],
    examples: [
      'Proper noun: Jamaica, Caribbean, John',
      'Abstract noun: happiness, freedom, love',
      'Comparative adjective: taller, more beautiful',
      'Superlative adjective: tallest, most beautiful'
    ],
    difficulty: 'Basic'
  },
  {
    id: 'ea-writ-1',
    title: 'Essay Writing Structure',
    subject: 'English A',
    topic: 'Writing',
    content: `A well-structured essay follows a clear organizational pattern that helps readers understand your ideas effectively.

Basic Essay Structure:
1. Introduction (1 paragraph)
   - Hook to grab attention
   - Background information
   - Clear thesis statement

2. Body (2-3 paragraphs)
   - Topic sentence for each paragraph
   - Supporting evidence and examples
   - Smooth transitions between ideas

3. Conclusion (1 paragraph)
   - Restate thesis in new words
   - Summarize main points
   - End with impact statement`,
    keyPoints: [
      'Thesis statement should be specific and arguable',
      'Each body paragraph should focus on one main idea',
      'Use transitions to connect paragraphs',
      'Support arguments with relevant examples',
      'Maintain consistent tone and style'
    ],
    examples: [
      'Hook: "Imagine a world without music..."',
      'Thesis: "Social media has both positive and negative effects on teenage relationships"',
      'Transition: "Furthermore," "In contrast," "As a result"',
      'Topic sentence: "The first benefit of exercise is improved physical health"'
    ],
    difficulty: 'Intermediate'
  }
];

// CSEC English B Study Notes  
export const englishBStudyNotes: StudyNote[] = [
  {
    id: 'eb-lit-1',
    title: 'Literary Devices and Techniques',
    subject: 'English B',
    topic: 'Literary Analysis',
    content: `Literary devices are techniques writers use to create meaning, develop themes, and engage readers. Understanding these devices is crucial for analyzing texts effectively.

Major Literary Devices:
1. Metaphor - direct comparison without "like" or "as"
2. Simile - comparison using "like" or "as"
3. Personification - giving human qualities to non-human things
4. Symbolism - using objects to represent deeper meanings
5. Irony - contrast between expectation and reality
6. Imagery - vivid descriptive language appealing to senses
7. Alliteration - repetition of initial consonant sounds
8. Foreshadowing - hints about future events`,
    keyPoints: [
      'Metaphors create vivid mental images',
      'Symbols often represent universal themes',
      'Irony can be verbal, situational, or dramatic',
      'Imagery appeals to sight, sound, touch, taste, smell',
      'Literary devices work together to create effect'
    ],
    examples: [
      'Metaphor: "Life is a journey"',
      'Simile: "Brave as a lion"',
      'Personification: "The wind whispered"',
      'Symbol: Dove representing peace',
      'Verbal irony: Saying "Great weather!" during a storm'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'eb-poet-1',
    title: 'Poetry Analysis Techniques',
    subject: 'English B',
    topic: 'Poetry',
    content: `Poetry analysis involves examining the technical and thematic elements that contribute to a poem's meaning and impact.

Key Elements to Analyze:
1. Form and Structure
   - Rhyme scheme (ABAB, AABB, etc.)
   - Meter and rhythm
   - Stanza organization
   - Line breaks and enjambment

2. Sound Devices
   - Rhyme (perfect, slant, internal)
   - Alliteration and assonance
   - Onomatopoeia
   - Repetition and refrain

3. Figurative Language
   - Metaphors and similes
   - Personification
   - Hyperbole and understatement

4. Theme and Meaning
   - Central message or idea
   - Tone and mood
   - Speaker's perspective`,
    keyPoints: [
      'Form affects meaning and emotional impact',
      'Sound devices create musical quality',
      'Figurative language adds depth and complexity',
      'Consider cultural and historical context',
      'Look for patterns and contrasts'
    ],
    examples: [
      'ABAB rhyme: "Shall I compare thee to a summer\'s day? (A) / Thou art more lovely and more temperate (B)"',
      'Alliteration: "Peter Piper picked"',
      'Internal rhyme: "Once upon a midnight dreary"',
      'Enjambment: Line continues without pause to next line'
    ],
    difficulty: 'Advanced'
  }
];

// CSEC English Flashcards
export const englishFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    subject: 'English A',
    topic: 'Grammar',
    question: 'What is a noun?',
    answer: 'A word that names a person, place, thing, or idea',
    explanation: 'Nouns are the building blocks of sentences and can be concrete (physical) or abstract (concepts)',
    difficulty: 'Basic'
  },
  {
    id: 'fc-2',
    subject: 'English A',
    topic: 'Comprehension',
    question: 'What is the difference between explicit and implicit information?',
    answer: 'Explicit information is directly stated; implicit information is suggested or implied',
    explanation: 'Explicit = clearly stated, Implicit = requires inference from context clues',
    difficulty: 'Intermediate'
  },
  {
    id: 'fc-3',
    subject: 'English B',
    topic: 'Literary Devices',
    question: 'What is a metaphor?',
    answer: 'A direct comparison between two unlike things without using "like" or "as"',
    explanation: 'Example: "Her voice is music to my ears" - directly compares voice to music',
    difficulty: 'Basic'
  },
  {
    id: 'fc-4',
    subject: 'English B',
    topic: 'Poetry',
    question: 'What is enjambment?',
    answer: 'The continuation of a sentence or phrase from one line of poetry to the next',
    explanation: 'Creates flow and can emphasize certain words or ideas by their placement',
    difficulty: 'Advanced'
  },
  {
    id: 'fc-5',
    subject: 'English A',
    topic: 'Writing',
    question: 'What are the three main parts of an essay?',
    answer: 'Introduction, Body, and Conclusion',
    explanation: 'Introduction presents thesis, Body develops arguments, Conclusion summarizes and reinforces main points',
    difficulty: 'Basic'
  }
];

// Sample Questions for Question Bank
export const englishQuestions: Question[] = [
  {
    id: 'q-1',
    subject: 'English A',
    paper: 'Paper 1',
    topic: 'Comprehension',
    question: 'In the passage, the author\'s main purpose is to:',
    options: [
      'A) Entertain readers with an amusing story',
      'B) Inform readers about environmental issues',
      'C) Persuade readers to take action',
      'D) Describe a personal experience'
    ],
    correctAnswer: 'B',
    explanation: 'The passage primarily provides factual information about environmental concerns, making it informative rather than persuasive or entertaining.',
    marks: 1,
    difficulty: 'Intermediate'
  },
  {
    id: 'q-2',
    subject: 'English A',
    paper: 'Paper 2',
    topic: 'Grammar',
    question: 'Choose the sentence with correct subject-verb agreement:',
    options: [
      'A) The group of students are arriving soon',
      'B) The group of students is arriving soon', 
      'C) The groups of student is arriving soon',
      'D) The groups of student are arriving soon'
    ],
    correctAnswer: 'B',
    explanation: 'The subject "group" is singular, so it requires the singular verb "is". The prepositional phrase "of students" does not affect the verb agreement.',
    marks: 1,
    difficulty: 'Basic'
  },
  {
    id: 'q-3',
    subject: 'English B',
    paper: 'Paper 3',
    topic: 'Literary Analysis',
    question: 'The use of seasonal imagery in the poem primarily serves to:',
    options: [
      'A) Create a realistic setting',
      'B) Symbolize the cycle of life and death',
      'C) Provide historical context',
      'D) Appeal to the reader\'s senses'
    ],
    correctAnswer: 'B',
    explanation: 'Seasonal imagery is commonly used symbolically to represent life cycles, with spring representing birth/renewal and winter representing death/ending.',
    marks: 2,
    difficulty: 'Advanced'
  }
];

// Practice Tests
export const practicTests: PracticeTest[] = [
  {
    id: 'pt-1',
    title: 'English A Paper 1 Practice Test',
    subject: 'English A',
    paper: 'Paper 1',
    duration: 90,
    totalMarks: 60,
    questions: [
      // Would include full set of comprehension questions
    ],
    instructions: `This paper consists of THREE compulsory questions based on three passages.
    
INSTRUCTIONS:
- Answer ALL questions
- Write your answers in the spaces provided
- You are advised to spend no more than 30 minutes on each passage
- Read each passage carefully before attempting the questions`
  }
];
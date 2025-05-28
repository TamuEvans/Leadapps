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

// Study Focus Areas for CSEC English A & B
export const studyFocusAreas = {
  englishA: [
    'Reading Comprehension',
    'Grammar & Language Usage',
    'Essay Writing',
    'Summary Writing',
    'Report Writing',
    'Formal Letter Writing',
    'Speech Writing',
    'Caribbean Standard English',
    'Language Registers & Styles',
    'Critical Analysis Skills'
  ],
  englishB: [
    'Literary Analysis',
    'Poetry Analysis',
    'Prose Analysis',
    'Drama Analysis',
    'Literary Devices',
    'Caribbean Literature',
    'Character Analysis',
    'Theme Development',
    'Writer\'s Craft',
    'Comparative Literature'
  ]
};

// CSEC English A Study Notes
export const englishAStudyNotes: StudyNote[] = [
  {
    id: 'ea-comp-1',
    title: 'Reading Comprehension Strategies',
    subject: 'English A',
    topic: 'Comprehension',
    content: `Reading comprehension is a fundamental skill in CSEC English A. It involves understanding explicit and implicit meanings, making inferences, and analyzing texts critically.

Based on the CXC syllabus, students must demonstrate the ability to:
- Understand meaning conveyed through word choice, grammar, and punctuation
- Extract both explicit and implicit information
- Identify main and subordinate ideas
- Recognize cause and effect relationships
- Distinguish between denotative and connotative language

Key strategies include:
1. Preview the text before reading
2. Identify the main idea and supporting details
3. Look for context clues to understand unfamiliar words
4. Make connections between ideas
5. Draw logical conclusions and inferences
6. Analyze the author's purpose and tone`,
    keyPoints: [
      'Recognize facts stated explicitly',
      'Extract specific and implied information',
      'Identify time sequences and cause-effect relationships',
      'Distinguish between main and subordinate ideas',
      'Differentiate denotative and connotative language',
      'Interpret tables and pictorial communication'
    ],
    examples: [
      'Explicit information: "The meeting will be held at 3 PM"',
      'Implicit information: "She glanced at her watch nervously" (implies concern about time)',
      'Denotative: "Home" = a place where one lives',
      'Connotative: "Home" = comfort, security, belonging',
      'Main idea: Central theme of the passage',
      'Supporting detail: Evidence that backs up the main idea'
    ],
    difficulty: 'Basic'
  },
  {
    id: 'ea-gram-1',
    title: 'Caribbean Standard English Grammar',
    subject: 'English A',
    topic: 'Grammar',
    content: `Caribbean Standard English (CSE) is the standard form of English used in formal communication across the Caribbean. Understanding CSE grammar is essential for effective written and spoken communication.

Key Grammar Areas from the CXC Syllabus:

Parts of Speech:
1. Nouns - naming words (person, place, thing, idea)
2. Pronouns - replace nouns (he, she, it, they)
3. Verbs - action or being words (run, think, is, were)
4. Adjectives - describe nouns (beautiful, large, green)
5. Adverbs - modify verbs, adjectives, or other adverbs (quickly, very, well)
6. Prepositions - show relationships (in, on, under, between)
7. Conjunctions - join words or groups (and, but, or, because)
8. Interjections - express emotion (oh!, wow!, alas!)

Sentence Structure:
- Simple sentences (one independent clause)
- Compound sentences (two or more independent clauses)
- Complex sentences (independent clause + dependent clause)
- Compound-complex sentences`,
    keyPoints: [
      'Use appropriate grammatical forms in speaking and writing',
      'Understand subject-verb agreement rules',
      'Master verb tenses and their usage',
      'Apply correct punctuation and paragraphing',
      'Distinguish between formal and informal language',
      'Recognize and correct common grammatical errors'
    ],
    examples: [
      'Proper noun: Jamaica, Caribbean, John',
      'Abstract noun: happiness, freedom, love',
      'Simple sentence: "The students studied hard."',
      'Complex sentence: "Because they studied hard, the students passed the exam."',
      'Formal register: "I would like to request..."',
      'Informal register: "Can I have..."'
    ],
    difficulty: 'Basic'
  },
  {
    id: 'ea-writ-1',
    title: 'Essay Writing Mastery',
    subject: 'English A',
    topic: 'Writing',
    content: `Essay writing is a critical component of CSEC English A Paper 2. Students must demonstrate the ability to organize ideas coherently and express themselves clearly in various essay types.

Types of Essays (Based on CXC Requirements):
1. Argumentative Essays - Present and defend a position
2. Expository Essays - Explain or inform about a topic
3. Narrative Essays - Tell a story or recount events
4. Descriptive Essays - Paint a picture with words

Essay Structure:
1. Introduction (1 paragraph)
   - Hook to grab attention
   - Background information
   - Clear thesis statement

2. Body (2-4 paragraphs)
   - Topic sentence for each paragraph
   - Supporting evidence and examples
   - Smooth transitions between ideas
   - Logical development of arguments

3. Conclusion (1 paragraph)
   - Restate thesis in new words
   - Summarize main points
   - End with impact statement or call to action

Language and Style:
- Use appropriate register for the audience
- Employ varied sentence structures
- Choose precise vocabulary
- Maintain consistent tone throughout`,
    keyPoints: [
      'Develop a clear and focused thesis statement',
      'Use logical organization and sequencing',
      'Support arguments with relevant examples and evidence',
      'Employ appropriate transitions between paragraphs',
      'Maintain consistent tone and style',
      'Demonstrate command of Caribbean Standard English'
    ],
    examples: [
      'Argumentative thesis: "Social media has more negative than positive effects on teenage relationships"',
      'Expository thesis: "Climate change affects the Caribbean through rising sea levels, increased hurricanes, and coral bleaching"',
      'Strong hook: "Imagine walking into a classroom where no student owns a book"',
      'Effective transition: "Furthermore," "In contrast," "As a result," "Similarly"'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'ea-summ-1',
    title: 'Summary Writing Techniques',
    subject: 'English A',
    topic: 'Summary',
    content: `Summary writing is a key skill assessed in CSEC English A. It requires the ability to identify main ideas, condense information, and present it clearly in your own words.

CXC Summary Requirements:
- Usually 120-160 words
- Focus on specific content points
- Use your own words (paraphrase)
- Maintain logical sequence
- Avoid personal opinions or examples not in the original text

Steps for Effective Summary Writing:
1. Read the passage carefully 2-3 times
2. Identify the main ideas and key supporting details
3. List the content points mentioned in the question
4. Write in your own words, avoiding copying phrases
5. Count words and edit to meet word limit
6. Check for clarity and logical flow

Common Mistakes to Avoid:
- Copying directly from the passage
- Including irrelevant information
- Adding personal opinions
- Exceeding or falling short of word count
- Poor organization of ideas`,
    keyPoints: [
      'Identify main ideas and supporting details',
      'Paraphrase effectively using your own words',
      'Maintain logical sequence of ideas',
      'Stay within the specified word count',
      'Focus only on information requested',
      'Use clear, concise language'
    ],
    examples: [
      'Original: "The government implemented new policies" → Summary: "New policies were introduced"',
      'Original: "Students who study regularly tend to perform better" → Summary: "Regular study improves performance"',
      'Content point identification: Look for causes, effects, advantages, problems, solutions',
      'Word count management: Aim for 10-15% below the maximum limit'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'ea-lett-1',
    title: 'Formal Letter Writing',
    subject: 'English A',
    topic: 'Letter Writing',
    content: `Formal letter writing is an essential communication skill tested in CSEC English A Paper 2. Students must demonstrate knowledge of proper format, tone, and language conventions.

Types of Formal Letters:
1. Letters of Complaint
2. Letters of Application
3. Letters of Request
4. Letters to Newspapers (Editor)
5. Business Correspondence

Formal Letter Format:
1. Sender's Address (top right)
2. Date (below sender's address)
3. Recipient's Address (left margin)
4. Salutation (Dear Sir/Madam, Dear Mr./Ms.)
5. Subject Line (optional but recommended)
6. Body Paragraphs (introduction, main content, conclusion)
7. Complimentary Close (Yours faithfully/sincerely)
8. Signature and printed name

Language and Tone:
- Use formal register throughout
- Be polite but assertive when necessary
- Use clear, concise sentences
- Avoid contractions and informal expressions
- Employ appropriate vocabulary for the context`,
    keyPoints: [
      'Follow proper formal letter format',
      'Use appropriate salutation and closing',
      'Maintain formal tone throughout',
      'Organize content in logical paragraphs',
      'State purpose clearly in opening paragraph',
      'Use correct grammar and punctuation'
    ],
    examples: [
      'Complaint opening: "I am writing to express my dissatisfaction with..."',
      'Request opening: "I would like to request information about..."',
      'Application opening: "I am writing to apply for the position of..."',
      'Formal closing: "I look forward to your prompt response"',
      'Professional signature: "Yours faithfully, [Full Name]"'
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

// CSEC English Flashcards - Fun and Colorful Content
export const englishFlashcards: Flashcard[] = [
  // English A Grammar Flashcards
  {
    id: 'fc-gram-1',
    subject: 'English A',
    topic: 'Grammar',
    question: '🏷️ What is a noun?',
    answer: 'A word that names a person, place, thing, or idea',
    explanation: 'Nouns are the building blocks of sentences! Examples: teacher, Jamaica, happiness, freedom',
    difficulty: 'Basic'
  },
  {
    id: 'fc-gram-2',
    subject: 'English A',
    topic: 'Grammar',
    question: '🔄 Which sentence shows correct subject-verb agreement?',
    answer: 'The group of students IS arriving (not ARE arriving)',
    explanation: 'The subject "group" is singular, so use "is". Don\'t be fooled by "students" in the prepositional phrase!',
    difficulty: 'Intermediate'
  },
  {
    id: 'fc-gram-3',
    subject: 'English A',
    topic: 'Grammar',
    question: '⚡ What\'s the difference between "affect" and "effect"?',
    answer: 'AFFECT = verb (to influence), EFFECT = noun (result)',
    explanation: 'Memory trick: A-ffect = A-ction (verb), E-ffect = E-nd result (noun). "The rain affected the game; the effect was cancellation."',
    difficulty: 'Intermediate'
  },
  
  // English A Comprehension Flashcards
  {
    id: 'fc-comp-1',
    subject: 'English A',
    topic: 'Comprehension',
    question: '🔍 Explicit vs Implicit Information?',
    answer: 'Explicit = directly stated, Implicit = suggested/requires inference',
    explanation: 'Explicit: "It was raining." Implicit: "She grabbed her umbrella on the way out" (suggests rain)',
    difficulty: 'Basic'
  },
  {
    id: 'fc-comp-2',
    subject: 'English A',
    topic: 'Comprehension',
    question: '💭 What is inference?',
    answer: 'Drawing logical conclusions from evidence and clues in the text',
    explanation: 'Like being a detective! Use context clues + your knowledge to figure out what\'s not directly said.',
    difficulty: 'Intermediate'
  },
  {
    id: 'fc-comp-3',
    subject: 'English A',
    topic: 'Comprehension',
    question: '🎯 Denotative vs Connotative meaning?',
    answer: 'Denotative = dictionary definition, Connotative = emotional associations',
    explanation: 'Snake: Denotative = reptile, Connotative = sneaky, dangerous, evil (cultural associations)',
    difficulty: 'Advanced'
  },

  // English A Writing Flashcards
  {
    id: 'fc-writ-1',
    subject: 'English A',
    topic: 'Writing',
    question: '📝 Three parts of an essay?',
    answer: 'Introduction, Body, Conclusion',
    explanation: 'Think of it like a sandwich: intro = top bun (introduces topic), body = filling (main content), conclusion = bottom bun (wraps it up)!',
    difficulty: 'Basic'
  },
  {
    id: 'fc-writ-2',
    subject: 'English A',
    topic: 'Writing',
    question: '🎪 What makes a strong hook?',
    answer: 'A surprising fact, question, quote, or vivid scene that grabs attention',
    explanation: 'Bad: "This essay is about..." Good: "Every 3 seconds, a child learns to read" or "What if schools had no books?"',
    difficulty: 'Intermediate'
  },
  {
    id: 'fc-writ-3',
    subject: 'English A',
    topic: 'Writing',
    question: '🌉 Name 3 transition words',
    answer: 'Furthermore, However, Therefore (or Similarly, In contrast, As a result)',
    explanation: 'Transitions are bridges between ideas! They help your essay flow smoothly from one point to the next.',
    difficulty: 'Basic'
  },

  // English A Summary Writing
  {
    id: 'fc-summ-1',
    subject: 'English A',
    topic: 'Summary',
    question: '📊 How many words in a CSEC summary?',
    answer: '120-160 words typically',
    explanation: 'Always count your words! Aim for about 10-15% below the maximum to be safe. Quality over quantity!',
    difficulty: 'Basic'
  },
  {
    id: 'fc-summ-2',
    subject: 'English A',
    topic: 'Summary',
    question: '🚫 What should you NEVER do in a summary?',
    answer: 'Copy directly from the passage or add your own opinions',
    explanation: 'Use your own words (paraphrase) and stick to ONLY what\'s in the original text. No personal thoughts!',
    difficulty: 'Intermediate'
  },

  // English B Literary Devices
  {
    id: 'fc-lit-1',
    subject: 'English B',
    topic: 'Literary Devices',
    question: '🌟 What is a metaphor?',
    answer: 'A direct comparison between two unlike things without "like" or "as"',
    explanation: 'Example: "Her voice is music to my ears" - directly says voice IS music (not like music)',
    difficulty: 'Basic'
  },
  {
    id: 'fc-lit-2',
    subject: 'English B',
    topic: 'Literary Devices',
    question: '👤 What is personification?',
    answer: 'Giving human characteristics to non-human things',
    explanation: 'Example: "The wind whispered through the trees" - wind can\'t actually whisper (human action)!',
    difficulty: 'Basic'
  },
  {
    id: 'fc-lit-3',
    subject: 'English B',
    topic: 'Literary Devices',
    question: '🎭 What is dramatic irony?',
    answer: 'When readers know something that characters don\'t',
    explanation: 'Like watching a horror movie and yelling "Don\'t go in there!" because you know the killer is hiding inside!',
    difficulty: 'Advanced'
  },
  {
    id: 'fc-lit-4',
    subject: 'English B',
    topic: 'Literary Devices',
    question: '🔤 What is alliteration?',
    answer: 'Repetition of the same consonant sound at the beginning of words',
    explanation: 'Example: "Peter Piper picked a peck of pickled peppers" - lots of P sounds create rhythm and emphasis!',
    difficulty: 'Basic'
  },

  // English B Poetry
  {
    id: 'fc-poet-1',
    subject: 'English B',
    topic: 'Poetry',
    question: '🌊 What is enjambment?',
    answer: 'When a sentence continues from one line to the next without pause',
    explanation: 'Like a waterfall of words! It creates flow and can emphasize certain words by their line position.',
    difficulty: 'Advanced'
  },
  {
    id: 'fc-poet-2',
    subject: 'English B',
    topic: 'Poetry',
    question: '🎵 What is ABAB rhyme scheme?',
    answer: 'The 1st and 3rd lines rhyme, 2nd and 4th lines rhyme',
    explanation: 'Roses are red (A), Violets are blue (B), Sugar is sweet (A), And so are you (B). Classic pattern!',
    difficulty: 'Basic'
  },
  {
    id: 'fc-poet-3',
    subject: 'English B',
    topic: 'Poetry',
    question: '🎪 What is a metaphor in poetry?',
    answer: 'An extended comparison that adds deeper meaning to the poem',
    explanation: 'Poetry metaphors often run through entire verses, creating layers of meaning beyond the surface!',
    difficulty: 'Intermediate'
  },

  // English B Character Analysis
  {
    id: 'fc-char-1',
    subject: 'English B',
    topic: 'Character Analysis',
    question: '🎭 Direct vs Indirect characterization?',
    answer: 'Direct = author tells you traits, Indirect = you infer from actions/dialogue',
    explanation: 'Direct: "John was brave." Indirect: "John rushed into the burning building to save the cat."',
    difficulty: 'Intermediate'
  },
  {
    id: 'fc-char-2',
    subject: 'English B',
    topic: 'Character Analysis',
    question: '🌱 What is character development?',
    answer: 'How a character changes and grows throughout the story',
    explanation: 'Like watching someone learn life lessons! Characters often start one way and end up different (wiser, stronger, etc.)',
    difficulty: 'Basic'
  },

  // Caribbean Literature
  {
    id: 'fc-carib-1',
    subject: 'English B',
    topic: 'Caribbean Literature',
    question: '🏝️ Name a major theme in Caribbean literature',
    answer: 'Identity, colonialism, cultural heritage, migration, or social justice',
    explanation: 'Caribbean writers often explore what it means to be Caribbean, the effects of history, and social issues.',
    difficulty: 'Intermediate'
  },
  {
    id: 'fc-carib-2',
    subject: 'English B',
    topic: 'Caribbean Literature',
    question: '🗣️ What is dialect in Caribbean literature?',
    answer: 'Local language varieties that reflect authentic Caribbean speech patterns',
    explanation: 'Authors use dialect to show character identity, cultural background, and authentic Caribbean voices!',
    difficulty: 'Intermediate'
  }
];

// Comprehensive Question Bank for CSEC English
export const englishQuestions: Question[] = [
  // English A Paper 1 - Comprehension Questions
  {
    id: 'q-comp-1',
    subject: 'English A',
    paper: 'Paper 1',
    topic: 'Comprehension',
    question: 'Based on the passage, the author\'s main purpose is to:',
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
    id: 'q-comp-2',
    subject: 'English A',
    paper: 'Paper 1',
    topic: 'Comprehension',
    question: 'The phrase "breaking new ground" in line 15 means:',
    options: [
      'A) Digging in the soil',
      'B) Starting construction work',
      'C) Doing something innovative',
      'D) Damaging the environment'
    ],
    correctAnswer: 'C',
    explanation: 'This is an idiomatic expression meaning to do something new or innovative, not literal ground-breaking.',
    marks: 1,
    difficulty: 'Basic'
  },
  {
    id: 'q-comp-3',
    subject: 'English A',
    paper: 'Paper 1',
    topic: 'Comprehension',
    question: 'Which statement can be inferred from the passage?',
    options: [
      'A) The problem has a simple solution',
      'B) Government intervention is unnecessary',
      'C) Public awareness is increasing gradually',
      'D) The situation will resolve itself'
    ],
    correctAnswer: 'C',
    explanation: 'The passage implies growing public awareness through context clues, though this is not explicitly stated.',
    marks: 2,
    difficulty: 'Advanced'
  },

  // English A Paper 2 - Grammar Questions
  {
    id: 'q-gram-1',
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
    id: 'q-gram-2',
    subject: 'English A',
    paper: 'Paper 2',
    topic: 'Grammar',
    question: 'Which sentence uses the correct form of "who" or "whom"?',
    options: [
      'A) Who did you give the book to?',
      'B) Whom did you give the book to?',
      'C) Who did you give the book?',
      'D) Whom gave you the book?'
    ],
    correctAnswer: 'B',
    explanation: '"Whom" is the object form and should be used when the pronoun receives the action. "To whom did you give the book?" is the formal correct form.',
    marks: 1,
    difficulty: 'Advanced'
  },
  {
    id: 'q-gram-3',
    subject: 'English A',
    paper: 'Paper 2',
    topic: 'Grammar',
    question: 'Identify the sentence with correct punctuation:',
    options: [
      'A) The students, who studied hard passed the exam.',
      'B) The students who studied hard, passed the exam.',
      'C) The students who studied hard passed the exam.',
      'D) The students; who studied hard, passed the exam.'
    ],
    correctAnswer: 'C',
    explanation: 'The clause "who studied hard" is essential to identify which students, so no commas are needed around it.',
    marks: 1,
    difficulty: 'Intermediate'
  },

  // English B Paper 1 - Multiple Choice
  {
    id: 'q-lit-1',
    subject: 'English B',
    paper: 'Paper 1',
    topic: 'Literary Devices',
    question: 'The line "The wind whispered secrets through the trees" contains:',
    options: [
      'A) Metaphor',
      'B) Personification',
      'C) Simile',
      'D) Alliteration'
    ],
    correctAnswer: 'B',
    explanation: 'Personification gives human qualities (whispering) to non-human things (wind). The wind cannot literally whisper.',
    marks: 1,
    difficulty: 'Basic'
  },
  {
    id: 'q-lit-2',
    subject: 'English B',
    paper: 'Paper 1',
    topic: 'Poetry',
    question: 'In the rhyme scheme ABAB, which lines rhyme?',
    options: [
      'A) Lines 1 and 2, lines 3 and 4',
      'B) Lines 1 and 3, lines 2 and 4',
      'C) Lines 1 and 4, lines 2 and 3',
      'D) All lines rhyme'
    ],
    correctAnswer: 'B',
    explanation: 'In ABAB pattern, the first and third lines rhyme (A), and the second and fourth lines rhyme (B).',
    marks: 1,
    difficulty: 'Basic'
  },
  {
    id: 'q-lit-3',
    subject: 'English B',
    paper: 'Paper 1',
    topic: 'Character Analysis',
    question: 'When an author directly states a character\'s traits, this is called:',
    options: [
      'A) Indirect characterization',
      'B) Direct characterization',
      'C) Character development',
      'D) Character motivation'
    ],
    correctAnswer: 'B',
    explanation: 'Direct characterization occurs when the author explicitly tells readers about a character\'s traits, rather than showing them through actions.',
    marks: 1,
    difficulty: 'Basic'
  },

  // English B Paper 3 - Literary Analysis
  {
    id: 'q-essay-1',
    subject: 'English B',
    paper: 'Paper 3',
    topic: 'Literary Analysis',
    question: 'The use of seasonal imagery in Caribbean poetry primarily serves to:',
    options: [
      'A) Create a realistic tropical setting',
      'B) Symbolize the cycle of life and death',
      'C) Reflect the colonial experience',
      'D) Appeal to the reader\'s senses'
    ],
    correctAnswer: 'B',
    explanation: 'Seasonal imagery is commonly used symbolically to represent life cycles, with different seasons representing various stages of human experience.',
    marks: 2,
    difficulty: 'Advanced'
  },
  {
    id: 'q-essay-2',
    subject: 'English B',
    paper: 'Paper 3',
    topic: 'Theme Analysis',
    question: 'Which theme is most commonly explored in Caribbean literature?',
    options: [
      'A) Urban modernization',
      'B) Identity and cultural heritage',
      'C) Science fiction concepts',
      'D) Medieval history'
    ],
    correctAnswer: 'B',
    explanation: 'Caribbean literature frequently explores themes of identity, cultural heritage, and the search for belonging in a post-colonial context.',
    marks: 2,
    difficulty: 'Intermediate'
  },
  {
    id: 'q-essay-3',
    subject: 'English B',
    paper: 'Paper 3',
    topic: 'Language Analysis',
    question: 'When Caribbean authors use dialect in their writing, they are primarily:',
    options: [
      'A) Making their work harder to understand',
      'B) Showing off their knowledge of language',
      'C) Preserving authentic Caribbean voices',
      'D) Following literary trends'
    ],
    correctAnswer: 'C',
    explanation: 'The use of dialect in Caribbean literature serves to preserve and celebrate authentic local voices and cultural identity.',
    marks: 2,
    difficulty: 'Advanced'
  },

  // Summary Writing Questions
  {
    id: 'q-summ-1',
    subject: 'English A',
    paper: 'Paper 1',
    topic: 'Summary Writing',
    question: 'In summary writing, you should:',
    options: [
      'A) Copy the best sentences from the passage',
      'B) Add your own opinions and examples',
      'C) Use your own words to convey main ideas',
      'D) Write more than the word limit to be thorough'
    ],
    correctAnswer: 'C',
    explanation: 'Summary writing requires paraphrasing the main ideas in your own words while staying within the word limit and avoiding personal opinions.',
    marks: 1,
    difficulty: 'Basic'
  },
  {
    id: 'q-summ-2',
    subject: 'English A',
    paper: 'Paper 1',
    topic: 'Summary Writing',
    question: 'The typical word count for a CSEC summary is:',
    options: [
      'A) 80-100 words',
      'B) 120-160 words',
      'C) 200-250 words',
      'D) 300-350 words'
    ],
    correctAnswer: 'B',
    explanation: 'CSEC summaries typically require 120-160 words, focusing on conciseness while covering all key points.',
    marks: 1,
    difficulty: 'Basic'
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
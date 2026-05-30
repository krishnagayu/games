// Class 7 English Grammar Coach - Static Worksheet Question Bank
export const GRAMMAR_CHAPTERS = [
  {
    id: "nouns-pronouns",
    title: "1. Nouns & Pronouns",
    description: "Master noun types, cases, relative pronouns, and reflexive/emphatic pronouns.",
    staticQuestions: [
      {
        id: "noun_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Identify the relative pronoun in this sentence: 'The boy who won the race is my cousin.'",
        options: ["boy", "who", "won", "my"],
        correct: 1,
        explanation: "'Who' is a relative pronoun because it relates back to the noun 'boy' and introduces the relative clause 'who won the race'."
      },
      {
        id: "noun_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Choose the correct reflexive/emphatic pronoun: 'The students prepared the entire science exhibition ______.'",
        options: ["themself", "themselves", "theirselves", "himself"],
        correct: 1,
        explanation: "'Themselves' is the correct plural reflexive/emphatic pronoun matching the plural subject 'The students'."
      },
      {
        id: "noun_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Select the sentence with the correct usage of the possessive case for plural nouns ending in 's':",
        options: [
          "The ladies' club meets every Wednesday.",
          "The ladie's club meets every Wednesday.",
          "The ladies club's meets every Wednesday.",
          "The club of the ladie's meets every Wednesday."
        ],
        correct: 0,
        explanation: "For plural nouns ending in 's', the possessive is formed by adding only an apostrophe at the end (ladies')."
      },
      {
        id: "noun_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Identify the function of the highlighted pronoun: 'The prize is *yours* if you answer correctly.'",
        options: [
          "Demonstrative Pronoun",
          "Possessive Pronoun",
          "Possessive Adjective",
          "Distributive Pronoun"
        ],
        correct: 1,
        explanation: "'Yours' is a possessive pronoun. It stands alone as a pronoun representing possession, unlike possessive adjectives (like 'your') which must accompany a noun."
      }
    ]
  },
  {
    id: "adjectives-adverbs",
    title: "2. Adjectives & Adverbs",
    description: "Explore degrees of comparison, position of adjectives, and types of adverbs.",
    staticQuestions: [
      {
        id: "adj_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Complete the sentence with the correct degree of comparison: 'This is the ______ puzzle I have ever solved.'",
        options: ["hard", "harder", "hardest", "more hard"],
        correct: 2,
        explanation: "The superlative degree 'hardest' is used here because the sentence compares this puzzle to all other puzzles the speaker has solved (indicated by 'the' and 'ever')."
      },
      {
        id: "adj_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Identify the type of adverb highlighted in: 'She *seldom* makes a mistake in calculations.'",
        options: ["Adverb of Manner", "Adverb of Place", "Adverb of Frequency", "Adverb of Degree"],
        correct: 2,
        explanation: "'Seldom' tells how often an action happens, so it is an Adverb of Frequency."
      },
      {
        id: "adj_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "What is the correct order of adjectives in: 'They bought a ______ table.'",
        options: [
          "wooden beautiful round Danish",
          "beautiful round Danish wooden",
          "Danish beautiful wooden round",
          "round beautiful Danish wooden"
        ],
        correct: 1,
        explanation: "The standard order of adjectives is: Opinion (beautiful) -> Size/Shape (round) -> Origin (Danish) -> Material (wooden)."
      },
      {
        id: "adj_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Choose the correct adverb usage to complete: 'He is ______ weak to walk without support.'",
        options: ["very", "too", "much", "so"],
        correct: 1,
        explanation: "'Too' is used before adjectives to imply a negative consequence or excess. 'Too... to' is an established adverbial construction (e.g., 'too weak to walk')."
      }
    ]
  },
  {
    id: "subject-verb-agreement",
    title: "3. Subject-Verb Agreement",
    description: "Master the fundamental rules of verb agreements with singular, plural, and collective subjects.",
    staticQuestions: [
      {
        id: "sva_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Choose the correct verb: 'Neither the teacher nor the students ______ present in the library.'",
        options: ["was", "were", "is", "am"],
        correct: 1,
        explanation: "When subjects are joined by 'neither... nor', the verb agrees with the closer subject. Since 'students' is plural, the plural verb 'were' is correct."
      },
      {
        id: "sva_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Choose the correct verb: 'The jury ______ divided in their opinions.'",
        options: ["was", "is", "were", "has"],
        correct: 2,
        explanation: "A collective noun (jury) takes a plural verb when its members act individually or are divided in their opinions (indicated by 'their')."
      },
      {
        id: "sva_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Complete the sentence: 'Bread and butter ______ his favorite breakfast.'",
        options: ["are", "is", "were", "have been"],
        correct: 1,
        explanation: "When two singular nouns suggest a single unified idea/item (bread and butter as a combined dish), they take a singular verb 'is'."
      },
      {
        id: "sva_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Identify the grammatically correct sentence:",
        options: [
          "Many a student has failed to realize the importance of regular study.",
          "Many a student have failed to realize the importance of regular study.",
          "Many students has failed to realize the importance of regular study.",
          "Many a students have failed to realize the importance of regular study."
        ],
        correct: 0,
        explanation: "The phrase 'Many a' is followed by a singular noun ('student') and a singular verb ('has')."
      }
    ]
  },
  {
    id: "present-past-tenses",
    title: "4. Tenses I: Present & Past",
    description: "Excel in simple, continuous, perfect, and perfect continuous forms of Present and Past tenses.",
    staticQuestions: [
      {
        id: "t1_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Fill in the blank with the correct tense: 'I ______ my homework before my friend arrived.'",
        options: ["have finished", "had finished", "finish", "was finishing"],
        correct: 1,
        explanation: "The Past Perfect tense ('had finished') is used to denote an action that was completed before another past action ('arrived')."
      },
      {
        id: "t1_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Identify the tense: 'She has been practicing the violin for three hours.'",
        options: [
          "Present Continuous",
          "Present Perfect",
          "Present Perfect Continuous",
          "Past Perfect Continuous"
        ],
        correct: 2,
        explanation: "'Has been practicing' is the Present Perfect Continuous tense, representing an action that started in the past and is still continuing."
      },
      {
        id: "t1_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Which of the following sentences correctly expresses a habitual activity in the past?",
        options: [
          "I used to go for long walks in the morning.",
          "I was going for long walks in the morning.",
          "I had gone for long walks in the morning.",
          "I have been going for long walks in the morning."
        ],
        correct: 0,
        explanation: "'Used to' + verb is the standard idiomatic structure to express past habitual states or routines that no longer occur."
      },
      {
        id: "t1_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Identify the correct option: 'By the time the search party located the hikers, it ______ heavily for twelve hours.'",
        options: ["rained", "was raining", "has been raining", "had been raining"],
        correct: 3,
        explanation: "The Past Perfect Continuous tense ('had been raining') is required here because the rain started, continued for a duration (twelve hours), and was ongoing up to a specific point in the past ('by the time they located')."
      }
    ]
  },
  {
    id: "future-perfect-tenses",
    title: "5. Tenses II: Future & Perfect Tenses",
    description: "Deep dive into future constructions and advanced usage of perfect aspects across all timelines.",
    staticQuestions: [
      {
        id: "t2_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Complete the future perfect sentence: 'By next June, my father ______ here for ten years.'",
        options: ["will work", "will have worked", "would work", "will be working"],
        correct: 1,
        explanation: "The Future Perfect tense ('will have worked') indicates that an action will be completed or achieved by a specific point in the future ('by next June')."
      },
      {
        id: "t2_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Choose the correct sentence to express an action that will be in progress at a certain time in the future:",
        options: [
          "This time tomorrow, I will fly to London.",
          "This time tomorrow, I will be flying to London.",
          "This time tomorrow, I will have flown to London.",
          "This time tomorrow, I fly to London."
        ],
        correct: 1,
        explanation: "The Future Continuous tense ('will be flying') is used to express an action that will be in progress at a specific time in the future."
      },
      {
        id: "t2_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Choose the correct option: 'I ______ the project before you return tomorrow evening.'",
        options: ["shall finish", "shall have finished", "finished", "have finished"],
        correct: 1,
        explanation: "'Shall have finished' (Future Perfect) is used because the action of finishing is completed prior to another future event ('before you return')."
      },
      {
        id: "t2_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Identify the correct combination: 'We are late. The train ______ by the time we reach the station.'",
        options: ["will leave", "is leaving", "will have left", "leaves"],
        correct: 2,
        explanation: "Future Perfect 'will have left' is the most logical choice because the train departing occurs before the future arrival at the station."
      }
    ]
  },
  {
    id: "modals-auxiliaries",
    title: "6. Modals & Auxiliaries",
    description: "Master modal auxiliaries expressing ability, permission, obligation, possibility, and advice.",
    staticQuestions: [
      {
        id: "mod_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Which modal verb best expresses a polite request? '______ I borrow your pen for a moment?'",
        options: ["Must", "Should", "May", "Ought"],
        correct: 2,
        explanation: "'May' is the formal and polite modal verb used to ask for permission."
      },
      {
        id: "mod_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Select the modal representing a strong moral obligation: 'We ______ respect our elders.'",
        options: ["can", "could", "ought to", "might"],
        correct: 2,
        explanation: "'Ought to' expresses moral duty or social obligation."
      },
      {
        id: "mod_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Choose the correct modal to complete the logical deduction: 'The ground is fully wet. It ______ have rained heavily last night.'",
        options: ["must", "can", "should", "would"],
        correct: 0,
        explanation: "'Must have' is used to express a strong, near-certain logical deduction about a past event."
      },
      {
        id: "mod_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Identify the function of 'should' in this conditional sentence: 'Should it rain, the match will be postponed.'",
        options: [
          "Giving advice",
          "Expressing minor possibility/condition",
          "Forcing obligation",
          "Asking permission"
        ],
        correct: 1,
        explanation: "When 'should' is placed at the start of a conditional clause, it acts as an inversion of 'If it should...', representing a hypothetical or low-probability condition."
      }
    ]
  },
  {
    id: "active-passive-voice",
    title: "7. Active & Passive Voice",
    description: "Learn to transition sentences seamlessly between Active and Passive voices.",
    staticQuestions: [
      {
        id: "apv_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Change this sentence to passive voice: 'The chef cooked a delicious meal.'",
        options: [
          "A delicious meal cooked by the chef.",
          "A delicious meal was cooked by the chef.",
          "A delicious meal is cooked by the chef.",
          "The chef was cooked a delicious meal."
        ],
        correct: 1,
        explanation: "The original sentence is in Simple Past active. The passive voice structure is: Object ('A delicious meal') + was/were + past participle ('cooked') + by + Subject ('the chef')."
      },
      {
        id: "apv_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Change to active voice: 'The window pane was broken by Rahul.'",
        options: [
          "Rahul breaks the window pane.",
          "Rahul has broken the window pane.",
          "Rahul broke the window pane.",
          "Rahul was breaking the window pane."
        ],
        correct: 2,
        explanation: "'was broken' is Simple Past passive. Its active equivalent is the Simple Past verb 'broke'."
      },
      {
        id: "apv_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Choose the correct passive voice for: 'Who wrote this beautiful poem?'",
        options: [
          "By whom was this beautiful poem written?",
          "Who was this beautiful poem written by?",
          "By whom this beautiful poem was written?",
          "Both A and B are grammatically correct"
        ],
        correct: 3,
        explanation: "Both 'By whom was...' and 'Who was... written by?' are standard, grammatically sound ways to form the passive voice of a 'who' question in English."
      },
      {
        id: "apv_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Identify the correct passive voice of the imperative sentence: 'Shut the front door.'",
        options: [
          "The front door should shut.",
          "Let the front door be shut.",
          "Let the front door shutted.",
          "You must be shut the front door."
        ],
        correct: 1,
        explanation: "Imperative sentences in the active voice are changed to passive voice using the form: 'Let + subject + be + past participle'."
      }
    ]
  },
  {
    id: "direct-indirect-speech",
    title: "8. Direct & Indirect Speech",
    description: "Master reporting commands, statements, and questions with correct tense shifts and pronoun changes.",
    staticQuestions: [
      {
        id: "dis_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Convert to indirect speech: 'He said, \"I am reading a book.\"'",
        options: [
          "He said that he is reading a book.",
          "He said that he was reading a book.",
          "He said that I was reading a book.",
          "He says that he was reading a book."
        ],
        correct: 1,
        explanation: "With a past reporting verb ('said'), Present Continuous ('am reading') changes to Past Continuous ('was reading'), and 'I' changes to 'he'."
      },
      {
        id: "dis_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Convert to indirect speech: 'The teacher said to the boys, \"Do not make a noise.\"'",
        options: [
          "The teacher told the boys to not make a noise.",
          "The teacher forbade the boys to make a noise.",
          "The teacher advised the boys that they do not make a noise.",
          "The teacher ordered the boys not to make noise."
        ],
        correct: 1,
        explanation: "'Forbade' naturally carries a negative meaning, so 'forbade... to make' is correct and elegant. 'ordered... not to make' (with 'a noise' omitted or included) could work, but option B is structurally perfect."
      },
      {
        id: "dis_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Choose the correct indirect speech: 'She said, \"Where is my handbag?\"'",
        options: [
          "She asked where her handbag was.",
          "She asked where was her handbag.",
          "She said where her handbag was.",
          "She enquired where is her handbag."
        ],
        correct: 0,
        explanation: "In reported questions, the question word ('where') is followed by assertive sentence structure (subject 'her handbag' + verb 'was'). The verb 'said' becomes 'asked'."
      },
      {
        id: "dis_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Convert this universal truth to indirect speech: 'The teacher said, \"The Earth revolves around the Sun.\"'",
        options: [
          "The teacher said that the Earth revolved around the Sun.",
          "The teacher said that the Earth revolves around the Sun.",
          "The teacher asked if the Earth revolves around the Sun.",
          "The teacher told that the Earth will revolve around the Sun."
        ],
        correct: 1,
        explanation: "Universal truths, scientific facts, or habitual actions do not undergo a change of tense in indirect speech even if the reporting verb is in the past tense."
      }
    ]
  },
  {
    id: "prepositions-conjunctions",
    title: "9. Prepositions & Conjunctions",
    description: "Refine usage of spatial/temporal prepositions and sentence connectors (conjunctions).",
    staticQuestions: [
      {
        id: "pc_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Fill in the blank with the correct preposition: 'She has been waiting for you ______ 8 o'clock this morning.'",
        options: ["for", "since", "from", "at"],
        correct: 1,
        explanation: "'Since' is used to denote a specific starting point of time in the perfect tenses."
      },
      {
        id: "pc_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Choose the correct conjunction: 'We decided to go on a trek ______ the weather was stormy.'",
        options: ["because", "although", "unless", "in case"],
        correct: 1,
        explanation: "'Although' is a concessive conjunction showing contrast between a stormy weather condition and the decision to go on a trek."
      },
      {
        id: "pc_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Complete the sentence with correct correlative conjunctions: '______ did the class settle down ______ the bell rang.'",
        options: [
          "Neither ... nor",
          "No sooner ... than",
          "Hardly ... than",
          "Scarcely ... than"
        ],
        correct: 1,
        explanation: "'No sooner' is always paired with 'than'. It requires inversion of the subject and auxiliary verb ('did the class settle down')."
      },
      {
        id: "pc_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Choose the correct set of prepositions: 'He walked ______ the forest, stepped ______ a stream, and rested ______ a large oak tree.'",
        options: [
          "through, into, beneath",
          "across, in, under",
          "over, over, beside",
          "along, through, behind"
        ],
        correct: 0,
        explanation: "One walks 'through' a forest (dimensional space), steps 'into' a stream (motion into a liquid/medium), and rests 'beneath' or 'under' a tree."
      }
    ]
  },
  {
    id: "sentences-clauses",
    title: "10. Sentences & Clauses",
    description: "Identify simple, compound, and complex sentences and analyze independent vs. dependent clauses.",
    staticQuestions: [
      {
        id: "sc_q1",
        difficulty: "Basic",
        type: "mcq",
        question: "Identify the type of sentence: 'I wanted to buy a new smartphone, but I did not have enough savings.'",
        options: ["Simple Sentence", "Compound Sentence", "Complex Sentence", "Compound-Complex Sentence"],
        correct: 1,
        explanation: "This is a compound sentence because it contains two independent clauses joined by the coordinating conjunction 'but'."
      },
      {
        id: "sc_q2",
        difficulty: "Intermediate",
        type: "mcq",
        question: "Identify the underlined clause: 'The laptop *that you gifted me* works perfectly.'",
        options: ["Noun Clause", "Adjective Clause", "Adverb Clause", "Main Clause"],
        correct: 1,
        explanation: "'that you gifted me' is an Adjective (or Relative) Clause because it modifies the noun 'laptop'."
      },
      {
        id: "sc_q3",
        difficulty: "Advanced",
        type: "mcq",
        question: "Identify the underlined clause: 'He spoke *as if he knew everything about space travel*.'",
        options: ["Noun Clause", "Adjective Clause", "Adverb Clause of Manner", "Adverb Clause of Time"],
        correct: 2,
        explanation: "'as if he knew everything...' is an Adverb Clause of Manner because it describes how he spoke."
      },
      {
        id: "sc_q4",
        difficulty: "Olympiad",
        type: "mcq",
        question: "Which of the following is a Complex Sentence?",
        options: [
          "Despite his best efforts, he could not crack the puzzle.",
          "He made a sincere effort, yet he failed to solve it.",
          "Although he tried his best, he could not solve the puzzle.",
          "He tried his best and failed again."
        ],
        correct: 2,
        explanation: "Option C is a complex sentence because it contains an independent clause ('he could not solve the puzzle') and a dependent adverbial clause ('Although he tried his best'). Option A is simple (prepositional phrase 'Despite...'), Option B is compound ('yet'), Option D is simple (compound predicate)."
      }
    ]
  }
];

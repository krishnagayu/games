// Class 7 English Grammar - Dynamic Question Generators
// Generates endless, highly engaging and varied grammar questions per chapter and difficulty.

const NAMES = ["Aanya", "Kabir", "Rohan", "Meera", "Arjun", "Zara", "Siddharth", "Ananya", "Dev", "Priya", "Ishaan", "Diya"];
const PLURAL_NOUNS = ["students", "teachers", "players", "musicians", "scientists", "artists", "detectives", "explorers"];
const SINGULAR_NOUNS = ["student", "teacher", "player", "musician", "scientist", "artist", "detective", "explorer"];
const PLURAL_COLLECTIVE = ["team", "committee", "jury", "crew", "class", "audience", "orchestra", "staff"];

// Helpers
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Chapter-specific generator functions
let genCounter = 0;
const Generators = {
  // Chapter 1: Nouns & Pronouns
  "nouns-pronouns": (difficulty) => {
    const name1 = getRandomElement(NAMES);
    const name2 = getRandomElement(NAMES);
    const item = getRandomElement(["project", "painting", "website", "report", "presentation", "robot"]);

    if (difficulty === "Basic" || difficulty === "Intermediate") {
      const isReflexive = Math.random() > 0.5;
      if (isReflexive) {
        // Reflexive Pronoun
        const pronouns = [
          { subject: "He", correct: "himself" },
          { subject: "She", correct: "herself" },
          { subject: "I", correct: "myself" },
          { subject: "We", correct: "ourselves" },
          { subject: "They", correct: "themselves" }
        ];
        const selection = getRandomElement(pronouns);
        const options = shuffleArray([selection.correct, "himself", "themselves", "theirselves", "myself", "herself"]).slice(0, 4);
        if (!options.includes(selection.correct)) options[0] = selection.correct;
        const correctIndex = options.indexOf(selection.correct);

        return {
          id: `gen_noun_${++genCounter}`,
          difficulty,
          type: "mcq",
          question: `Complete the sentence: '${selection.subject} completed the entire ${item} all by ______.'`,
          options,
          correct: correctIndex,
          explanation: `The reflexive pronoun must agree with the subject '${selection.subject}'. The correct form is '${selection.correct}'.`
        };
      } else {
        // Relative Pronoun
        const relatives = [
          { who: "who", type: "person", text: `The ${getRandomElement(SINGULAR_NOUNS)} ______ won the championship was congratulated by all.` },
          { who: "which", type: "thing", text: `The ${item} ______ ${name1} created received the first prize.` },
          { who: "whose", type: "possession", text: `The child ______ parents are scientists designed this ${item}.` }
        ];
        const selection = getRandomElement(relatives);
        const options = ["who", "which", "whom", "whose"];
        const correctIndex = options.indexOf(selection.who);

        return {
          id: `gen_noun_${++genCounter}`,
          difficulty,
          type: "mcq",
          question: `Complete the sentence with the correct relative pronoun: '${selection.text}'`,
          options,
          correct: correctIndex,
          explanation: selection.type === "person" 
            ? "We use 'who' as a relative pronoun to refer to people acting as the subject of the clause."
            : selection.type === "thing" 
            ? "We use 'which' or 'that' to refer to things or objects."
            : "We use 'whose' to show possession related to a person or thing."
        };
      }
    } else {
      // Advanced / Olympiad
      // Possessive Case or Pronoun distinctions
      const isOlympiad = difficulty === "Olympiad";
      const qText = isOlympiad 
        ? `Identify the underlined word category: 'That brilliant science model is *theirs*.'`
        : `Choose the sentence with correct possessive pronoun usage:`;
      
      const options = isOlympiad
        ? ["Possessive Adjective", "Possessive Pronoun", "Demonstrative Pronoun", "Reflexive Pronoun"]
        : [
            `That laptop is hers, not your's.`,
            `That laptop is hers, not yours.`,
            `That laptop is her's, not yours.`,
            `That laptop is hers, not mine's.`
          ];
      
      return {
        id: `gen_noun_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: qText,
        options,
        correct: isOlympiad ? 1 : 1,
        explanation: isOlympiad 
          ? "'Theirs' acts as a possessive pronoun representing ownership without following a noun."
          : "'Yours' and 'hers' are possessive pronouns and NEVER take an apostrophe. 'Your's' or 'her's' are grammatically incorrect."
      };
    }
  },

  // Chapter 2: Adjectives & Adverbs
  "adjectives-adverbs": (difficulty) => {
    const name = getRandomElement(NAMES);
    const adjectives = [
      { base: "clever", comp: "cleverer", super: "cleverest" },
      { base: "beautiful", comp: "more beautiful", super: "most beautiful" },
      { base: "good", comp: "better", super: "best" },
      { base: "bad", comp: "worse", super: "worst" },
      { base: "quick", comp: "quicker", super: "quickest" }
    ];
    const adj = getRandomElement(adjectives);

    if (difficulty === "Basic") {
      const useSuper = Math.random() > 0.5;
      const questionText = useSuper
        ? `Fill in the blank: '${name} is the ______ of all the classmates.'`
        : `Fill in the blank: '${name} is ______ than his brother.'`;
      const correctWord = useSuper ? adj.super : adj.comp;
      const options = shuffleArray([adj.base, adj.comp, adj.super, "most " + adj.base]).slice(0, 4);
      if (!options.includes(correctWord)) options[0] = correctWord;
      const correctIndex = options.indexOf(correctWord);

      return {
        id: `gen_adj_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: questionText,
        options,
        correct: correctIndex,
        explanation: useSuper 
          ? "We use the superlative degree (usually with 'the') when comparing more than two entities."
          : "We use the comparative degree (followed by 'than') to compare two entities."
      };
    } else if (difficulty === "Intermediate") {
      // Adverbs classification
      const adverbs = [
        { word: "yesterday", type: "Adverb of Time", q: `Identify the type of adverb: 'We visited the national museum *yesterday*.'` },
        { word: "soundly", type: "Adverb of Manner", q: `Identify the type of adverb: 'The tired baby slept *soundly* through the storm.'` },
        { word: "everywhere", type: "Adverb of Place", q: `Identify the type of adverb: 'She searched *everywhere* for her lost ring.'` },
        { word: "extremely", type: "Adverb of Degree", q: `Identify the type of adverb: 'The math quiz was *extremely* challenging.'` }
      ];
      const selected = getRandomElement(adverbs);
      const options = ["Adverb of Manner", "Adverb of Place", "Adverb of Time", "Adverb of Degree"];
      const correctIndex = options.indexOf(selected.type);

      return {
        id: `gen_adj_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: selected.q,
        options,
        correct: correctIndex,
        explanation: `'${selected.word}' answer the question '${
          selected.type === "Adverb of Time" ? "when" : selected.type === "Adverb of Manner" ? "how" : selected.type === "Adverb of Place" ? "where" : "to what extent"
        }', indicating it is an ${selected.type}.`
      };
    } else {
      // Advanced / Olympiad
      // Order of adjectives or double comparative traps
      const options = [
        "He wore a beautiful black Italian leather jacket.",
        "He wore a black beautiful Italian leather jacket.",
        "He wore a beautiful Italian black leather jacket.",
        "He wore a leather beautiful black Italian jacket."
      ];
      return {
        id: `gen_adj_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: "Select the sentence that contains the correct order of cumulative adjectives:",
        options,
        correct: 0,
        explanation: "The standard order of adjectives in English is: Opinion (beautiful) -> Color (black) -> Origin (Italian) -> Material (leather) -> Purpose/Noun."
      };
    }
  },

  // Chapter 3: Subject-Verb Agreement
  "subject-verb-agreement": (difficulty) => {
    const nounPlural = getRandomElement(PLURAL_NOUNS);
    const nounSingular = getRandomElement(SINGULAR_NOUNS);
    const name = getRandomElement(NAMES);

    if (difficulty === "Basic") {
      const qTemplates = [
        {
          text: `Choose the correct verb: 'Every one of the ${nounPlural} ______ present today.'`,
          options: ["is", "are", "were", "have been"],
          correct: 0,
          exp: "'Every one of' is always singular because it refers to each member individually. Thus, singular 'is' is correct."
        },
        {
          text: `Choose the correct verb: '${name} and his friends ______ going to the park.'`,
          options: ["is", "are", "was", "has been"],
          correct: 1,
          exp: "Two subjects joined by 'and' form a plural subject, requiring the plural verb 'are'."
        }
      ];
      const selected = getRandomElement(qTemplates);
      return {
        id: `gen_sva_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: selected.text,
        options: selected.options,
        correct: selected.correct,
        explanation: selected.exp
      };
    } else if (difficulty === "Intermediate") {
      const collective = getRandomElement(PLURAL_COLLECTIVE);
      const isDivided = Math.random() > 0.5;

      const qText = isDivided
        ? `Choose the correct verb: 'The ${collective} ______ divided in their opinions.'`
        : `Choose the correct verb: 'The ${collective} ______ working together to complete the task.'`;
      const options = ["is", "are", "has been", "was"];
      const correctIndex = isDivided ? 1 : 0; // are vs is (was is also singular, but is/are contrast is standard)

      return {
        id: `gen_sva_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: qText,
        options,
        correct: correctIndex,
        explanation: isDivided 
          ? `A collective noun (${collective}) takes a plural verb when the members act individually or are divided.`
          : `A collective noun (${collective}) takes a singular verb when the group acts as a single, unified entity.`
      };
    } else {
      // Advanced / Olympiad
      // Parenthetical expressions, 'Neither... nor' traps, fractions, distance
      const qTemplates = [
        {
          text: `Select the grammatically correct sentence:`,
          options: [
            `${name}, accompanied by all the ${nounPlural}, has arrived.`,
            `${name}, accompanied by all the ${nounPlural}, have arrived.`,
            `Neither the ${nounPlural} nor ${name} have arrived.`,
            `Either ${name} or the ${nounPlural} has arrived.`
          ],
          correct: 0,
          exp: "Parenthetical phrases like 'accompanied by' or 'along with' do not change the number of the subject. Since the subject is singular ('" + name + "'), the singular verb 'has' is correct. In 'neither/nor', the verb agrees with the closest subject."
        },
        {
          text: `Choose the correct verb: 'Three-fourths of the book ______ been completed.'`,
          options: ["have", "has", "are", "were"],
          correct: 1,
          exp: "For fractions or percentages, the verb agrees with the noun following 'of'. Since 'the book' is singular, the singular verb 'has' is correct."
        }
      ];
      const selected = getRandomElement(qTemplates);
      return {
        id: `gen_sva_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: selected.text,
        options: selected.options,
        correct: selected.correct,
        explanation: selected.exp
      };
    }
  },

  // Chapter 4: Tenses I: Present & Past
  "present-past-tenses": (difficulty) => {
    const name = getRandomElement(NAMES);
    const verbList = [
      { inf: "write", past: "wrote", pp: "written", presPerf: "has written" },
      { inf: "read", past: "read", pp: "read", presPerf: "has read" },
      { inf: "finish", past: "finished", pp: "finished", presPerf: "has finished" },
      { inf: "discover", past: "discovered", pp: "discovered", presPerf: "has discovered" }
    ];
    const v = getRandomElement(verbList);

    if (difficulty === "Basic") {
      const options = [v.past, v.presPerf, `is ${v.inf}ing`, `was ${v.inf}`];
      return {
        id: `gen_ten1_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Fill in the blank with Simple Past: '${name} ______ a brilliant letter to the editor yesterday.'`,
        options,
        correct: 0,
        explanation: "'Yesterday' is a specific point of time in the past, so we must use the Simple Past tense."
      };
    } else if (difficulty === "Intermediate") {
      return {
        id: `gen_ten1_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Identify the correct form: 'Since 2021, my uncle ______ in this research laboratory.'`,
        options: ["is working", "worked", "has been working", "was working"],
        correct: 2,
        explanation: "The Present Perfect Continuous tense ('has been working') represents an action that began in the past ('since 2021') and is still ongoing."
      };
    } else {
      // Advanced / Olympiad
      // Past Perfect vs Past Simple combination or durational past perfect continuous
      return {
        id: `gen_ten1_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Complete the sentence: 'When the bell finally rang, the teacher ______ for over forty minutes.'`,
        options: ["has been lecturing", "had been lecturing", "was lecturing", "lectured"],
        correct: 1,
        explanation: "The Past Perfect Continuous tense ('had been lecturing') is used to describe an action that started in the past, continued for a period, and was ongoing up to another point in the past."
      };
    }
  },

  // Chapter 5: Tenses II: Future & Perfect Tenses
  "future-perfect-tenses": (difficulty) => {
    const name = getRandomElement(NAMES);

    if (difficulty === "Basic") {
      return {
        id: `gen_ten2_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Complete the sentence: 'I ______ my graduation by next year.'`,
        options: ["will complete", "will have completed", "completed", "shall be completed"],
        correct: 1,
        explanation: "'By next year' marks a future deadline, requiring the Future Perfect tense ('will have completed') to express an action finished before a future point."
      };
    } else if (difficulty === "Intermediate") {
      return {
        id: `gen_ten2_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Choose the correct combination: 'This time next week, we ______ on a beach in Maldives.'`,
        options: ["will relax", "will have relaxed", "will be relaxing", "are relaxing"],
        correct: 2,
        explanation: "'This time next week' indicates an ongoing action in the future, which is expressed using the Future Continuous tense ('will be relaxing')."
      };
    } else {
      // Advanced / Olympiad
      return {
        id: `gen_ten2_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Select the sentence that uses the Present Perfect tense correctly to express a past experience without a specific time modifier:`,
        options: [
          `I have climbed Mount Everest in 2018.`,
          `I climbed Mount Everest in 2018.`,
          `I have climbed Mount Everest twice.`,
          `Both B and C are correct.`
        ],
        correct: 3,
        explanation: "Present Perfect ('have climbed') is correct for lifetime experiences without a specific past time. Simple Past ('climbed') is correct with a specific time modifier ('in 2018'). Thus, both B and C are grammatically correct sentences."
      };
    }
  },

  // Chapter 6: Modals & Auxiliaries
  "modals-auxiliaries": (difficulty) => {
    const name = getRandomElement(NAMES);

    if (difficulty === "Basic") {
      return {
        id: `gen_mod_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Complete the sentence expressing a command or strong necessity: 'You ______ wear a helmet while riding a scooter.'`,
        options: ["might", "must", "can", "could"],
        correct: 1,
        explanation: "'Must' is used to express strong obligation, duty, or necessity."
      };
    } else if (difficulty === "Intermediate") {
      return {
        id: `gen_mod_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Which modal expresses an advice or suggestion? 'We ______ plant more trees to combat global warming.'`,
        options: ["may", "might", "should", "would"],
        correct: 2,
        explanation: "'Should' is the standard modal verb used to give advice, suggestions, or recommendations."
      };
    } else {
      // Advanced / Olympiad
      const qTemplates = [
        {
          q: `Choose the correct modal to express lack of necessity: 'We have plenty of food at home, so you ______ buy any more.'`,
          options: ["mustn't", "needn't", "shouldn't", "couldn't"],
          correct: 1,
          exp: "'Needn't' expresses an absence of obligation or lack of necessity, whereas 'mustn't' indicates a strict prohibition."
        },
        {
          q: `Complete the logical deduction: 'He has won three gold medals; he ______ be an outstanding athlete.'`,
          options: ["should", "can", "must", "might"],
          correct: 2,
          exp: "'Must' is used for a strong logical assumption or absolute certainty based on evidence."
        }
      ];
      const selected = getRandomElement(qTemplates);
      return {
        id: `gen_mod_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: selected.q,
        options: selected.options,
        correct: selected.correct,
        explanation: selected.exp
      };
    }
  },

  // Chapter 7: Active & Passive Voice
  "active-passive-voice": (difficulty) => {
    const name = getRandomElement(NAMES);
    const item = getRandomElement(["mural", "portrait", "masterpiece", "landscape"]);

    if (difficulty === "Basic") {
      return {
        id: `gen_voice_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Change to passive: '${name} painted this beautiful ${item}.'`,
        options: [
          `This beautiful ${item} is painted by ${name}.`,
          `This beautiful ${item} was painted by ${name}.`,
          `This beautiful ${item} has been painted by ${name}.`,
          `This beautiful ${item} painted by ${name}.`
        ],
        correct: 1,
        explanation: "Simple Past ('painted') active changes to Passive using was/were + past participle ('was painted')."
      };
    } else if (difficulty === "Intermediate") {
      return {
        id: `gen_voice_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Change to passive: 'The gardener was watering the plants.'`,
        options: [
          "The plants were watered by the gardener.",
          "The plants were being watered by the gardener.",
          "The plants are being watered by the gardener.",
          "The plants had been watered by the gardener."
        ],
        correct: 1,
        explanation: "Past Continuous ('was watering') changes to passive using was/were + being + past participle ('were being watered')."
      };
    } else {
      // Advanced / Olympiad
      return {
        id: `gen_voice_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Select the correct passive voice for: 'We must keep our promises.'`,
        options: [
          "Promises must be kept by us.",
          "Promises must be kept.",
          "Promises should be kept by us.",
          "Both A and B are acceptable."
        ],
        correct: 3,
        explanation: "In passive voice, standard modals like 'must' take 'be + past participle' (must be kept). The agent 'by us' is optional and can be omitted when the subject is general or obvious. Thus, both A and B are acceptable."
      };
    }
  },

  // Chapter 8: Direct & Indirect Speech
  "direct-indirect-speech": (difficulty) => {
    const name = getRandomElement(NAMES);

    if (difficulty === "Basic") {
      return {
        id: `gen_speech_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Convert to indirect speech: '${name} said, \"I will call you tomorrow.\"'`,
        options: [
          `${name} said that he will call you tomorrow.`,
          `${name} said that he would call me the next day.`,
          `${name} said that I would call him tomorrow.`,
          `${name} promised to call you tomorrow.`
        ],
        correct: 1,
        explanation: "In indirect speech, with a past reporting verb ('said'), 'will' changes to 'would', 'I' changes to 'he'/'she', and 'tomorrow' shifts to 'the next day' or 'the following day'."
      };
    } else if (difficulty === "Intermediate") {
      return {
        id: `gen_speech_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Convert to indirect speech: 'My mother said to me, \"Have you finished your homework?\"'`,
        options: [
          "My mother asked me if I finished my homework.",
          "My mother asked me if I had finished my homework.",
          "My mother said to me if I had finished my homework.",
          "My mother enquired if you had finished your homework."
        ],
        correct: 1,
        explanation: "A direct yes/no question changes to indirect speech using 'asked' + 'if'/'whether' + subject + past perfect verb ('had finished')."
      };
    } else {
      // Advanced / Olympiad
      return {
        id: `gen_speech_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Choose the correct indirect speech for: 'The commander said to the soldiers, \"Stand at ease!\"'`,
        options: [
          "The commander told the soldiers that they stand at ease.",
          "The commander ordered the soldiers to stand at ease.",
          "The commander requested the soldiers to stand at ease.",
          "The commander forbade the soldiers to stand at ease."
        ],
        correct: 1,
        explanation: "Imperative sentences representing commands are reported in indirect speech using an appropriate reporting verb ('ordered') followed by the infinitive 'to' + verb ('to stand at ease')."
      };
    }
  },

  // Chapter 9: Prepositions & Conjunctions
  "prepositions-conjunctions": (difficulty) => {
    if (difficulty === "Basic") {
      return {
        id: `gen_prep_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Fill in the blank with the correct preposition: 'The book was resting ______ the top shelf of the bookcase.'`,
        options: ["in", "on", "at", "under"],
        correct: 1,
        explanation: "'On' is used to denote contact with a flat surface like a shelf or table."
      };
    } else if (difficulty === "Intermediate") {
      return {
        id: `gen_prep_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Choose the correct conjunction: 'You will not succeed ______ you put in consistent effort.'`,
        options: ["unless", "although", "because", "since"],
        correct: 0,
        explanation: "'Unless' means 'except if' or 'if not', expressing a negative condition."
      };
    } else {
      // Advanced / Olympiad
      return {
        id: `gen_prep_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Choose the correct pair of correlative conjunctions: 'He was ______ exhausted ______ he fell asleep immediately.'`,
        options: [
          "either ... or",
          "neither ... nor",
          "so ... that",
          "such ... as"
        ],
        correct: 2,
        explanation: "'So... that' is a correlative conjunction expressing cause and effect (He was so exhausted [cause] that he fell asleep immediately [effect])."
      };
    }
  },

  // Chapter 10: Sentences & Clauses
  "sentences-clauses": (difficulty) => {
    if (difficulty === "Basic") {
      return {
        id: `gen_clause_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Identify the sentence type: 'Although it was raining, they played the match.'`,
        options: ["Simple Sentence", "Compound Sentence", "Complex Sentence", "Mixed Sentence"],
        correct: 2,
        explanation: "A sentence with one independent clause ('they played the match') and at least one dependent clause ('Although it was raining') is a Complex Sentence."
      };
    } else if (difficulty === "Intermediate") {
      return {
        id: `gen_clause_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Identify the category of the underlined clause: 'The student *who spoke first* won the gold medal.'`,
        options: ["Noun Clause", "Adjective Clause", "Adverb Clause", "Main Clause"],
        correct: 1,
        explanation: "'who spoke first' acts as an adjective modifying the noun 'student', making it an Adjective Clause."
      };
    } else {
      // Advanced / Olympiad
      return {
        id: `gen_clause_${++genCounter}`,
        difficulty,
        type: "mcq",
        question: `Identify the underlined clause: 'I did not visit him *because I was extremely busy with my projects*.'`,
        options: [
          "Noun Clause",
          "Adjective Clause",
          "Adverb Clause of Reason",
          "Adverb Clause of Condition"
        ],
        correct: 2,
        explanation: "The clause 'because I was extremely busy...' explains the reason for the action in the main clause, making it an Adverb Clause of Reason."
      };
    }
  }
};

export function generateQuestion(chapterId, difficulty) {
  if (Generators[chapterId]) {
    return Generators[chapterId](difficulty);
  }
  // Fallback if chapter not found
  return {
    id: `fallback_${++genCounter}`,
    difficulty,
    type: "mcq",
    question: "Which of the following is a grammatically correct sentence?",
    options: ["He go to school.", "He goes to school.", "He going to school.", "He gone to school."],
    correct: 1,
    explanation: "With a singular third-person subject ('He'), the verb takes 's/es' in the Simple Present tense ('goes')."
  };
}

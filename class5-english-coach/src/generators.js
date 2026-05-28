/**
 * Class 5 English Coach - Multi-Template Infinite Procedural Question Generators
 * Strictly focused on standard Class 5 English Grammar.
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeMCQ(chapterId, text, options, correctIndex, solution) {
  return { chapter: chapterId, type: 'mcq', text, options, answer: correctIndex, solution };
}

function makeShort(chapterId, text, answer, solution) {
  return { chapter: chapterId, type: 'short', text, answer: String(answer), solution };
}

function makeFillIn(chapterId, text, answer, solution) {
  return { chapter: chapterId, type: 'fillin', text, answer: String(answer), solution };
}

const names = ["Rohan", "Priya", "Sarah", "Arjun", "Lily", "Amit", "Maya", "Alex", "Kabir", "Neha"];
const subjects = ["The teacher", "The postman", "My grandmother", "The principal", "The artist", "The scientist"];
const locations = ["in Delhi", "at the museum", "near the Ganges", "in Paris", "at the Himalayan resort"];

// ───────── NCERT Chapter Generators ─────────

// Ch 1: Nouns & Their Types
function genCh1(level) {
  const name = randChoice(names);
  const type = randInt(1, 3);
  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      const properNouns = ["Taj Mahal", "Red Fort", "Ganges", "Mumbai", "Saturday"];
      const noun = randChoice(properNouns);
      return makeMCQ(1,
        `Which type of noun is the capitalized word? "${name} visited the ${noun.toUpperCase()}."`,
        ["Common Noun", "Proper Noun", "Collective Noun", "Abstract Noun"],
        1,
        `"${noun}" refers to a specific place or name, which is a Proper Noun. Proper nouns always start with capital letters.`
      );
    } else if (type === 2) {
      const collectives = [
        { name: "herd of elephants", group: "herd" },
        { name: "swarm of bees", group: "swarm" },
        { name: "pack of wolves", group: "pack" },
        { name: "colony of ants", group: "colony" },
        { name: "school of fish", group: "school" }
      ];
      const selected = randChoice(collectives);
      return makeFillIn(1,
        `Fill in the blank with the correct collective noun: 'A ___ of animals crossed our path.' (Referring to: ${selected.name})`,
        selected.group,
        `The collective noun for this group is '${selected.group}'.`
      );
    } else {
      const abstracts = [
        { adj: "honest", noun: "honesty" },
        { adj: "brave", noun: "bravery" },
        { adj: "kind", noun: "kindness" },
        { adj: "happy", noun: "happiness" }
      ];
      const selected = randChoice(abstracts);
      return makeShort(1,
        `What is the abstract noun form of the adjective '${selected.adj}'?`,
        selected.noun,
        `The abstract noun formed from '${selected.adj}' is '${selected.noun}'.`
      );
    }
  } else {
    // Advanced & Olympiad
    if (type === 1) {
      return makeMCQ(1,
        `Identify the uncountable noun from the following group:`,
        ["Oranges", "Books", "Laughter", "Coins"],
        2,
        `'Laughter' is an abstract noun and is uncountable. You cannot count individual laughs as discrete items.`
      );
    } else {
      return makeFillIn(1,
        `What is the abstract noun form of the action word 'grow'?`,
        "growth",
        `The abstract noun derived from the verb 'grow' is 'growth'.`
      );
    }
  }
}

// Ch 2: Pronouns & Their Types
function genCh2(level) {
  const name1 = randChoice(names);
  let name2 = randChoice(names);
  while (name1 === name2) name2 = randChoice(names);
  const type = randInt(1, 3);
  
  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      return makeMCQ(2,
        `Which personal pronoun correctly replaces the underlined subject? '<u>${name1} and ${name2}</u> prepared the class project.'`,
        ["He", "We", "They", "Them"],
        2,
        `Since we are talking about two people (third person plural), we replace them with the pronoun 'They'.`
      );
    } else if (type === 2) {
      return makeFillIn(2,
        `Complete the sentence with a possessive pronoun: 'This pen belongs to ${name1}. It is ___.' (use his/hers)`,
        name1 === "Priya" || name1 === "Sarah" || name1 === "Maya" || name1 === "Neha" ? "hers" : "his",
        `Since the pen belongs to ${name1}, we use the possessive pronoun '${name1 === "Priya" || name1 === "Sarah" || name1 === "Maya" || name1 === "Neha" ? "hers" : "his"}' to show ownership.`
      );
    } else {
      const reflexives = [
        { subj: "I", ref: "myself" },
        { subj: "We", ref: "ourselves" },
        { subj: "She", ref: "herself" },
        { subj: "He", ref: "himself" }
      ];
      const sel = randChoice(reflexives);
      return makeFillIn(2,
        `Complete with the correct reflexive pronoun: '${sel.subj} solved the difficult puzzle all by ___.'`,
        sel.ref,
        `The reflexive pronoun corresponding to the subject '${sel.subj}' is '${sel.ref}'.`
      );
    }
  } else {
    // Advanced & Olympiad
    return makeMCQ(2,
      `Identify the bolded pronoun: '<b>These</b> are the books that my teacher recommended.'`,
      ["Possessive Pronoun", "Demonstrative Pronoun", "Relative Pronoun", "Indefinite Pronoun"],
      1,
      `'These' is pointing directly to specific items ('books'), making it a Demonstrative Pronoun.`
    );
  }
}

// Ch 3: Adjectives & Comparison
function genCh3(level) {
  const name1 = randChoice(names);
  let name2 = randChoice(names);
  while (name1 === name2) name2 = randChoice(names);
  const type = randInt(1, 3);

  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      const adjs = [
        { pos: "tall", comp: "taller", sup: "tallest" },
        { pos: "smart", comp: "smarter", sup: "smartest" },
        { pos: "fast", comp: "faster", sup: "fastest" }
      ];
      const sel = randChoice(adjs);
      return makeMCQ(3,
        `Choose the correct degree of comparison: '${name1} is ___ than ${name2}.'`,
        [sel.pos, sel.comp, sel.sup, "more " + sel.pos],
        1,
        `When comparing two entities, we use the comparative degree (ending in -er), which is '${sel.comp}'.`
      );
    } else {
      const items = ["building", "mountain", "tower"];
      return makeFillIn(3,
        `Complete the sentence: 'This is the ___ (high) ${randChoice(items)} in our town.'`,
        "highest",
        `Since we are comparing this one to all others, we use the superlative form 'highest'.`
      );
    }
  } else {
    // Advanced & Olympiad
    if (type === 1) {
      return makeMCQ(3,
        `Which is the correct ordering of adjectives to describe a box?`,
        ["a wooden small beautiful box", "a beautiful small wooden box", "a wooden beautiful small box", "a small wooden beautiful box"],
        1,
        `The standard order of adjectives is: Opinion (beautiful), Size (small), Material (wooden).`
      );
    } else {
      return makeFillIn(3,
        `What is the superlative form of the irregular adjective 'bad'?`,
        "worst",
        `The comparison forms of bad are: bad -> worse -> worst.`
      );
    }
  }
}

// Ch 4: Verbs & Tenses
function genCh4(level) {
  const name = randChoice(names);
  const type = randInt(1, 3);

  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      return makeMCQ(4,
        `Identify the tense: '${name} is playing tennis right now.'`,
        ["Simple Present", "Present Continuous", "Simple Past", "Past Continuous"],
        1,
        `'is playing' indicates an action currently in progress, which is the Present Continuous tense.`
      );
    } else {
      const verbs = [
        { base: "write", past: "wrote" },
        { base: "drink", past: "drank" },
        { base: "speak", past: "spoke" },
        { base: "drive", past: "drove" }
      ];
      const sel = randChoice(verbs);
      return makeFillIn(4,
        `Write the past tense form of the verb in brackets: '${name} ___ (${sel.base}) a wonderful email yesterday.'`,
        sel.past,
        `The past tense form of the irregular verb '${sel.base}' is '${sel.past}'.`
      );
    }
  } else {
    // Advanced & Olympiad
    return makeMCQ(4,
      `Choose the sentence that is in the Past Continuous tense:`,
      [
        `${name} wrote a letters to his parents.`,
        `${name} will be writing a letter tomorrow.`,
        `${name} was writing a letter when I entered the room.`,
        `${name} has written a letter already.`
      ],
      2,
      `'was writing' uses the past form of 'be' (was) with the main verb's -ing form, representing the Past Continuous tense.`
    );
  }
}

// Ch 5: Subject-Verb Agreement
function genCh5(level) {
  const name1 = randChoice(names);
  let name2 = randChoice(names);
  while (name1 === name2) name2 = randChoice(names);
  const type = randInt(1, 3);

  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      return makeMCQ(5,
        `Choose the correct helping verb: 'The keys of the drawer ___ on the kitchen shelf.'`,
        ["is", "are", "am", "was"],
        1,
        `The true subject is 'keys' (plural), so it requires the plural verb 'are'. 'Of the drawer' is an intervening prepositional phrase.`
      );
    } else {
      return makeFillIn(5,
        `Choose 'has' or 'have': 'Each of the winning students ___ received a certificate.'`,
        "has",
        `'Each' is an indefinite pronoun that is grammatically singular and requires the singular verb 'has'.`
      );
    }
  } else {
    // Advanced & Olympiad
    if (type === 1) {
      return makeMCQ(5,
        `Which sentence is grammatically correct?`,
        [
          `Neither the manager nor the staff members has arrived.`,
          `Neither the manager nor the staff members are arrived.`,
          `Neither the manager nor the staff members have arrived.`,
          `Neither the manager nor the staff members is arrived.`
        ],
        2,
        `In a 'neither... nor' sentence, the verb agrees with the closer subject. 'staff members' is plural, so 'have arrived' is correct.`
      );
    } else {
      return makeFillIn(5,
        `Fill in the blank with 'is' or 'are': 'Gulliver's Travels ___ a fascinating adventure book.'`,
        "is",
        `'Gulliver's Travels' is the title of a single book, making it singular, so it takes the singular verb 'is'.`
      );
    }
  }
}

// Ch 6: Adverbs & Their Types
function genCh6(level) {
  const name = randChoice(names);
  const type = randInt(1, 3);

  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      return makeMCQ(6,
        `Identify the adverb of manner: 'The young girl spoke polite and answered all questions politely.'`,
        ["polite", "politely", "girl", "questions"],
        1,
        `'politely' describes how she answered (her manner), which is an adverb of manner.`
      );
    } else {
      const places = ["outside", "here", "there", "upstairs"];
      const selPlace = randChoice(places);
      return makeFillIn(6,
        `Identify the adverb of place in the sentence: 'Please wait ${selPlace} until the bell rings.'`,
        selPlace,
        `'${selPlace}' is the adverb of place because it describes where to wait.`
      );
    }
  } else {
    // Advanced & Olympiad
    return makeMCQ(6,
      `Identify the type of the bolded adverb: 'The class was <b>extremely</b> quiet.'`,
      ["Adverb of Manner", "Adverb of Frequency", "Adverb of Degree", "Adverb of Place"],
      2,
      `'extremely' describes the intensity or degree of the quietness, making it an Adverb of Degree.`
    );
  }
}

// Ch 7: Prepositions
function genCh7(level) {
  const name = randChoice(names);
  const type = randInt(1, 3);

  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      const times = ["8:30 AM", "noon", "midnight", "9:00 PM"];
      const selTime = randChoice(times);
      return makeMCQ(7,
        `Choose the correct preposition: 'Our coach arrives ___ ${selTime}.'`,
        ["in", "on", "at", "by"],
        2,
        `We use 'at' for precise clock times (at ${selTime}).`
      );
    } else {
      return makeFillIn(7,
        `Complete the sentence: 'The curious puppy jumped ___ the pool to fetch the ball.' (into/in/on)`,
        "into",
        `We use 'into' to show movement entering a space or container.`
      );
    }
  } else {
    // Advanced & Olympiad
    return makeMCQ(7,
      `Choose the correct prepositional idiom: 'She succeeded ___ dint of constant training and grit.'`,
      ["by", "with", "through", "in"],
      0,
      `The standard English idiom is 'by dint of', which means 'by means of'.`
    );
  }
}

// Ch 8: Conjunctions
function genCh8(level) {
  const name = randChoice(names);
  const type = randInt(1, 3);

  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      return makeMCQ(8,
        `Choose the best conjunction: 'We went to the beach, ___ we could not swim because of the red flag.'`,
        ["and", "but", "so", "or"],
        1,
        `'but' introduces a contrast: they went to the beach, but unfortunately could not swim.`
      );
    } else {
      return makeFillIn(8,
        `Complete with the correct connector: 'You cannot enter the hall ___ you show your entry pass.' (unless/although/because)`,
        "unless",
        `'unless' means 'if... not', expressing the required condition for entering the hall.`
      );
    }
  } else {
    // Advanced & Olympiad
    return makeMCQ(8,
      `Identify the subordinating conjunction in this compound-complex sentence:`,
      ["and", "although", "but", "neither"],
      1,
      `'although' is a subordinating conjunction because it introduces a dependent concession clause.`
    );
  }
}

// Ch 9: Articles & Determiners
function genCh9(level) {
  const type = randInt(1, 3);

  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      const vowels = ["honest helper", "exciting game", "excellent idea", "orange juice"];
      const selVow = randChoice(vowels);
      return makeMCQ(9,
        `Choose the correct article for the description: 'We had ___ ${selVow} during the match.'`,
        ["a", "an", "the", "no article"],
        1,
        `Since the descriptive phrase '${selVow}' starts with a vowel sound, we use 'an'.`
      );
    } else {
      return makeFillIn(9,
        `Choose 'some' or 'any': 'I do not have ___ pencils to spare.'`,
        "any",
        `We use 'any' in negative sentences (do not have any).`
      );
    }
  } else {
    // Advanced & Olympiad
    return makeMCQ(9,
      `Which of the following is correct regarding article usage?`,
      [
        `He is study in the London university.`,
        `She is an European citizen.`,
        `The Ganges is a holy river of India.`,
        `We have a breakfast at 8 AM.`
      ],
      2,
      `We use 'the' for specific major rivers like 'The Ganges'. 'European' starts with a consonant sound (/y/), so it should be 'a European'. We do not use articles before daily meals ('breakfast').`
    );
  }
}

// Ch 10: Punctuation & Capitalization
function genCh10(level) {
  const type = randInt(1, 3);

  if (level === 'basic' || level === 'intermediate') {
    if (type === 1) {
      return makeMCQ(10,
        `Which sentence is correctly punctuated?`,
        [
          `"Hurrah! our team won the school cup," cried Rohan.`,
          `"Hurrah! Our team won the school cup!" cried Rohan.`,
          `Hurrah our team won the school cup cried Rohan.`,
          `"hurrah! our team won the school cup," cried rohan.`
        ],
        1,
        `Proper quotes, capitalization of 'Our' after the exclamation mark, and capitalization of proper noun 'Rohan' make option 1 correct.`
      );
    } else {
      return makeFillIn(10,
        `Which punctuation mark should go in the blank: 'Rohan___s laptop is on the table.' (to show possession)`,
        "'",
        `An apostrophe (') is used to show ownership/possession in Rohan's.`
      );
    }
  } else {
    // Advanced & Olympiad
    return makeMCQ(10,
      `Identify the correct punctuation pattern to divide two independent clauses:`,
      ["A comma with no conjunction", "A semicolon", "A hyphen", "An apostrophe"],
      1,
      `A semicolon (;) is used to separate two closely related independent clauses without using a coordinating conjunction.`
    );
  }
}

// Master generator dispatch
export function generateQuestion(chapterId, level) {
  switch (Number(chapterId)) {
    case 1: return genCh1(level);
    case 2: return genCh2(level);
    case 3: return genCh3(level);
    case 4: return genCh4(level);
    case 5: return genCh5(level);
    case 6: return genCh6(level);
    case 7: return genCh7(level);
    case 8: return genCh8(level);
    case 9: return genCh9(level);
    case 10: return genCh10(level);
    default: return genCh1(level);
  }
}

/**
 * Class 5 English Coach – NCERT Grammar Syllabus Data
 * 10 chapters covering all essential English Grammar topics for Class 5.
 */

export const chapters = [
  {
    id: 1,
    title: "Nouns & Their Types",
    accent: "hsl(210, 85%, 60%)",
    topics: ["Common & Proper Nouns", "Collective Nouns (e.g. herd, pack)", "Abstract Nouns (e.g. honesty, joy)", "Countable & Uncountable Nouns"],
    summary: "Discover the building blocks of sentences! Learn to name people, places, things, ideas, and groups with precision."
  },
  {
    id: 2,
    title: "Pronouns & Their Types",
    accent: "hsl(280, 80%, 65%)",
    topics: ["Personal Pronouns (I, you, he, she)", "Possessive Pronouns (mine, yours)", "Demonstrative Pronouns (this, these)", "Reflexive Pronouns (myself, himself)"],
    summary: "Replace nouns like a pro to make your speech flow. Master pronouns that show ownership, point to objects, or reflect actions."
  },
  {
    id: 3,
    title: "Adjectives & Comparison",
    accent: "hsl(150, 75%, 45%)",
    topics: ["Adjectives of Quality & Quantity", "Degrees of Comparison", "Irregular Adjectives (good, better, best)", "Proper adjective order"],
    summary: "Paint vivid pictures with words! Learn to describe nouns and compare them using positive, comparative, and superlative degrees."
  },
  {
    id: 4,
    title: "Verbs & Tenses",
    accent: "hsl(15, 85%, 55%)",
    topics: ["Action & Helping Verbs", "Simple Present, Past & Future", "Present & Past Continuous", "Irregular verb forms"],
    summary: "Time travel with verbs! Master simple and continuous tenses to describe actions happening now, in the past, or in the future."
  },
  {
    id: 5,
    title: "Subject-Verb Agreement",
    accent: "hsl(330, 80%, 60%)",
    topics: ["Singular & Plural Subjects", "Helping verb matching (is/are, was/were)", "Special cases (each, everyone, logic)", "Intervening phrases"],
    summary: "Ensure perfect harmony in your sentences! Match your subjects with their correct verb partners without getting confused."
  },
  {
    id: 6,
    title: "Adverbs & Their Types",
    accent: "hsl(45, 95%, 50%)",
    topics: ["Adverbs of Manner (how)", "Adverbs of Time (when)", "Adverbs of Place (where)", "Adverbs of Frequency (how often)"],
    summary: "Add action detail! Find out how, when, where, and how often actions occur using premium, descriptive adverbs."
  },
  {
    id: 7,
    title: "Prepositions",
    accent: "hsl(175, 75%, 45%)",
    topics: ["Prepositions of Place (in, on, under)", "Prepositions of Time (at, on, in)", "Prepositions of Direction (into, through)", "Prepositional phrases"],
    summary: "Connect things in space and time! Master standard prepositions to describe exact locations, moments, and directions."
  },
  {
    id: 8,
    title: "Conjunctions",
    accent: "hsl(300, 70%, 60%)",
    topics: ["Coordinating (AND, BUT, OR, SO)", "Subordinating (BECAUSE, ALTHOUGH, IF)", "Correlative Conjunctions (either...or)", "Sentence joining mechanics"],
    summary: "Build bridges between thoughts. Use conjunctions to combine short phrases into smart, compound, and complex sentences."
  },
  {
    id: 9,
    title: "Articles & Determiners",
    accent: "hsl(200, 85%, 55%)",
    topics: ["Definite Article (The)", "Indefinite Articles (A, An)", "Determiners (some, any, few, many)", "Zero article cases"],
    summary: "Specify and quantify with ease. Master articles and determiners to introduce nouns correctly in any context."
  },
  {
    id: 10,
    title: "Punctuation & Capitalization",
    accent: "hsl(120, 65%, 50%)",
    topics: ["Capitalization rules", "Commas, Periods, Question Marks", "Exclamation marks & emotion", "Apostrophes for possession & contraction"],
    summary: "Give your writing a clean voice. Polish your sentences with proper punctuation, pauses, and clear capitalization."
  }
];

export const worksheets = {
  basic: [
    // Ch 1: Nouns
    { chapter: 1, type: "mcq", text: "Identify the collective noun in this sentence: 'A flock of birds flew over the lake.'", options: ["lake", "flock", "birds", "flew"], answer: 1, solution: "A 'flock' is a collective noun because it refers to a group of birds." },
    { chapter: 1, type: "fillin", text: "Fill in the blank with a Proper Noun: 'My best friend lives in the beautiful city of ___.'", answer: "London", solution: "Any valid Proper Noun (like London, Paris, New Delhi) must start with a capital letter." },

    // Ch 2: Pronouns
    { chapter: 2, type: "mcq", text: "Which pronoun best replaces the underlined nouns? '<u>Rohan and Sunil</u> went to the park.'", options: ["He", "They", "We", "Us"], answer: 1, solution: "'They' is the third-person plural personal pronoun used to replace Rohan and Sunil." },
    { chapter: 2, type: "fillin", text: "Complete the sentence with the correct possessive pronoun: 'This book belongs to me. It is ___.'", answer: "mine", solution: "'mine' is the possessive pronoun that refers to something belonging to the speaker." },

    // Ch 3: Adjectives
    { chapter: 3, type: "mcq", text: "Choose the correct comparative adjective: 'A cheetah is ___ than a lion.'", options: ["fast", "faster", "fastest", "more fast"], answer: 1, solution: "When comparing two animals, we use the comparative degree: 'faster'." },
    { chapter: 3, type: "fillin", text: "Complete the sentence: 'Mount Everest is the ___ (high) mountain in the world.'", answer: "highest", solution: "Since Mount Everest is being compared to all other mountains, we use the superlative form 'highest'." },

    // Ch 4: Verbs & Tenses
    { chapter: 4, type: "mcq", text: "Identify the tense of the sentence: 'She is writing a letter right now.'", options: ["Simple Present", "Present Continuous", "Simple Past", "Future Continuous"], answer: 1, solution: "'is writing' indicates an action currently in progress, which is the Present Continuous tense." },
    { chapter: 4, type: "fillin", text: "Complete the sentence with the past tense of 'run': 'Yesterday, he ___ five miles.'", answer: "ran", solution: "The past tense of the irregular verb 'run' is 'ran'." },

    // Ch 5: Subject-Verb Agreement
    { chapter: 5, type: "mcq", text: "Choose the correct verb: 'The books on the table ___ very heavy.'", options: ["is", "are", "am", "be"], answer: 1, solution: "The subject is 'books' (plural), so it requires the plural verb 'are'. 'On the table' is a prepositional phrase." },
    { chapter: 5, type: "fillin", text: "Fill in the blank with 'has' or 'have': 'Each of the players ___ a new jersey.'", answer: "has", solution: "'Each' is a singular indefinite pronoun, so it requires the singular verb 'has'." },

    // Ch 6: Adverbs
    { chapter: 6, type: "mcq", text: "Find the adverb of manner in this sentence: 'The dancer moved gracefully across the stage.'", options: ["moved", "gracefully", "dancer", "stage"], answer: 1, solution: "'gracefully' is an adverb of manner because it describes *how* the dancer moved." },
    { chapter: 6, type: "fillin", text: "Fill in the blank with a suitable adverb of frequency: 'She ___ brush her teeth twice a day.' (starts with d)", answer: "daily", solution: "'daily' or 'always' describes how frequently the action occurs." },

    // Ch 7: Prepositions
    { chapter: 7, type: "mcq", text: "Choose the correct preposition of time: 'Our school starts ___ 8:00 AM.'", options: ["on", "at", "in", "by"], answer: 1, solution: "We use 'at' for specific times on a clock (e.g. at 8:00 AM)." },
    { chapter: 7, type: "fillin", text: "Fill in the blank: 'The cat jumped ___ the wall to chase a mouse.' (direction)", answer: "over", solution: "'over' is the preposition showing movement from one side to the other, higher than the wall." },

    // Ch 8: Conjunctions
    { chapter: 8, type: "mcq", text: "Choose the correct conjunction: 'I wanted to buy a new toy, ___ I did not have enough money.'", options: ["so", "but", "or", "because"], answer: 1, solution: "'but' is used to connect two contrasting thoughts." },
    { chapter: 8, type: "fillin", text: "Complete the sentence: 'We will stay indoors ___ it is raining heavily outside.'", answer: "because", solution: "'because' introduces the reason for staying indoors." },

    // Ch 9: Articles & Determiners
    { chapter: 9, type: "mcq", text: "Choose the correct article: 'I saw ___ exciting adventure movie yesterday.'", options: ["a", "an", "the", "no article"], answer: 1, solution: "'exciting' starts with a vowel sound, so we use the indefinite article 'an'." },
    { chapter: 9, type: "fillin", text: "Fill in the blank with 'some' or 'any': 'Do you have ___ questions for the coach?'", answer: "any", solution: "We typically use 'any' in questions and negative statements." },

    // Ch 10: Punctuation
    { chapter: 10, type: "mcq", text: "Which sentence has correct capitalization?", options: ["we visited the Taj Mahal in Agra.", "We visited the Taj Mahal in Agra.", "We visited the taj mahal in agra.", "we visited the taj mahal in Agra."], answer: 1, solution: "Proper nouns ('We', 'Taj Mahal', 'Agra') must start with capital letters." },
    { chapter: 10, type: "fillin", text: "Which punctuation mark is missing at the end of this sentence: 'What a beautiful painting this is___'", answer: "!", solution: "An exclamation mark (!) is used at the end of exclamatory sentences expressing strong feelings." }
  ],
  intermediate: [
    // Ch 1: Nouns
    { chapter: 1, type: "mcq", text: "What type of noun is the underlined word? 'Her <u>bravery</u> won her the national award.'", options: ["Proper Noun", "Collective Noun", "Abstract Noun", "Material Noun"], answer: 2, solution: "'Bravery' is an abstract noun because it refers to a quality that cannot be touched or seen." },
    { chapter: 1, type: "fillin", text: "Fill in the blank with a collective noun: 'The captain guided a ___ of sailors across the rough sea.'", answer: "crew", solution: "A collective noun for a group of sailors is 'crew'." },

    // Ch 2: Pronouns
    { chapter: 2, type: "mcq", text: "Choose the correct reflexive pronoun: 'The children painted the mural all by ___.'", options: ["himself", "themselves", "ourselves", "itself"], answer: 1, solution: "Since 'children' is plural, the corresponding reflexive pronoun is 'themselves'." },
    { chapter: 2, type: "fillin", text: "Complete the sentence: 'Is this bicycle ___?' (belonging to you, singular)", answer: "yours", solution: "'yours' is the possessive pronoun used to represent ownership by the listener." },

    // Ch 3: Adjectives
    { chapter: 3, type: "mcq", text: "Identify the adjective of quantity in this sentence: 'There is little milk left in the bottle.'", options: ["milk", "little", "left", "bottle"], answer: 1, solution: "'little' is an adjective of quantity because it tells how much milk is left." },
    { chapter: 3, type: "fillin", text: "Complete the comparative form: 'Gold is ___ (expensive) than silver.'", answer: "more expensive", solution: "For multi-syllable adjectives like 'expensive', we form the comparative by adding 'more' before the adjective." },

    // Ch 4: Verbs & Tenses
    { chapter: 4, type: "mcq", text: "Which sentence is in the Past Continuous tense?", options: ["I read a fantastic book last night.", "I will be reading a book tonight.", "I was reading a book when you called.", "I am reading a book now."], answer: 2, solution: "'was reading' is the past form of the helping verb 'to be' + present participle, making it Past Continuous." },
    { chapter: 4, type: "fillin", text: "Give the past participle (3rd form) of the verb 'write': 'He has ___ a wonderful story.'", answer: "written", solution: "The three forms of write are: write, wrote, written." },

    // Ch 5: Subject-Verb Agreement
    { chapter: 5, type: "mcq", text: "Choose the correct verb: 'Neither the teacher nor the students ___ in the gym.'", options: ["is", "are", "was", "be"], answer: 1, solution: "In a 'neither...nor' construction, the verb agrees with the subject closest to it. 'students' is plural, so we use 'are'." },
    { chapter: 5, type: "fillin", text: "Fill in the blank with 'sings' or 'sing': 'A swarm of bees and a flock of birds ___ together.'", answer: "sing", solution: "Since the subject is plural ('swarm of bees AND a flock of birds' -> compound subject), we use the plural verb 'sing'." },

    // Ch 6: Adverbs
    { chapter: 6, type: "mcq", text: "Which adverb tells us 'where' the action happened?", options: ["Yesterday", "Inside", "Quickly", "Twice"], answer: 1, solution: "'Inside' is an adverb of place, answering the question 'where'." },
    { chapter: 6, type: "fillin", text: "Fill in the blank with the adverb form of 'heavy': 'It rained ___ all through the night.'", answer: "heavily", solution: "The adverb form of 'heavy' is 'heavily'." },

    // Ch 7: Prepositions
    { chapter: 7, type: "mcq", text: "Choose the correct preposition: 'The river flows ___ the old stone bridge.'", options: ["on", "under", "between", "at"], answer: 1, solution: "A river flows beneath or 'under' a bridge." },
    { chapter: 7, type: "fillin", text: "Complete the prepositional phrase: 'We walked ___ the dark forest with a flashlight.' (direction, entering one side and leaving the other)", answer: "through", solution: "'through' is the preposition used for movement inside a 3D space like a forest or tunnel." },

    // Ch 8: Conjunctions
    { chapter: 8, type: "mcq", text: "Which conjunction is used to express a condition?", options: ["and", "unless", "but", "so"], answer: 1, solution: "'unless' is a subordinating conjunction expressing a negative condition." },
    { chapter: 8, type: "fillin", text: "Fill in the blank with a correlative conjunction partner: 'Either you finish your homework, ___ you will not go out.'", answer: "or", solution: "'either' always pairs with 'or' in standard correlative conjunction grammar." },

    // Ch 9: Articles & Determiners
    { chapter: 9, type: "mcq", text: "Which sentence uses the article 'the' correctly?", options: ["The Mount Everest is high.", "He plays the violin wonderfully.", "We had the lunch at noon.", "The English is a great language."], answer: 1, solution: "We use 'the' before musical instruments (e.g. 'the violin'). We do not use it before singular mountains, meals, or languages." },
    { chapter: 9, type: "fillin", text: "Fill in the blank with 'many' or 'much': 'How ___ information do you have about the event?'", answer: "much", solution: "'information' is uncountable, so it requires 'much' instead of 'many'." },

    // Ch 10: Punctuation
    { chapter: 10, type: "mcq", text: "Identify the sentence that has the apostrophe placed correctly for possessive plural:", options: ["The boys's bikes were lined up.", "The boys' bikes were lined up.", "The boy's bikes were lined up (meaning plural boys).", "The boyses bikes were lined up."], answer: 1, solution: "For plural nouns ending in -s, we form the possessive by just adding an apostrophe at the end: 'boys' '." },
    { chapter: 10, type: "fillin", text: "Insert the missing punctuation in this contraction: 'He ___ s representing the class today.' (what punctuation mark replaces the 'i' in is)", answer: "'", solution: "The apostrophe (') is used in contractions to show where letters are omitted (e.g. He's)." }
  ],
  advanced: [
    // Ch 1: Nouns
    { chapter: 1, type: "mcq", text: "Which of the following is an uncountable abstract noun?", options: ["Apple", "Team", "Curiosity", "Water"], answer: 2, solution: "'Curiosity' is an abstract noun and is uncountable. 'Water' is uncountable but is a concrete/material noun." },
    { chapter: 1, type: "fillin", text: "Identify the abstract noun formed from the adjective 'true':", answer: "truth", solution: "The abstract noun form of 'true' is 'truth'." },

    // Ch 2: Pronouns
    { chapter: 2, type: "mcq", text: "Identify the underlined pronoun: '<u>This</u> is the house where my grandparents live.'", options: ["Personal Pronoun", "Demonstrative Pronoun", "Possessive Pronoun", "Reflexive Pronoun"], answer: 1, solution: "'This' functions as a demonstrative pronoun here because it points directly to the noun." },
    { chapter: 2, type: "fillin", text: "Complete the sentence: 'We made all the arrangements ___.' (reflexive)", answer: "ourselves", solution: "The reflexive pronoun for 'we' is 'ourselves'." },

    // Ch 3: Adjectives
    { chapter: 3, type: "mcq", text: "What is the correct order of adjectives for: '___ desk'?", options: ["a wooden old rectangular", "an old rectangular wooden", "a rectangular old wooden", "an old wooden rectangular"], answer: 1, solution: "Standard adjective order: Opinion/Age/Shape/Color/Origin/Material. Thus, 'an old (Age) rectangular (Shape) wooden (Material)' desk is correct." },
    { chapter: 3, type: "fillin", text: "Complete the irregular superlative comparison: 'This is the ___ (bad) storm of the season.'", answer: "worst", solution: "The comparison forms of bad are: bad (positive), worse (comparative), worst (superlative)." },

    // Ch 4: Verbs & Tenses
    { chapter: 4, type: "mcq", text: "Which sentence is in the Future Continuous tense?", options: ["I will read the book.", "I am going to read the book.", "I will be reading the book tomorrow afternoon.", "I will have read the book."], answer: 2, solution: "'will be reading' is the future continuous tense, indicating an action that will be ongoing in the future." },
    { chapter: 4, type: "fillin", text: "Change this sentence to Simple Past: 'She sings beautifully.'", answer: "She sang beautifully.", solution: "The past tense of 'sing' is 'sang'." },

    // Ch 5: Subject-Verb Agreement
    { chapter: 5, type: "mcq", text: "Choose the correct verb: 'The crowd of excited spectators ___ blocking the exit.'", options: ["were", "was", "are", "be"], answer: 1, solution: "'Crowd' is a collective noun acting as a single unit, so it takes the singular verb 'was'." },
    { chapter: 5, type: "fillin", text: "Complete the sentence with 'is' or 'are': 'Physics ___ my favorite subject in school.'", answer: "is", solution: "Although 'Physics' ends in -s, it is a singular academic subject, so it takes the singular verb 'is'." },

    // Ch 6: Adverbs
    { chapter: 6, type: "mcq", text: "Identify the adverb of frequency in: 'He seldom makes a mistake.'", options: ["seldom", "makes", "mistake", "he"], answer: 0, solution: "'seldom' is an adverb of frequency because it describes how often the action happens (very rarely)." },
    { chapter: 6, type: "fillin", text: "Fill in the blank with an adverb of degree: 'The task was ___ difficult, but we managed to finish it.' (starts with e)", answer: "extremely", solution: "'extremely' or 'equally' is an adverb of degree representing intensity." },

    // Ch 7: Prepositions
    { chapter: 7, type: "mcq", text: "Choose the correct preposition: 'She is very good ___ solving difficult grammar puzzles.'", options: ["in", "at", "with", "about"], answer: 1, solution: "The standard adjective prepositional idiom is 'good at' an activity." },
    { chapter: 7, type: "fillin", text: "Fill in the blank: 'We sat ___ the shade of the grand oak tree.'", answer: "in", solution: "One sits 'in' the shade of a tree, but 'under' the tree itself. 'In the shade' is the correct idiom." },

    // Ch 8: Conjunctions
    { chapter: 8, type: "mcq", text: "Identify the subordinating conjunction: 'Although it was late, they kept working.'", options: ["Although", "late", "kept", "working"], answer: 0, solution: "'Although' is a subordinating conjunction because it introduces a dependent concession clause." },
    { chapter: 8, type: "fillin", text: "Complete the sentence: 'She is not only talented ___ also extremely hardworking.'", answer: "but", solution: "The correlative pair is 'not only... but also'." },

    // Ch 9: Articles & Determiners
    { chapter: 9, type: "mcq", text: "Which sentence has correct article usage?", options: ["I want to learn playing the piano.", "He is a honest student.", "We visited the Ganges river.", "She is study in a university."], answer: 2, solution: "We use 'the' before holy/major rivers ('the Ganges'). 'Honest' has a silent 'h', so it takes 'an'. 'University' starts with a consonant sound (/y/), so it takes 'a'." },
    { chapter: 9, type: "fillin", text: "Fill in the blank: 'There is ___ water in the jug, so you can drink some.' (a little / a few)", answer: "a little", solution: "'Water' is uncountable, so we use 'a little' to indicate a small amount." },

    // Ch 10: Punctuation
    { chapter: 10, type: "mcq", text: "Which sentence has correct punctuation?", options: ["'No,' said Rohan, 'I won't come.'", "'No' said Rohan 'I wont come.'", "'No,' said Rohan, 'I wont come.'", "'No' said Rohan, 'I won't come.'"], answer: 0, solution: "Proper commas, capitalized first letter, apostrophe in the contraction 'won't', and closing quotes are all correctly set." },
    { chapter: 10, type: "fillin", text: "Identify the missing punctuation mark: 'The three states of matter are solid___ liquid, and gas.'", answer: ",", solution: "A comma (,) is needed to separate the items in a series." }
  ],
  olympiad: [
    // Ch 1: Nouns
    { chapter: 1, type: "mcq", text: "Identify the correct noun category for the capitalized word: 'A CONGREGATION of worshipers sat in silence.'", options: ["Common Noun", "Proper Noun", "Collective Noun", "Abstract Noun"], answer: 2, solution: "'Congregation' is a specific collective noun used for a group of worshipers or churchgoers." },
    { chapter: 1, type: "fillin", text: "Identify the compound noun in: 'We need to check in at the airport two hours early.'", answer: "airport", solution: "'airport' is a compound noun made of two words: air + port." },

    // Ch 2: Pronouns
    { chapter: 2, type: "mcq", text: "In the sentence, 'None of the students completed their homework,' what type of pronoun is 'None'?", options: ["Demonstrative Pronoun", "Relative Pronoun", "Indefinite Pronoun", "Reflexive Pronoun"], answer: 2, solution: "'None' is an indefinite pronoun because it does not refer to any specific person or thing." },
    { chapter: 2, type: "fillin", text: "Identify the pronoun that acts as a relative pronoun: 'The coach ___ trained me was very encouraging.'", answer: "who", solution: "'who' is a relative pronoun linking the relative clause to the noun 'coach'." },

    // Ch 3: Adjectives
    { chapter: 3, type: "mcq", text: "Choose the correct absolute superlative adjective that does not take 'most' or '-est':", options: ["Perfect", "Beautiful", "Intelligent", "Creative"], answer: 0, solution: "Adjectives like 'Perfect', 'Unique', or 'Dead' are absolute and cannot grammatically be compared." },
    { chapter: 3, type: "fillin", text: "What is the superlative form of the adjective 'far' when referring to additional depth/detail?", answer: "furthest", solution: "'furthest' refers to figurative distance/depth/extent, whereas 'farthest' refers to physical distance." },

    // Ch 4: Verbs & Tenses
    { chapter: 4, type: "mcq", text: "Which form of the verb represents an action completed before a specific point in the past? (Past Perfect)", options: ["She had finished her dinner before the guests arrived.", "She was finishing her dinner.", "She finished her dinner.", "She has finished her dinner."], answer: 0, solution: "The Past Perfect tense ('had finished') is used to express an action that took place before another action in the past." },
    { chapter: 4, type: "fillin", text: "What is the base verb form for 'thought'?", answer: "think", solution: "'think' is the root infinitive verb, with past forms: thought, thought." },

    // Ch 5: Subject-Verb Agreement
    { chapter: 5, type: "mcq", text: "Which sentence is grammatically correct?", options: ["Bread and butter are our daily breakfast.", "Bread and butter is our daily breakfast.", "Every player and coach are ready.", "Ten miles are a long distance to walk."], answer: 1, solution: "When two singular nouns combine to represent a single collective idea (like 'bread and butter' as a meal), they take a singular verb 'is'." },
    { chapter: 5, type: "fillin", text: "Fill in the blank with 'is' or 'are': 'The team ___ debating among themselves.' (indicating individual members disagreeing)", answer: "are", solution: "When members of a collective noun act as individuals (e.g. arguing/debating among *themselves*), the collective noun takes a plural verb: 'are'." },

    // Ch 6: Adverbs
    { chapter: 6, type: "mcq", text: "Identify the type of the underlined adverb: 'She is <u>highly</u> skilled.'", options: ["Adverb of Place", "Adverb of Manner", "Adverb of Degree", "Adverb of Frequency"], answer: 2, solution: "'highly' is an adverb of degree because it describes the extent or intensity of the skill." },
    { chapter: 6, type: "fillin", text: "Form an adverb from the adjective 'noble':", answer: "nobly", solution: "The adverb form of 'noble' is 'nobly'." },

    // Ch 7: Prepositions
    { chapter: 7, type: "mcq", text: "Which preposition correctly completes: 'The new rules are in accordance ___ international laws.'", options: ["to", "with", "by", "for"], answer: 1, solution: "The correct prepositional phrase idiom is 'in accordance with'." },
    { chapter: 7, type: "fillin", text: "Complete the prepositional phrase: 'He succeeded ___ dint of sheer hard work.'", answer: "by", solution: "The idiom 'by dint of' means 'by force of' or 'by means of'." },

    // Ch 8: Conjunctions
    { chapter: 8, type: "mcq", text: "Choose the correct conjunction for contrast and concession: '___ she was highly qualified, she did not get the position.'", options: ["Despite", "Although", "Because", "Unless"], answer: 1, solution: "'Although' is followed by a subject and a verb ('she was qualified'), making it the correct conjunction. 'Despite' requires a noun phrase." },
    { chapter: 8, type: "fillin", text: "Identify the subordinating conjunction in: 'Wait here until I return.'", answer: "until", solution: "'until' is a subordinating conjunction of time linking the dependent action to the main clause." },

    // Ch 9: Articles & Determiners
    { chapter: 9, type: "mcq", text: "Choose the correct determiners: 'We have ___ time left, so we must hurry.'", options: ["few", "a few", "little", "a little"], answer: 2, solution: "'little' time (without 'a') has a negative connotation meaning almost none, which matches the urgency of 'we must hurry'." },
    { chapter: 9, type: "fillin", text: "Which article completes this sentence: 'Copper is ___ useful metal.'", answer: "a", solution: "'useful' begins with the consonant sound /y/, so the correct indefinite article is 'a'." },

    // Ch 10: Punctuation
    { chapter: 10, type: "mcq", text: "Identify the sentence with correct punctuation including a hyphen and commas:", options: ["The self-confident student, after studying, passed the test.", "The self confident student, after studying passed the test.", "The self-confident student after studying, passed the test.", "The self confident student after studying passed the test."], answer: 0, solution: "A compound adjective before a noun takes a hyphen ('self-confident'), and parenthetical phrases are set off by commas." },
    { chapter: 10, type: "fillin", text: "Identify the punctuation mark used to separate independent clauses that are closely related in thought (longer than a comma):", answer: ";", solution: "A semicolon (;) is used to link two independent clauses that are closely related without using a conjunction." }
  ]
};

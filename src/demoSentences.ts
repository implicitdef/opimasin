import type { SentenceLevel } from "./types";

export interface DemoSentence {
  theme: string;
  level: SentenceLevel;
  sentence: string;
  englishTranslation: string;
}

// Generated with scripts/import-demo-sentences.mjs, but can be edited by hand.
// No need to fill in anything beyond these four fields, everything else (id,
// attempts, status, ...) is derived.
export const DEMO_SENTENCES: DemoSentence[] = [
  {
    theme: "nii ... kui ...",
    level: "A1",
    sentence: "Mulle meeldib nii tee kui kohv.",
    englishTranslation: "I like both tea and coffee.",
  },
  {
    theme: "past tense",
    level: "A1",
    sentence: "Eile käisin ma poes leiba ostmas.",
    englishTranslation: "Yesterday I went to the store to buy bread.",
  },

  {
    theme: "imperative",
    level: "A1",
    sentence: "Palun sulge uks kohe.",
    englishTranslation: "Please close the door immediately.",
  },
  {
    theme: "negative",
    level: "A1",
    sentence: "Mul on täna väga halb tuju.",
    englishTranslation: "I am in a very bad mood today.",
  },
  {
    theme: "negative past tense",
    level: "A1",
    sentence: "Ma ei käinud eile koolis.",
    englishTranslation: "I didn't go to school yesterday.",
  },
  {
    theme: "kauplus OR pood",
    level: "A1",
    sentence: "Ma ostan poest piima ja leiba.",
    englishTranslation: "I am buying milk and bread from the store.",
  },
  {
    theme: "kauplus OR pood",
    level: "A1",
    sentence: "Pood on täna avatud kella kaheksani.",
    englishTranslation: "The shop is open today until eight o'clock.",
  },
  {
    theme: "kauplus OR pood",
    level: "A1",
    sentence: "Kauplus asub minu kodu lähedal.",
    englishTranslation: "The store is located near my home.",
  },
  {
    theme: "any kind of animal",
    level: "A1",
    sentence: "Koer jookseb suures pargis iga päev.",
    englishTranslation: "The dog runs in the big park every day.",
  },
  {
    theme: "any kind of animal",
    level: "A1",
    sentence: "Kass magab pehmel voodil terve päeva.",
    englishTranslation: "The cat sleeps on a soft bed all day.",
  },
  {
    theme: "any kind of animal",
    level: "A1",
    sentence: "Lind laulab ilusasti puu otsas.",
    englishTranslation:
      "The bird is singing beautifully at the top of the tree.",
  },
  {
    theme: "any kind of common profession",
    level: "A1",
    sentence: "Minu ema on arst haiglas.",
    englishTranslation: "My mother is a doctor at the hospital.",
  },
  {
    theme: "any kind of common profession",
    level: "A1",
    sentence: "Ta on kokk restoranis.",
    englishTranslation: "He is a cook at a restaurant.",
  },
  {
    theme: "any kind of common profession",
    level: "A1",
    sentence: "Minu isa on õpetaja koolis.",
    englishTranslation: "My father is a teacher at school.",
  },
  {
    theme: "kahvel OR nuga OR lusikas",
    level: "A1",
    sentence: "Ma söön supi lusikaga.",
    englishTranslation: "I eat soup with a spoon.",
  },
  {
    theme: "kahvel OR nuga OR lusikas",
    level: "A1",
    sentence: "Ma lõikan leiba noaga.",
    englishTranslation: "I am cutting bread with a knife.",
  },
  {
    theme: "kahvel OR nuga OR lusikas",
    level: "A1",
    sentence: "Kahvel on laual, mitte kapis.",
    englishTranslation: "The fork is on the table, not in the cabinet.",
  },
  {
    theme: "siin OR seal",
    level: "A1",
    sentence: "Raamat on seal, mitte siin.",
    englishTranslation: "The book is there, not here.",
  },
  {
    theme: "otsas ollema",
    level: "A1",
    sentence: "Meil on täna leib otsas.",
    englishTranslation: "We are out of bread today.",
  },
  {
    theme: "ostma OR otsima",
    level: "A1",
    sentence: "Ma otsin oma võtmeid kodus.",
    englishTranslation: "I am looking for my keys at home.",
  },
  {
    theme: "sisse",
    level: "A1",
    sentence: "Kass jooksis kiiresti maja sisse.",
    englishTranslation: "The cat ran quickly into the house.",
  },
  {
    theme: "jääma",
    level: "A1",
    sentence: "Ma jään täna koju.",
    englishTranslation: "I'm staying home today.",
  },
  {
    theme: "X kohta",
    level: "A1",
    sentence: "Ma tahan tema kohta rohkem teada.",
    englishTranslation: "I want to know more about him.",
  },
  {
    theme: "milleks",
    level: "A1",
    sentence: "Milleks sa seda õuna vajad?",
    englishTranslation: "What do you need this apple for?",
  },
  {
    theme: "sinna",
    level: "A1",
    sentence: "Ma tahan minna sinna homme.",
    englishTranslation: "I want to go there tomorrow.",
  },
  {
    theme: "viitsima",
    level: "A1",
    sentence: "Ma ei viitsi täna kööki koristada.",
    englishTranslation: "I don't feel like cleaning the kitchen today.",
  },
  {
    theme: "riik",
    level: "B1",
    sentence: "Meie riik korraldab järgmisel aastal uued valimised.",
    englishTranslation: "Our country will hold new elections next year.",
  },
  {
    theme: "kaste",
    level: "B1",
    sentence: "Hommikul oli rohi kastest täiesti märg.",
    englishTranslation:
      "In the morning, the grass was completely wet with dew.",
  },
  {
    theme: "mets",
    level: "B1",
    sentence: "Sügisel käime tihti metsas seeni ja marju korjamas.",
    englishTranslation:
      "In the autumn, we often go to the forest to pick mushrooms and berries.",
  },
  {
    theme: "külmkapp",
    level: "B1",
    sentence: "Külmkapis ei ole enam piima ega juustu.",
    englishTranslation: "There is no more milk or cheese in the fridge.",
  },
  {
    theme: "üsna",
    level: "B1",
    sentence: "Täna on ilm üsna külm ja tuuline.",
    englishTranslation: "Today the weather is quite cold and windy.",
  },
  {
    theme: "avastama",
    level: "B1",
    sentence: "Lapsed armastavad õues uusi asju avastada.",
    englishTranslation: "Children love discovering new things outdoors.",
  },
  {
    theme: "kellegi käes olema",
    level: "B1",
    sentence: "See otsus on praegu direktori käes, mitte minu.",
    englishTranslation:
      "This decision is currently in the director's hands, not mine.",
  },
  {
    theme: "mul tuli meelde",
    level: "B1",
    sentence: "Mul tuli meelde, et pean poodi minema.",
    englishTranslation: "I remembered that I need to go to the store.",
  },
  {
    theme: "laisk",
    level: "B1",
    sentence:
      "Täna on nii ilus ilm, aga ma olen liiga laisk, et jalutama minna.",
    englishTranslation:
      "The weather is so beautiful today, but I'm too lazy to go for a walk.",
  },
  {
    theme: "nõusid pesema",
    level: "B1",
    sentence: "Ma pean pärast õhtusööki nõusid pesema.",
    englishTranslation: "I have to wash the dishes after dinner.",
  },
  {
    theme: "katki minema",
    level: "B1",
    sentence: "Minu telefon läks eile õhtul katki.",
    englishTranslation: "My phone broke last night.",
  },
  {
    theme: "elutuba",
    level: "B1",
    sentence: "Meie elutoas on suur pehme diivan ja televiisor.",
    englishTranslation:
      "In our living room there is a big soft sofa and a television.",
  },
  {
    theme: "võileib",
    level: "B1",
    sentence: "Ma tegin hommikul endale võileiva ja tassi teed.",
    englishTranslation:
      "In the morning I made myself a sandwich and a cup of tea.",
  },
  {
    theme: "tulemus",
    level: "B1",
    sentence: "Testi tulemus selgub homme hommikul kell üheksa.",
    englishTranslation:
      "The test result will be known tomorrow morning at nine o'clock.",
  },
  {
    theme: "sõbralik",
    level: "B1",
    sentence: "Meie uus naaber on väga sõbralik ja abivalmis inimene.",
    englishTranslation:
      "Our new neighbor is a very friendly and helpful person.",
  },
  {
    theme: "kaugel",
    level: "B1",
    sentence: "Meie kodu on linnast üsna kaugel.",
    englishTranslation: "Our home is quite far from the city.",
  },
  {
    theme: "ilmselt",
    level: "B1",
    sentence: "Ta jäi tööle, ilmselt on täna palju tegemist.",
    englishTranslation:
      "He stayed at work; apparently there is a lot to do today.",
  },
  {
    theme: "matkama",
    level: "B1",
    sentence: "Nädalavahetusel plaanime sõpradega metsas matkama minna.",
    englishTranslation:
      "This weekend we are planning to go hiking in the forest with friends.",
  },
  {
    theme: "lahutatud",
    level: "B1",
    sentence: "Mu vanemad on juba viis aastat lahutatud.",
    englishTranslation: "My parents have already been divorced for five years.",
  },
  {
    theme: "kokku leppima",
    level: "B1",
    sentence: "Me leppisime kokku, et kohtume homme kell kaks.",
    englishTranslation: "We agreed to meet tomorrow at two o'clock.",
  },
  {
    theme: "eesmärk",
    level: "B1",
    sentence: "Minu eesmärk on sel aastal rohkem sporti teha.",
    englishTranslation: "My goal is to do more sports this year.",
  },
  {
    theme: "abielus",
    level: "B1",
    sentence: "Ta on juba viis aastat õnnelikult abielus.",
    englishTranslation: "He has already been happily married for five years.",
  },
  {
    theme: "teada andma",
    level: "B1",
    sentence: "Palun anna mulle teada, kui jõuad kohale.",
    englishTranslation: "Please let me know when you arrive.",
  },
  {
    theme: "jõudma",
    level: "B1",
    sentence: "Me jõudsime koju alles hilja õhtul.",
    englishTranslation: "We only got home late in the evening.",
  },
  {
    theme: "millal",
    level: "B1",
    sentence: "Millal sa homme tööle lähed?",
    englishTranslation: "When are you going to work tomorrow?",
  },
];

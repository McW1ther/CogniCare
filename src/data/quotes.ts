import type { Quote } from "../types";

/**
 * Supportive lines, grouped by the emotion they're written for. These
 * are deliberately not generic motivational quotes — each one is
 * written to fit how that specific feeling tends to need to be met
 * (see the CogniCare emotion catalogue for the reasoning per family).
 */
const RAW: Record<string, string[]> = {
  happy: [
    "Let yourself enjoy this, without waiting for the other shoe to drop.",
    "Joy doesn't need to be earned to be real.",
    "Notice this feeling. You deserve to remember what it feels like.",
    "Good moments are still good, even if they don't last forever.",
    "You don't have to explain why you're happy. Just let it be here.",
  ],
  sad: [
    "You don't have to be positive all the time. You just have to keep going.",
    "Sadness isn't a setback — it's a sign you cared about something.",
    "It's okay to feel this and still be okay eventually.",
    "You're allowed to grieve quietly, at your own pace.",
    "This heaviness is temporary, even when it doesn't feel that way.",
  ],
  angry: [
    "Peace is not the absence of emotion, but the ability to respond with clarity.",
    "Your anger is information, not a flaw.",
    "You can feel this fully without letting it drive.",
    "Take the breath before the reaction. You get to choose what comes next.",
    "It's okay to be angry. It's not okay to let it write your story.",
  ],
  anxious: [
    "You are allowed to take things one moment at a time.",
    "You don't have to solve everything tonight.",
    "Your body is trying to protect you. You can thank it and still feel safe.",
    "Uncertainty is uncomfortable, not dangerous.",
    "One steady breath is enough to begin.",
  ],
  excited: [
    "Let this feeling move through you fully — you don't need to contain it.",
    "Excitement is your energy telling you something matters.",
    "You're allowed to be this hopeful about something new.",
    "Ride this feeling. It's yours to enjoy.",
    "Big feelings deserve room to exist.",
  ],
  relaxed: [
    "Rest is not something you have to earn.",
    "This stillness is doing something, even if it looks like nothing.",
    "You are allowed to simply be, without producing anything.",
    "Let your shoulders drop. There's nowhere else you need to be right now.",
    "Calm is not empty — it's full of quiet.",
  ],
  lonely: [
    "Your feelings matter, even when no one else can see them.",
    "Being alone right now doesn't mean you're unseen forever.",
    "Reaching out is brave, not needy.",
    "You are still connected to yourself, even in this quiet.",
    "This feeling is real, and it will not stay exactly like this.",
  ],
  stressed: [
    "You can pause without falling behind.",
    "You don't have to carry all of it at once.",
    "One task at a time is still progress.",
    "Your worth isn't measured by how much you finish today.",
    "It's okay to put something down so you can pick yourself back up.",
  ],
  confident: [
    "You've earned the right to trust yourself here.",
    "Confidence isn't knowing everything — it's trusting you'll figure it out.",
    "Let yourself take up the space you deserve.",
    "You don't need permission to believe in your own work.",
    "This certainty is worth remembering for the harder days.",
  ],
  grateful: [
    "Noticing the good is its own quiet skill.",
    "Gratitude doesn't erase hardship — it just makes room beside it.",
    "Let this appreciation stay with you a little longer.",
    "Small things count. Let yourself count them.",
    "You're allowed to feel thankful and still want more.",
  ],
  bored: [
    "Boredom is space your mind hasn't filled yet.",
    "You don't need to rush to the next thing.",
    "Stillness can be a beginning, not a dead end.",
    "Sometimes nothing happening is exactly what you need.",
    "This lull won't last, and it doesn't have to be wasted.",
  ],
  hopeful: [
    "Small steps still move you forward.",
    "Hope doesn't need proof to be worth holding onto.",
    "You're allowed to expect something good.",
    "A little hope is enough to keep walking.",
    "Better doesn't have to arrive all at once to be real.",
  ],
  jealous: [
    "Jealousy usually points to something you actually want, not something wrong with you.",
    "You can admire someone and still be working on yourself.",
    "This feeling is worth examining, not hiding from.",
    "Their timeline doesn't erase your progress.",
    "It's okay to want more without resenting what you have.",
  ],
  guilty: [
    "You can take responsibility without punishing yourself endlessly.",
    "Guilt shows you still care — that's not nothing.",
    "One mistake isn't the whole story of who you are.",
    "You're allowed to make it right and then let it go.",
    "Growth often starts exactly where guilt does.",
  ],
  shy: [
    "You don't have to be loud to be worth listening to.",
    "Quiet isn't the same as absent.",
    "You're allowed to warm up at your own pace.",
    "Taking your time isn't a weakness.",
    "You don't owe anyone constant ease.",
  ],
  curious: [
    "Not knowing yet is a good place to be.",
    "Curiosity is a quiet form of courage.",
    "You're allowed to follow a question just because it interests you.",
    "Wonder doesn't need a destination.",
    "Ask the question. It's already changing how you see things.",
  ],
  tired: [
    "Rest is productive too, even if it doesn't look like it.",
    "You don't have to push through everything today.",
    "Tired doesn't mean weak — it means you've been carrying something.",
    "It's okay to do less right now.",
    "Your energy will come back. Let it, instead of forcing it.",
  ],
  motivated: [
    "Progress is built quietly, one decision at a time.",
    "You don't need to feel ready to begin — just willing.",
    "This momentum is yours. Use it gently, not urgently.",
    "Small consistent effort outlasts short bursts of intensity.",
    "Keep going. You're closer than it feels.",
  ],
  overwhelmed: [
    "You don't have to do all of it right now.",
    "Pick one small thing. That's enough for this moment.",
    "It's okay to simplify, even if it feels like giving something up.",
    "Breathe first, plan second.",
    "You can put some of this down — it will still be there when you're ready.",
  ],
  peaceful: [
    "There is strength in choosing calm.",
    "This quiet is allowed to last.",
    "Peace doesn't mean nothing is happening — it means you're not at war with it.",
    "Let this settledness be enough for today.",
    "You don't have to chase the next thing right now.",
  ],
};

export const QUOTES: Quote[] = Object.entries(RAW).flatMap(([emotionId, texts]) =>
  texts.map((text, i) => ({ id: `${emotionId}-${i}`, emotionId, text })),
);

export function quotesFor(emotionId: string): Quote[] {
  return QUOTES.filter((q) => q.emotionId === emotionId);
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

/** Deterministic "quote of the day" for an emotion — stable across
 * reloads within the same day, rotates the next day. */
export function quoteOfDay(emotionId: string, date: Date = new Date()): Quote {
  const pool = quotesFor(emotionId);
  const idx = dayOfYear(date) % pool.length;
  return pool[idx];
}

export function randomQuote(emotionId: string, excludeId?: string): Quote {
  const pool = quotesFor(emotionId).filter((q) => q.id !== excludeId);
  const source = pool.length ? pool : quotesFor(emotionId);
  return source[Math.floor(Math.random() * source.length)];
}

export function getQuote(id: string): Quote | undefined {
  return QUOTES.find((q) => q.id === id);
}

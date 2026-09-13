import {
  Sun,
  CloudRain,
  Flame,
  Waves,
  Sparkles,
  Leaf,
  Moon,
  AlarmClock,
  Compass,
  Heart,
  Hourglass,
  Sunrise,
  Eye,
  CloudFog,
  Feather,
  Search,
  BatteryLow,
  Rocket,
  CloudLightning,
  Flower2,
} from "lucide-react";
import type { Emotion, Valence } from "../types";

/**
 * The CogniCare emotion catalogue.
 *
 * `primaryColor` / `calmingColor` are the original CogniCare colour
 * concept — primary is the colour of the feeling itself, calming is
 * the colour the interface leans toward to support it. Both are used
 * together (never as full-screen fills) to build the soft accent
 * "aurora" behind hero content: primary and calming form the two
 * light sources.
 */
export const EMOTIONS: Emotion[] = [
  {
    id: "happy",
    label: "Happy",
    family: "uplifted",
    icon: Sun,
    primaryColor: "#FFD700",
    calmingColor: "#FFD700",
    description: "A lightness that's good to notice.",
    support:
      "This is worth pausing for. You don't need a reason big enough to justify feeling good — let yourself have this moment without rushing past it.",
    suggestion: "Name one specific thing that's part of this feeling, out loud or on paper.",
    journalPrompt: "What's contributing to this feeling right now, and how would you like to remember it?",
  },
  {
    id: "sad",
    label: "Sad",
    family: "heavy",
    icon: CloudRain,
    primaryColor: "#1E90FF",
    calmingColor: "#FFD700",
    description: "A heaviness that deserves warmth, not fixing.",
    support:
      "You don't have to be positive all the time. You just have to keep going. Sadness usually means something mattered to you — that's allowed to sit here for a while.",
    suggestion: "Wrap yourself in something warm — a blanket, tea, a call with someone steady — and let the feeling be there.",
    journalPrompt: "What does this sadness want you to know, if you slow down enough to listen?",
  },
  {
    id: "angry",
    label: "Angry",
    family: "tense",
    icon: Flame,
    primaryColor: "#FF4500",
    calmingColor: "#4B9CD3",
    description: "A sharp energy that wants a release.",
    support:
      "Peace is not the absence of emotion, but the ability to respond with clarity. Anger is information, not a flaw — you can feel it fully without letting it decide what happens next.",
    suggestion: "Unclench your jaw and shoulders, then take five slow breaths before you decide anything.",
    journalPrompt: "What line was crossed, and what do you actually need right now?",
  },
  {
    id: "anxious",
    label: "Anxious",
    family: "tense",
    icon: Waves,
    primaryColor: "#8A2BE2",
    calmingColor: "#98FB98",
    description: "A restless what-if energy in your chest.",
    support:
      "You are allowed to take things one moment at a time. Your body is trying to keep you safe, even if it's working overtime — you only need to get through this next moment.",
    suggestion: "Try 4 counts in, hold for 4, out for 6 — three rounds, nothing else required.",
    journalPrompt: "What's the worry actually about, underneath the noise of it?",
  },
  {
    id: "excited",
    label: "Excited",
    family: "uplifted",
    icon: Sparkles,
    primaryColor: "#FF69B4",
    calmingColor: "#FF69B4",
    description: "Energy that wants to move somewhere.",
    support:
      "Let this feeling move through you fully — you don't need to contain it or explain why you're this hopeful about something new.",
    suggestion: "Tell someone, or write down exactly what you're looking forward to and why.",
    journalPrompt: "What is it about this that lit you up?",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    family: "steady",
    icon: Leaf,
    primaryColor: "#3CB371",
    calmingColor: "#3CB371",
    description: "A rare, unclenched kind of ease.",
    support:
      "This stillness is doing something, even if it looks like nothing. You don't have to earn rest, and you don't have to be productive with it.",
    suggestion: "Stay here a little longer before you move on to the next thing.",
    journalPrompt: "What made space for this feeling today?",
  },
  {
    id: "lonely",
    label: "Lonely",
    family: "heavy",
    icon: Moon,
    primaryColor: "#708090",
    calmingColor: "#FFB6C1",
    description: "A quiet ache for closeness.",
    support:
      "Your feelings matter, even when no one else can see them. Being alone in this moment doesn't mean you're unseen forever — this will not stay exactly like this.",
    suggestion: "Send one honest message to someone, even just “thinking of you” — or write the message here first.",
    journalPrompt: "Who or what would make this moment feel less alone?",
  },
  {
    id: "stressed",
    label: "Stressed",
    family: "tense",
    icon: AlarmClock,
    primaryColor: "#DC143C",
    calmingColor: "#20B2AA",
    description: "A pressure that makes everything feel urgent.",
    support:
      "You can pause without falling behind. Not everything on your plate needs to happen at once, even if it feels that way right now.",
    suggestion: "Write down everything on your mind, then circle only the one thing that actually needs doing today.",
    journalPrompt: "What's actually urgent, and what only feels urgent?",
  },
  {
    id: "confident",
    label: "Confident",
    family: "uplifted",
    icon: Compass,
    primaryColor: "#FF8C00",
    calmingColor: "#FF8C00",
    description: "A solid, grounded trust in yourself.",
    support:
      "You've earned the right to trust yourself here. This certainty is worth remembering — write it down so it's still here on the harder days.",
    suggestion: "Do the thing you've been putting off while this feeling is fresh.",
    journalPrompt: "What evidence do you have that you can trust yourself right now?",
  },
  {
    id: "grateful",
    label: "Grateful",
    family: "steady",
    icon: Heart,
    primaryColor: "#ADFF2F",
    calmingColor: "#ADFF2F",
    description: "A quiet appreciation for what's here.",
    support:
      "Noticing the good is its own quiet skill, and it doesn't cancel out whatever else is hard. You're allowed to feel thankful and still want more.",
    suggestion: "Tell the person, or write down exactly what you're grateful for and why it matters.",
    journalPrompt: "What's something small you'd usually overlook that you noticed today?",
  },
  {
    id: "bored",
    label: "Bored",
    family: "low",
    icon: Hourglass,
    primaryColor: "#D3D3D3",
    calmingColor: "#00CED1",
    description: "An unfilled, restless kind of stillness.",
    support:
      "Boredom is space your mind hasn't filled yet, not a problem to solve immediately. Sometimes nothing happening is exactly what you need before the next thing.",
    suggestion: "Sit with it for five more minutes before reaching for a distraction.",
    journalPrompt: "If this restlessness could turn into curiosity, what would it point toward?",
  },
  {
    id: "hopeful",
    label: "Hopeful",
    family: "uplifted",
    icon: Sunrise,
    primaryColor: "#40E0D0",
    calmingColor: "#40E0D0",
    description: "A quiet expectation that things can improve.",
    support:
      "Small steps still move you forward. You don't need proof that things will work out to let yourself feel hopeful about it.",
    suggestion: "Pick one small, doable step toward the thing you're hopeful about.",
    journalPrompt: "What are you hoping for, specifically, and what's the first small sign it's arriving?",
  },
  {
    id: "jealous",
    label: "Jealous",
    family: "tense",
    icon: Eye,
    primaryColor: "#228B22",
    calmingColor: "#FFDAB9",
    description: "A sting that points at something you want.",
    support:
      "Jealousy usually points to something you actually want, not something wrong with you. You can admire someone else's path and still be working on your own.",
    suggestion: "Name exactly what you're jealous of — the specific thing, not the person.",
    journalPrompt: "What does this feeling reveal about something you want for yourself?",
  },
  {
    id: "guilty",
    label: "Guilty",
    family: "heavy",
    icon: CloudFog,
    primaryColor: "#800000",
    calmingColor: "#90EE90",
    description: "A weight from something you wish you'd done differently.",
    support:
      "You can take responsibility without punishing yourself endlessly. One mistake isn't the whole story of who you are — growth often starts exactly where guilt does.",
    suggestion: "Decide one concrete way to make it right, then let the rest go for tonight.",
    journalPrompt: "What would taking responsibility, without self-punishment, look like here?",
  },
  {
    id: "shy",
    label: "Shy",
    family: "low",
    icon: Feather,
    primaryColor: "#FFB6C1",
    calmingColor: "#4682B4",
    description: "A held-back feeling around others.",
    support:
      "You don't have to be loud to be worth listening to. Quiet isn't the same as absent, and you're allowed to warm up at your own pace.",
    suggestion: "Prepare one small thing you'd feel comfortable saying, so it's ready when you need it.",
    journalPrompt: "What would feel safe to share, even in a small way?",
  },
  {
    id: "curious",
    label: "Curious",
    family: "uplifted",
    icon: Search,
    primaryColor: "#00CED1",
    calmingColor: "#FFD700",
    description: "An open pull toward something unknown.",
    support:
      "Not knowing yet is a good place to be. Curiosity is a quiet form of courage — you're allowed to follow a question just because it interests you.",
    suggestion: "Spend ten minutes actually looking into the thing you're curious about.",
    journalPrompt: "What question keeps tugging at your attention lately?",
  },
  {
    id: "tired",
    label: "Tired",
    family: "low",
    icon: BatteryLow,
    primaryColor: "#A9A9A9",
    calmingColor: "#FFA07A",
    description: "A depletion that's asking to be respected.",
    support:
      "Rest is productive too, even if it doesn't look like it. Tired doesn't mean weak — it usually means you've been carrying something for a while.",
    suggestion: "Lower tonight's expectations by one notch and see how that feels.",
    journalPrompt: "What has this tiredness been carrying for you lately?",
  },
  {
    id: "motivated",
    label: "Motivated",
    family: "uplifted",
    icon: Rocket,
    primaryColor: "#FF6347",
    calmingColor: "#FF6347",
    description: "A pull toward action and momentum.",
    support:
      "Progress is built quietly, one decision at a time. Use this momentum gently rather than urgently — it'll last longer that way.",
    suggestion: "Pick the smallest possible next step and do just that one thing.",
    journalPrompt: "What's one small action that would use this energy well?",
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    family: "tense",
    icon: CloudLightning,
    primaryColor: "#8B0000",
    calmingColor: "#98FB98",
    description: "Too much, arriving all at once.",
    support:
      "You don't have to do all of it right now. It's okay to simplify, even if it feels like giving something up — breathe first, plan second.",
    suggestion: "Write down everything crowding your mind, then close the list and choose only one line.",
    journalPrompt: "If you could only handle one thing today, what would it be?",
  },
  {
    id: "peaceful",
    label: "Peaceful",
    family: "steady",
    icon: Flower2,
    primaryColor: "#98FB98",
    calmingColor: "#98FB98",
    description: "A settled quiet, nothing to fight.",
    support:
      "There is strength in choosing calm. Peace doesn't mean nothing is happening — it means you're not at war with what is.",
    suggestion: "Let this settledness be enough for today, without reaching for the next thing.",
    journalPrompt: "What does this peace feel like in your body right now?",
  },
];

export const EMOTION_MAP: Record<string, Emotion> = Object.fromEntries(
  EMOTIONS.map((e) => [e.id, e]),
);

export const FAMILY_LABEL: Record<Emotion["family"], string> = {
  uplifted: "Uplifted",
  steady: "Steady",
  tense: "Tense",
  heavy: "Heavy",
  low: "Low energy",
};

export const FAMILY_ORDER: Emotion["family"][] = ["uplifted", "steady", "tense", "heavy", "low"];

export function getEmotion(id: string | null | undefined): Emotion | undefined {
  if (!id) return undefined;
  return EMOTION_MAP[id];
}

/** Which "how did this feel" bucket each family belongs to, for the
 * diary archive. Derived from family rather than hand-tagging every
 * emotion, so it can never drift out of sync. */
export const FAMILY_VALENCE: Record<Emotion["family"], Valence> = {
  uplifted: "good",
  steady: "good",
  tense: "difficult",
  heavy: "difficult",
  low: "mixed",
};

/** Untagged entries (emotionId: null) default to "mixed" rather than
 * being forced into good or difficult. */
export function getValence(emotionId: string | null | undefined): Valence {
  const emotion = getEmotion(emotionId);
  return emotion ? FAMILY_VALENCE[emotion.family] : "mixed";
}

"use client";

let cachedVoice: SpeechSynthesisVoice | null = null;

function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ??
    voices.find((v) => v.lang.startsWith("en-US")) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null;

  return cachedVoice;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    getEnglishVoice();
  };
}

export function speakText(text: string, rate = 0.85): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;

  const voice = getEnglishVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

/** @deprecated Use speakText */
export function speakWord(term: string): void {
  speakText(term);
}

async function fetchDictionaryAudio(term: string): Promise<string | null> {
  const slug = encodeURIComponent(term.trim().toLowerCase());
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${slug}`);

  if (!res.ok) return null;

  const entries = (await res.json()) as Array<{
    phonetics?: Array<{ text?: string; audio?: string }>;
  }>;

  for (const entry of entries) {
    for (const phonetic of entry.phonetics ?? []) {
      if (phonetic.audio) return phonetic.audio;
    }
  }

  return null;
}

export async function playWordPronunciation(term: string): Promise<void> {
  try {
    const audioUrl = await fetchDictionaryAudio(term);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      await audio.play();
      return;
    }
  } catch {
    // fall through to speech synthesis
  }

  speakText(term);
}

export async function playSentence(text: string): Promise<void> {
  speakText(text.trim(), 0.8);
}

export async function playTextPronunciation(
  text: string,
  mode: "word" | "sentence" = "word"
): Promise<void> {
  if (mode === "sentence") {
    await playSentence(text);
    return;
  }
  await playWordPronunciation(text);
}

export function formatIpa(ipa: string | null | undefined): string | null {
  if (!ipa?.trim()) return null;
  const cleaned = ipa.trim();
  if (cleaned.startsWith("/") && cleaned.endsWith("/")) return cleaned;
  return `/${cleaned}/`;
}

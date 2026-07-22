/**
 * Helper to play Japanese text pronunciation using Web Speech API (speechSynthesis)
 */
export const playJapaneseSpeech = (text: string, rate = 0.9): void => {
  if (!('speechSynthesis' in window) || !text) {
    console.warn('Speech synthesis is not supported or empty text provided.');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any currently playing audio

    // Clean text if it contains formatting markers (e.g. ~, ..., [], /)
    const cleanText = text.replace(/~|\.\.\.|\/|\[|\]/g, ' ').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;

    // Try to find a Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja') || v.lang.includes('JP'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Failed to play speech audio:', err);
  }
};


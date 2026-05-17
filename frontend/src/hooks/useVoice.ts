import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoice() {
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const recognitionRef = useRef<any>(null);

  // 🔥 Load voices properly (important for Chrome)
  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Stop previous speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synthRef.current.getVoices();

    const preferredVoice =
      voices.find((v) => v.name.includes("Google")) ||
      voices.find((v) => v.name.includes("Microsoft")) ||
      voices.find((v) => v.lang === "en-US");

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      console.log("✅ Speech finished");
      onEnd && onEnd();
    };

    utterance.onerror = (e) => {
      console.error("❌ Speech error:", e);
      onEnd && onEnd();
    };

    console.log("🔊 AI बोल रहा:", text);

    setTimeout(() => {
      synthRef.current.speak(utterance);
    }, 50);
  }, []);

  const startListening = useCallback(
    (onResult: (transcript: string) => void, onEnd?: () => void) => {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Browser does not support Speech Recognition. Use Chrome.");
        return;
      }

      try {
        recognitionRef.current?.stop();
      } catch {}

      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("User:", transcript);
        onResult(transcript);
      };

      recognition.onend = () => {
        console.log("🎤 Listening stopped");
        onEnd && onEnd();
      };

      recognition.onerror = (e: any) => {
        console.error("Speech recognition error:", e.error);
        onEnd && onEnd();
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch (err) {
        console.error("Cannot start mic:", err);
      }
    },
    []
  );

  // ─── STOP LISTENING ─────────────────────────────
  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {}
  }, []);

  // ─── STOP SPEAKING ─────────────────────────────
  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
  }, []);

  return { speak, startListening, stopListening, stopSpeaking };
}

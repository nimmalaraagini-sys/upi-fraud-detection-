/**
 * Multi-Lingual Regional Voice Alert Engine
 * Speaks scam and fraud warnings in regional Indian languages:
 * English, Telugu, Hindi, Tamil, Kannada, Marathi
 * Uses Web Speech API with fallback phonetics
 */

export type IndianLanguage = "te-IN" | "hi-IN" | "ta-IN" | "kn-IN" | "mr-IN" | "en-IN";

export interface VoiceAlertScript {
  code: IndianLanguage;
  name: string;
  nativeName: string;
  stopWarning: string;
  collectTrapWarning: string;
  callScamWarning: string;
  safeMessage: string;
}

export const REGIONAL_VOICE_SCRIPTS: Record<IndianLanguage, VoiceAlertScript> = {
  "en-IN": {
    code: "en-IN",
    name: "English (India)",
    nativeName: "English",
    stopWarning: "Warning! High risk payment detected. This beneficiary has multiple fraud reports. Do not enter your UPI PIN.",
    collectTrapWarning: "Stop! This is a Collect Request. Entering your PIN will DEDUCT money from your account, not credit it.",
    callScamWarning: "Caution! You are on an active phone call. Banks or police never ask you to transfer money to prove your innocence.",
    safeMessage: "Verified. This payment looks safe and normal."
  },
  "te-IN": {
    code: "te-IN",
    name: "Telugu",
    nativeName: "తెలుగు",
    stopWarning: "హెచ్చరిక! ఆగండి! ఈ ఖాతాపై సైబర్ మోసం అనుమానం ఉంది. మీ యూపీఐ పిన్ ఎంటర్ చేయవద్దు.",
    collectTrapWarning: "జాగ్రత్త! ఇది మనీ కలెక్ట్ రిక్వెస్ట్. పిన్ కొడితే మీ ఖాతా నుండి డబ్బు కట్ అవుతుంది, రాదు!",
    callScamWarning: "హెచ్చరిక! మీరు ఫోన్ కాల్ లో ఉన్నారు. పోలీసులు లేదా బ్యాంక్ అధికారులు ఎప్పటికీ డబ్బు ట్రాన్స్ఫర్ చేయమని అడగరు.",
    safeMessage: "ధృవీకరించబడింది. ఈ చెల్లింపు సురక్షితమైనది."
  },
  "hi-IN": {
    code: "hi-IN",
    name: "Hindi",
    nativeName: "हिन्दी",
    stopWarning: "सावधान! रुकिए! इस खाते पर साइबर फ्रॉड की रिपोर्ट है। अपना यूपीआई पिन बिल्कुल दर्ज न करें।",
    collectTrapWarning: "रुकिए! यह पैसे लेने की रिक्वेस्ट है। पिन डालने पर आपके खाते से पैसे कटेंगे, मिलेंगे नहीं!",
    callScamWarning: "सावधान! आप फोन कॉल पर हैं। बैंक या पुलिस कभी भी पैसे ट्रांसफर करने को नहीं कहते।",
    safeMessage: "सत्यापित। यह भुगतान सुरक्षित प्रतीत होता है।"
  },
  "ta-IN": {
    code: "ta-IN",
    name: "Tamil",
    nativeName: "தமிழ்",
    stopWarning: "எச்சரிக்கை! நில்லுங்கள்! இந்த கணக்கில் பண மோசடி புகார் உள்ளது. உங்கள் யூபிஐ பின்னை உள்ளிட வேண்டாம்.",
    collectTrapWarning: "கவனம்! இது பணம் பெறும் கோரிக்கை அல்ல. பின்னை உள்ளிட்டால் உங்கள் பணம் கழிக்கப்படும்.",
    callScamWarning: "எச்சரிக்கை! நீங்கள் தொலைபேசி அழைப்பில் உள்ளீர்கள். வங்கி அதிகாரிகள் பணம் அனுப்ப கேட்க மாட்டார்கள்.",
    safeMessage: "சரிபார்க்கப்பட்டது. இந்த பரிவர்த்தனை பாதுகாப்பானது."
  },
  "kn-IN": {
    code: "kn-IN",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    stopWarning: "ಎಚ್ಚರಿಕೆ! ನಿಲ್ಲಿ! ಈ ಖಾತೆಯ ಮೇಲೆ ಸೈಬರ್ ವಂಚನೆ ದೂರುಗಳಿವೆ. ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಬೇಡಿ.",
    collectTrapWarning: "ಎಚ್ಚರ! ಇದು ಹಣ ಪಡೆಯುವ ವಿನಂತಿಯಲ್ಲ. ಪಿನ್ ಒತ್ತಿದರೆ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತಗೊಳ್ಳುತ್ತದೆ.",
    callScamWarning: "ಎಚ್ಚರಿಕೆ! ನೀವು ಫೋನ್ ಕರೆಯಲ್ಲಿರುವಿರಿ. ಪೊಲೀಸರು ಅಥವಾ ಬ್ಯಾಂಕ್ ಹಣ ವರ್ಗಾಯಿಸಲು ಕೇಳುವುದಿಲ್ಲ.",
    safeMessage: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಈ ಪಾವತಿ ಸುರಕ್ಷಿತವಾಗಿದೆ."
  },
  "mr-IN": {
    code: "mr-IN",
    name: "Marathi",
    nativeName: "मराठी",
    stopWarning: "सावधान! थांबा! या खात्यावर सायबर फसवणुकीची नोंद आहे. आपला युपीआय पिन टाकू नका.",
    collectTrapWarning: "लक्ष द्या! ही कलेक्ट रिक्वेस्ट आहे. पिन टाकल्यास तुमच्या खात्यातून पैसे कट होतील, मिळणार नाहीत!",
    callScamWarning: "सावधान! तुम्ही फोन कॉलवर आहात. पोलीस किंवा बँक कधीही पैसे पाठवण्यास सांगत नाहीत.",
    safeMessage: "सत्यापित. हे पेमेंट सुरक्षित आहे."
  }
};

class RegionalVoiceService {
  private currentLanguage: IndianLanguage = "en-IN";

  constructor() {
    // Auto-detect or default to en-IN / te-IN
  }

  public getSelectedLanguage(): IndianLanguage {
    return this.currentLanguage;
  }

  public setLanguage(lang: IndianLanguage) {
    this.currentLanguage = lang;
  }

  public speakAlert(type: "STOP_SCAM" | "COLLECT_TRAP" | "CALL_SCAM" | "SAFE", onEnd?: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const script = REGIONAL_VOICE_SCRIPTS[this.currentLanguage] || REGIONAL_VOICE_SCRIPTS["en-IN"];
      let text = script.stopWarning;
      if (type === "COLLECT_TRAP") text = script.collectTrapWarning;
      if (type === "CALL_SCAM") text = script.callScamWarning;
      if (type === "SAFE") text = script.safeMessage;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.currentLanguage;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Find suitable voice if supported
      const voices = window.speechSynthesis.getVoices();
      const langVoice = voices.find(v => v.lang === this.currentLanguage || v.lang.startsWith(this.currentLanguage.split("-")[0]));
      if (langVoice) {
        utterance.voice = langVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Regional voice alert error:", e);
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const regionalVoice = new RegionalVoiceService();

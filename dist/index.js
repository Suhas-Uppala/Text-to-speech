document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const speakBtn = document.getElementById('speak-btn');
    const voiceSelect = document.getElementById('voice-select');
    const rateSelect = document.getElementById('rate-select');
    const speech = new SpeechSynthesisUtterance();
    let voices = [];
    let startTime;
    let isPlaying = false;
    // Initialize voices
    const initVoices = () => {
        voices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = voices
            .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
            .join('');
    };
    // Handle voice loading
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = initVoices;
    }
    // Set speech properties
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    const highlightTextInTextarea = (text, currentWordIndex) => {
        const words = text.split(/\s+/);
        if (currentWordIndex >= words.length)
            return;
        const beforeWords = words.slice(0, currentWordIndex).join(' ');
        const currentWord = words[currentWordIndex];
        const afterWords = words.slice(currentWordIndex + 1).join(' ');
        // Remove any existing highlight
        const parent = textInput.parentElement;
        const existingHighlight = parent.querySelector('.highlight-overlay');
        if (existingHighlight) {
            parent.removeChild(existingHighlight);
        }
        const highlightedText = `${beforeWords} <span class="highlight">${currentWord}</span> ${afterWords}`;
        // Create a temporary div to display highlighted text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedText;
        tempDiv.className = `${textInput.className} highlight-overlay`;
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.right = '0';
        tempDiv.style.bottom = '0';
        tempDiv.style.pointerEvents = 'none';
        tempDiv.style.whiteSpace = 'pre-wrap';
        // Position the temp div over textarea
        parent.style.position = 'relative';
        parent.appendChild(tempDiv);
    };
    speech.onstart = () => {
        isPlaying = true;
        speakBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
        speakBtn.classList.add('from-red-400', 'to-red-600');
        speakBtn.classList.remove('from-blue-400', 'to-blue-600');
        startTime = Date.now();
    };
    speech.onboundary = (event) => {
        if (event.name === 'word' && isPlaying) {
            const text = speech.text;
            const words = text.split(/\s+/);
            const currentWordIndex = Math.floor(event.charIndex / (text.length / words.length));
            highlightTextInTextarea(text, currentWordIndex);
        }
    };
    speech.onend = () => {
        isPlaying = false;
        speakBtn.innerHTML = '<i class="fas fa-play"></i> Speak Now';
        speakBtn.classList.remove('from-red-400', 'to-red-600');
        speakBtn.classList.add('from-blue-400', 'to-blue-600');
        // Remove highlight overlay
        const parent = textInput.parentElement;
        const highlightOverlay = parent.querySelector('.highlight-overlay');
        if (highlightOverlay) {
            parent.removeChild(highlightOverlay);
        }
    };
    speakBtn.addEventListener('click', () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            return;
        }
        const text = textInput.value.trim();
        if (text) {
            speech.text = text;
            speech.voice = voices[parseInt(voiceSelect.value)] || null;
            speech.rate = parseFloat(rateSelect.value);
            window.speechSynthesis.speak(speech);
        }
    });
    // Add animations for interactive elements
    textInput.addEventListener('focus', () => {
        textInput.style.transform = 'scale(1.01)';
    });
    textInput.addEventListener('blur', () => {
        textInput.style.transform = 'scale(1)';
    });
});

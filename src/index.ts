document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input') as HTMLTextAreaElement;
    const speakBtn = document.getElementById('speak-btn') as HTMLButtonElement;
    const wordsContainer = document.getElementById('words-container') as HTMLDivElement;

    const speech = new SpeechSynthesisUtterance();
    let words: string[] = [];
    let wordStartTimes: number[] = [];
    let startTime: number;

    // Set speech properties for better word boundary detection
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    const createWordSpans = (text: string) => {
        words = text.trim().split(/\s+/);
        wordsContainer.innerHTML = words
            .map((word, index) => `<span class="word" data-index="${index}">${word}</span>`)
            .join(' ');
        wordsContainer.classList.remove('hidden');
        
        // Calculate approximate time for each word
        const averageWordDuration = 60000 / (speech.rate * 180); // 180 words per minute is average
        wordStartTimes = words.map((_, index) => index * averageWordDuration);
    };

    const highlightWord = (index: number) => {
        document.querySelectorAll('.word').forEach(span => {
            span.classList.remove('highlight');
        });
        const wordSpan = document.querySelector(`[data-index="${index}"]`);
        if (wordSpan) {
            wordSpan.classList.add('highlight');
            wordSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    speech.onstart = () => {
        startTime = Date.now();
        highlightWord(0);
    };

    speech.onboundary = (event) => {
        if (event.name === 'word') {
            const elapsedTime = Date.now() - startTime;
            const currentWordIndex = wordStartTimes.findIndex(time => time > elapsedTime);
            highlightWord(currentWordIndex === -1 ? words.length - 1 : currentWordIndex - 1);
        }
    };

    speech.onend = () => {
        document.querySelectorAll('.word').forEach(span => {
            span.classList.remove('highlight');
        });
    };

    speakBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            createWordSpans(text);
            speech.text = text;
            window.speechSynthesis.speak(speech);
        }
    });
});

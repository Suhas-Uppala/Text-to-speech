const textInput = document.getElementById("text-input");
const speakButton = document.getElementById("speak-btn");
if ('speechSynthesis' in window) {
    console.log("Speech synthesis is supported!");
}
else {
    console.log("Speech synthesis is NOT supported in this browser.");
}
speakButton.addEventListener("click", () => {
    const text = textInput.value;
    if (text.trim() === "") {
        alert("Please enter some text!");
        return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    // Ensure voices are loaded before speaking
    speech.voice = window.speechSynthesis.getVoices()[0];
    // Clear queue and add slight delay
    window.speechSynthesis.cancel();
    setTimeout(() => {
        window.speechSynthesis.speak(speech);
    }, 100);
});
// Load voices when available
window.speechSynthesis.onvoiceschanged = () => {
    console.log("Voices updated!");
};

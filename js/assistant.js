document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // CUTE ASSISTANT LOGIC
    // ==============================
    const assistantBubble = document.getElementById('assistantBubble');
    const assistantMessage = document.getElementById('assistantMessage');
    const assistantAvatar = document.getElementById('assistantAvatar');

    const assistantMessages = [
        "Psst... maafin dia ya kak 🥺",
        "Dia sampai begadang lho buatin ini buat kakak 🥺",
        "Ayo kak dimaafin, dia sayang banget sama kakak 💖",
        "Kata dia, kakak itu dunia-nya dia 🥺",
        "Dia nyesel banget kak... beneran deh 😢",
        "Semoga kakak senyum ya baca ini 🥰"
    ];

    let bubbleTimeout;

    const showAssistantMessage = (customMsg = null) => {
        if (!assistantBubble) return;
        
        const msg = customMsg || assistantMessages[Math.floor(Math.random() * assistantMessages.length)];
        if(assistantMessage) assistantMessage.textContent = msg;
        
        assistantBubble.classList.remove('hidden');
        
        clearTimeout(bubbleTimeout);
        bubbleTimeout = setTimeout(() => {
            assistantBubble.classList.add('hidden');
        }, 4000);
    };

    setTimeout(() => {
        showAssistantMessage("Halo kak Allysa! 👋");
    }, 5000);

    setInterval(() => {
        showAssistantMessage();
    }, 12000);

    if (assistantAvatar) {
        assistantAvatar.addEventListener('click', (e) => {
            e.stopPropagation(); 
            showAssistantMessage();
        });
    }
});

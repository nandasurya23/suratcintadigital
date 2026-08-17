document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // EDIT THESE VALUES
    // ==============================
    const whatsappNumber = "6281339684249"; 
    const whatsappMessage = "Aku udah baca semuanya sampai akhir... Makasih ya udah jujur dan buatin ini buat aku. Iya sayang, aku maafin kamu. Kita sama-sama terus belajar dan berusaha ya ❤️";

    const btnForgive = document.getElementById('btnForgive');
    if (btnForgive) {
        btnForgive.addEventListener('click', () => {
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.location.href = whatsappUrl;
        });
    }

    // ==============================
    // HEARTBEAT UNLOCK LOGIC
    // ==============================
    const btnUnlock = document.getElementById('btnUnlock');
    const unlockWrapper = document.querySelector('.unlock-btn-wrapper');
    const unlockText = document.getElementById('unlockText');
    const unlockProgress = document.getElementById('unlockProgress');
    const unlockContainer = document.getElementById('unlockContainer');
    const ctaContainer = document.getElementById('ctaContainer');

    let unlockTimer = null;
    let progressInterval = null;
    let unlockDuration = 3000; // 3 detik
    let currentProgress = 0;
    let isUnlocked = false;

    const startUnlock = (e) => {
        if (isUnlocked) return;
        if (e.cancelable) e.preventDefault(); 
        
        unlockWrapper.classList.add('is-pressing');
        if(unlockText) unlockText.textContent = "Merasakan detak jantungmu...";
        
        if (navigator.vibrate) navigator.vibrate(50);
        
        currentProgress = 0;
        progressInterval = setInterval(() => {
            currentProgress += (100 / (unlockDuration / 50));
            if (currentProgress > 100) currentProgress = 100;
            if (unlockProgress) unlockProgress.style.width = `${currentProgress}%`;
            
            if (currentProgress % 33 < 2 && navigator.vibrate) {
                navigator.vibrate([30, 50, 30]);
            }
        }, 50);

        unlockTimer = setTimeout(() => {
            completeUnlock();
        }, unlockDuration);
    };

    const cancelUnlock = () => {
        if (isUnlocked) return;
        
        unlockWrapper.classList.remove('is-pressing');
        if(unlockText) unlockText.textContent = "Tahan Jarimu 3 Detik";
        
        clearTimeout(unlockTimer);
        clearInterval(progressInterval);
        
        if (unlockProgress) {
            unlockProgress.style.transition = "width 0.3s ease";
            unlockProgress.style.width = "0%";
            setTimeout(() => {
                unlockProgress.style.transition = "width 0.1s linear";
            }, 300);
        }
    };

    const completeUnlock = () => {
        isUnlocked = true;
        clearInterval(progressInterval);
        if(unlockProgress) unlockProgress.style.width = "100%";
        if(unlockText) unlockText.textContent = "Terbuka! ❤️";
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        setTimeout(() => {
            if(unlockContainer) unlockContainer.style.opacity = '0';
            setTimeout(() => {
                if(unlockContainer) unlockContainer.style.display = 'none';
                
                if (ctaContainer) {
                    ctaContainer.classList.remove('d-none');
                    setTimeout(() => {
                        ctaContainer.classList.remove('opacity-0');
                        if (window.stopAutoScroll) window.stopAutoScroll(); 
                    }, 50);
                }
            }, 500);
        }, 800);
    };

    if (btnUnlock) {
        btnUnlock.addEventListener('mousedown', startUnlock);
        btnUnlock.addEventListener('touchstart', startUnlock, {passive: false});
        
        window.addEventListener('mouseup', cancelUnlock);
        window.addEventListener('touchend', cancelUnlock);
        window.addEventListener('touchcancel', cancelUnlock);
    }
});

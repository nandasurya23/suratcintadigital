document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // AUTO SCROLL LOGIC
    // ==============================
    let autoScrollAnimationId;
    let isAutoScrolling = false;
    let lastScrollTime = 0;

    const autoScrollStep = (timestamp) => {
        if (!isAutoScrolling) return;
        
        if (!lastScrollTime) lastScrollTime = timestamp;
        const elapsed = timestamp - lastScrollTime;
        
        if (elapsed > 35) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
                window.stopAutoScroll();
                return;
            } else {
                window.scrollBy(0, 1);
                lastScrollTime = timestamp;
            }
        }
        autoScrollAnimationId = requestAnimationFrame(autoScrollStep);
    };

    window.startAutoScroll = () => {
        if (isAutoScrolling) return;
        isAutoScrolling = true;
        lastScrollTime = 0;
        autoScrollAnimationId = requestAnimationFrame(autoScrollStep);
    };

    window.stopAutoScroll = () => {
        if (isAutoScrolling) {
            cancelAnimationFrame(autoScrollAnimationId);
            isAutoScrolling = false;
        }
    };

    window.addEventListener('touchstart', window.stopAutoScroll, {passive: true});
    window.addEventListener('touchmove', window.stopAutoScroll, {passive: true});
    window.addEventListener('wheel', window.stopAutoScroll, {passive: true});
    window.addEventListener('mousedown', window.stopAutoScroll);

    // ==============================
    // OPENING BUTTON LOGIC
    // ==============================
    const btnOpenLetter = document.getElementById('btnOpenLetter');
    if (btnOpenLetter) {
        btnOpenLetter.addEventListener('click', () => {
            if (window.playMusic && !window.musicStarted) {
                window.playMusic();
            }

            const nextSection = document.getElementById('letter');
            if (nextSection) {
                let autoScrollScheduled = false;
                const targetPosition = nextSection.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                const checkScrollFinished = setInterval(() => {
                    if (Math.abs(window.scrollY - targetPosition) < 10 || (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
                        clearInterval(checkScrollFinished);
                        if (!autoScrollScheduled) {
                            autoScrollScheduled = true;
                            setTimeout(() => {
                                window.startAutoScroll();
                            }, 1500);
                        }
                    }
                }, 100);

                setTimeout(() => {
                    clearInterval(checkScrollFinished);
                    if (!autoScrollScheduled) {
                        autoScrollScheduled = true;
                        window.startAutoScroll();
                    }
                }, 2500);
            }
        });
    }

    // ==============================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==============================
    const revealOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    document.querySelectorAll('.reveal-scroll, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => {
        revealObserver.observe(el);
    });
});

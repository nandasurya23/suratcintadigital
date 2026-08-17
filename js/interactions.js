document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // 3D FLIP POLAROID
    // ==============================
    const secretPhoto = document.getElementById('secretPhoto');
    if (secretPhoto) {
        secretPhoto.addEventListener('click', function() {
            this.classList.toggle('is-flipped');
        });
    }

    // ==============================
    // INTERACTIVE HEARTS ON TAP/CLICK
    // ==============================
    document.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        heart.style.transform = 'translate(-50%, -50%) scale(0)';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.fontSize = '1.2rem';
        heart.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease';
        heart.style.opacity = '0.8';
        heart.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
        
        document.body.appendChild(heart);

        requestAnimationFrame(() => {
            heart.style.transform = 'translate(-50%, -100%) scale(1)';
        });

        setTimeout(() => {
            heart.style.opacity = '0';
            heart.style.transform = 'translate(-50%, -200%) scale(1.2)';
        }, 500);

        setTimeout(() => {
            heart.remove();
        }, 1300);
    });

    // ==============================
    // OPTIONAL PARTICLES
    // ==============================
    const particlesContainer = document.getElementById('particles');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && particlesContainer) {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 4 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            
            const duration = Math.random() * 10 + 15;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        };

        for(let i=0; i<8; i++) {
            setTimeout(createParticle, Math.random() * 5000);
        }
        setInterval(createParticle, 3000);
    }
});

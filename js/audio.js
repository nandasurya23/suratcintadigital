window.musicStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    const musicPlayer = document.getElementById('musicPlayer');
    const musicToggle = document.getElementById('musicToggle');
    const playPath = document.querySelector('.play-path');
    const pausePath = document.querySelector('.pause-path');
    
    let isMusicPlaying = false;

    window.playMusic = async () => {
        if(!bgMusic) return;
        try {
            bgMusic.volume = 0;
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                await playPromise;
                
                let vol = 0;
                const fadeInterval = setInterval(() => {
                    if (vol < 0.4) {
                        vol += 0.1;
                        bgMusic.volume = vol;
                    } else {
                        bgMusic.volume = 0.5;
                        clearInterval(fadeInterval);
                    }
                }, 100);

                isMusicPlaying = true;
                window.musicStarted = true;
                updateMusicIcon();
                if(musicPlayer) musicPlayer.classList.remove('hidden');
                if(musicToggle) musicToggle.classList.add('playing');
            }
        } catch (error) {
            console.warn("Autoplay or Audio file error. Website will continue to work normally.", error);
            if (!window.musicStarted && musicPlayer) {
                musicPlayer.classList.add('hidden');
            }
        }
    };

    const toggleMusic = () => {
        if(!bgMusic) return;
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.warn(e));
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
        }
        updateMusicIcon();
    };

    const updateMusicIcon = () => {
        if (isMusicPlaying) {
            if(playPath) playPath.classList.add('hidden');
            if(pausePath) pausePath.classList.remove('hidden');
        } else {
            if(playPath) playPath.classList.remove('hidden');
            if(pausePath) pausePath.classList.add('hidden');
        }
    };

    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);

    // Coba putar otomatis saat web dimuat
    // (Note: Browser modern mungkin memblokir ini sampai user melakukan interaksi/klik pertama)
    setTimeout(() => {
        if (!window.musicStarted && typeof window.playMusic === 'function') {
            window.playMusic();
        }
    }, 500);
});

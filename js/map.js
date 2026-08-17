document.addEventListener('DOMContentLoaded', () => {
    const mapSection = document.getElementById('mapSection');
    if (!mapSection) return;

    const mapContainer = document.getElementById('indonesiaMapContainer');
    const markerBali = document.getElementById('markerBali');
    const markerPalembang = document.getElementById('markerPalembang');
    const mapLine = document.getElementById('mapConnectionLine');
    const tooltip = document.getElementById('mapTooltip');
    const textSequence = document.querySelectorAll('.map-text-seq');

    let mapAnimated = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- FETCH REAL SVG MAP ---
    const loadRealMap = async () => {
        try {
            const response = await fetch('assets/indonesia-map-accurate.svg');
            if (!response.ok) throw new Error('Network response was not ok');
            const svgText = await response.text();
            
            // Parse SVG text
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(svgText, "text/xml");
            
            const group = xmlDoc.getElementById('realMapGroup');
            const targetGroup = document.getElementById('realMapGroup');
            if (group && targetGroup) {
                targetGroup.innerHTML = group.innerHTML;
            }
        } catch (error) {
            console.error("Gagal memuat peta asli:", error);
        }
    };

    // Load map in background
    loadRealMap();

    // --- ANIMATION SEQUENCE ---
    const runMapSequence = () => {
        // Step 1: Peta fade in
        if (mapContainer) {
            mapContainer.style.transition = 'opacity 1.5s ease';
            mapContainer.classList.remove('opacity-0');
        }

        // Step 2: Marker Bali muncul
        if (markerBali) {
            setTimeout(() => {
                markerBali.style.transition = 'opacity 1s ease';
                markerBali.classList.remove('opacity-0');
            }, 1000);
        }

        // Step 3: Marker Palembang muncul
        if (markerPalembang) {
            setTimeout(() => {
                markerPalembang.style.transition = 'opacity 1s ease';
                markerPalembang.classList.remove('opacity-0');
            }, 2500);
        }

        // Step 4: Gambar garis dan jalankan pesawat
        if (mapLine) {
            setTimeout(() => {
                mapLine.style.transition = 'opacity 0.5s ease';
                mapLine.classList.remove('opacity-0');
                
                // Trigger stroke animation via CSS class
                if (!prefersReducedMotion) {
                    mapLine.classList.add('animate');
                    
                    const flyingPlane = document.getElementById('flyingPlane');
                    const planeMotion = document.getElementById('planeMotion');
                    
                    if (flyingPlane && planeMotion) {
                        flyingPlane.classList.remove('opacity-0');
                        planeMotion.beginElement();
                        
                        // Hilangkan pesawat saat sampai tujuan (sesuai durasi animasi 2s)
                        setTimeout(() => {
                            flyingPlane.classList.add('opacity-0');
                        }, 2000);
                    }
                }
            }, 4000);
        }

        // Step 5: Teks bermunculan secara berurutan
        // Jeda waktu kemunculan setiap teks (dalam milidetik dari saat garis mulai digambar)
        const textDelays = [
            2000,  // Aku di Bali
            3500,  // Kamu di Palembang
            6000,  // ± 1.300 KM
            7500,  // Jauh kalau dihitung...
            10500, // Tapi dekat kalau...
            13500, // Kita mungkin...
            15500, // Tapi tetap ada...
            18000, // Di hati masing-masing
            20500, // Dan mungkin suatu hari...
            22500, // Aku harap garis...
            24500  // Tapi menjadi perjalanan...
        ];

        // Karena index dan jumlah teks mungkin tidak sama persis dengan delays (tergantung HTML),
        // kita loop sesuai panjang elemen yang ada.
        textSequence.forEach((el, index) => {
            if (index < textDelays.length) {
                setTimeout(() => {
                    el.style.transition = 'opacity 1.5s ease';
                    el.classList.remove('opacity-0');
                }, 4000 + textDelays[index]); // 4000ms offset (setelah animasi garis mulai)
            } else {
                // Fallback jika elemen teks lebih banyak dari array delay
                setTimeout(() => {
                    el.style.transition = 'opacity 1.5s ease';
                    el.classList.remove('opacity-0');
                }, 4000 + 26000 + (index * 1500));
            }
        });
    };

    // --- LAZY REVEAL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !mapAnimated) {
                mapAnimated = true;
                runMapSequence();
            }
        });
    }, { rootMargin: '0px 0px -200px 0px' });

    observer.observe(mapSection);

    // --- INTERACTIONS ---
    let tooltipTimeout;
    
    const showTooltip = (html) => {
        if (!tooltip) return;
        tooltip.innerHTML = html;
        tooltip.classList.remove('opacity-0', 'pointer-events-none');
        tooltip.classList.add('fade-in');
        
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltip.classList.remove('fade-in');
            tooltip.classList.add('opacity-0', 'pointer-events-none');
        }, 4000);
    };

    // Interact with Bali
    if (markerBali) {
        const baliHitbox = markerBali.querySelector('.interaction-area');
        if (baliHitbox) {
            baliHitbox.addEventListener('click', () => {
                showTooltip(`<b>📍 Bali</b><br><small>Tempat dimana aku berada.</small>`);
            });
            baliHitbox.addEventListener('touchstart', (e) => {
                e.preventDefault();
                showTooltip(`<b>📍 Bali</b><br><small>Tempat dimana aku berada.</small>`);
            }, {passive: false});
        }
    }

    // Interact with Palembang
    if (markerPalembang) {
        const plgHitbox = markerPalembang.querySelector('.interaction-area');
        if (plgHitbox) {
            plgHitbox.addEventListener('click', () => {
                showTooltip(`<b>📍 Palembang</b><br><small>Tempat dimana kamu berada.</small>`);
            });
            plgHitbox.addEventListener('touchstart', (e) => {
                e.preventDefault();
                showTooltip(`<b>📍 Palembang</b><br><small>Tempat dimana kamu berada.</small>`);
            }, {passive: false});
        }
    }

    // Interact with Line
    if (mapLine) {
        const interactLine = () => {
            showTooltip(`<b>Jauh kalau dihitung dalam kilometer.</b>`);
            setTimeout(() => {
                if (tooltip && tooltip.classList.contains('fade-in')) {
                    showTooltip(`<b>Tapi dekat kalau dihitung dari seberapa sering aku memikirkan kamu.</b>`);
                }
            }, 2000);
        };

        mapLine.addEventListener('click', interactLine);
        mapLine.addEventListener('touchstart', (e) => {
            e.preventDefault();
            interactLine();
        }, {passive: false});
        // Cursor style for line
        mapLine.style.cursor = 'pointer';
    }

});

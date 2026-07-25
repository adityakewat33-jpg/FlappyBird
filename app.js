document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initSpinWheel();
    initThemeSwitcher();
    initLeaderboard();
});

/* ==========================================================================
   MOBILE MENU LOGIC
   ========================================================================== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isVisible = mobileMenu.style.display === 'flex';
            mobileMenu.style.display = isVisible ? 'none' : 'flex';
            
            // Toggle icon visual
            if (isVisible) {
                mobileToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            } else {
                mobileToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            }
        });
        
        // Close menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link, .mobile-cta-btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
                mobileToggle.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            });
        });
    }
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    const cards = document.querySelectorAll('.glass-card, .section-header');
    
    // Add base class
    cards.forEach(card => {
        card.classList.add('reveal-on-scroll');
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
}

/* ==========================================================================
   DAILY LUCKY SPIN LOGIC
   ========================================================================== */
function initSpinWheel() {
    const spinBtn = document.getElementById('spin-btn');
    const wheel = document.getElementById('spin-wheel-element');
    const statusText = document.getElementById('spin-status-text');
    
    let isSpinning = false;
    let hasSpunToday = false;
    
    // Segment values matching index.html layout (8 segments)
    // Degrees: 360 / 8 = 45 deg per segment
    // Segment 1 (i=1): 45deg to 90deg, Segment value = 100
    // Segment 8 (i=8): 0deg to 45deg (offset), Segment value = 750
    // Index mapping (clockwise ordering starting from top)
    const rewards = [
        { label: "750 Coins!", minAngle: 0, maxAngle: 45 },
        { label: "1000 Coins! Jackpot!", minAngle: 45, maxAngle: 90 },
        { label: "150 Coins!", minAngle: 90, maxAngle: 135 },
        { label: "500 Coins!", minAngle: 135, maxAngle: 180 },
        { label: "50 Coins!", minAngle: 180, maxAngle: 225 },
        { label: "250 Coins!", minAngle: 225, maxAngle: 270 },
        { label: "100 Coins!", minAngle: 270, maxAngle: 315 },
        { label: "300 Coins!", minAngle: 315, maxAngle: 360 }
    ];

    if (spinBtn && wheel && statusText) {
        spinBtn.addEventListener('click', () => {
            if (isSpinning) return;
            
            if (hasSpunToday) {
                statusText.style.color = '#ff6b6b';
                statusText.textContent = "Only 1 Spin daily! Resetting in 24 hours...";
                setTimeout(() => {
                    statusText.style.color = 'var(--color-primary)';
                    statusText.textContent = "Okay, we'll let you spin again!";
                    hasSpunToday = false;
                }, 2000);
                return;
            }
            
            isSpinning = true;
            statusText.textContent = "Spinning...";
            
            // Random spin degrees (at least 5 full rotations + random offset)
            const rotations = 5 * 360;
            const randomOffset = Math.floor(Math.random() * 360);
            const totalDegrees = rotations + randomOffset;
            
            wheel.style.transform = `rotate(${totalDegrees}deg)`;
            
            // Calculate winning segment
            // The pointer is at the very top (270deg offset relative to standard coordinates)
            // Or more simply: (totalDegrees % 360) tells us where it stops relative to pointer
            // Pointer points at top, wheel spins clockwise. So target stop angle = (360 - (randomOffset)) % 360
            const pointerAngle = (360 - randomOffset) % 360;
            
            // Find matched reward
            let wonReward = rewards[0];
            for (let r of rewards) {
                if (pointerAngle >= r.minAngle && pointerAngle < r.maxAngle) {
                    wonReward = r;
                    break;
                }
            }
            
            // Wait for transition to complete (4s duration defined in CSS)
            setTimeout(() => {
                isSpinning = false;
                hasSpunToday = true;
                statusText.style.color = '#2ecc71';
                statusText.textContent = `🎉 You won ${wonReward.label}`;
                
                // Animate value pop
                statusText.classList.add('animate-scale-in');
                setTimeout(() => statusText.classList.remove('animate-scale-in'), 500);
            }, 4000);
        });
    }
}

/* ==========================================================================
   THEME SWITCHER LOGIC
   ========================================================================== */
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const screenBg = document.getElementById('theme-screen-bg');
    const mockThemeName = document.getElementById('mock-theme-name');
    const mockBird = document.getElementById('mock-bird-element');
    const pipeT = document.getElementById('pipe-t');
    const pipeB = document.getElementById('pipe-b');
    
    themeButtons.forEach(btn => {
        // Set CSS variables dynamic hover
        const color = btn.getAttribute('data-color');
        btn.style.setProperty('--btn-color', color + '40');
        
        btn.addEventListener('click', () => {
            // Remove active classes
            themeButtons.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');
            
            // Extract data attributes
            const themeNameText = btn.textContent;
            const bgValue = btn.getAttribute('data-bg');
            const birdColor = btn.getAttribute('data-bird');
            const pipeColor = btn.getAttribute('data-pipcolor');
            
            // Apply transitions on screen mockup
            if (screenBg && mockThemeName && mockBird && pipeT && pipeB) {
                screenBg.style.background = bgValue;
                mockThemeName.textContent = themeNameText;
                mockBird.style.backgroundColor = birdColor;
                pipeT.style.backgroundColor = pipeColor;
                pipeB.style.backgroundColor = pipeColor;
                
                // Add quick animations to bird and pipes for feedback
                mockBird.style.transform = 'translateY(-15px) scale(1.15)';
                setTimeout(() => {
                    mockBird.style.transform = 'translateY(0) scale(1)';
                }, 300);
            }
        });
    });
}

/* ==========================================================================
   LEADERBOARD MOCK DATA LOGIC
   ========================================================================== */
function initLeaderboard() {
    const tabButtons = document.querySelectorAll('.lead-tab');
    const rowsContainer = document.getElementById('leaderboard-rows-container');
    
    const leaderboardData = {
        global: [
            { rank: 1, name: "FlappyGod👑", score: 9942, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" },
            { rank: 2, name: "SkyDiver_99", score: 8530, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80" },
            { rank: 3, name: "FeatherKing", score: 7210, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" },
            { rank: 4, name: "CoinMagnet", score: 6842, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" },
            { rank: 5, name: "PixelFlap", score: 5930, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" }
        ],
        weekly: [
            { rank: 1, name: "WeeklyFlapper", score: 2840, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" },
            { rank: 2, name: "FeatherKing", score: 2450, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" },
            { rank: 3, name: "SlomoSpeed", score: 1980, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" },
            { rank: 4, name: "FlappyGod👑", score: 1870, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" },
            { rank: 5, name: "TurboWing", score: 1620, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80" }
        ]
    };

    function renderLeaderboard(tabKey) {
        if (!rowsContainer) return;
        
        rowsContainer.innerHTML = '';
        const list = leaderboardData[tabKey];
        
        list.forEach(item => {
            const isTop3 = item.rank <= 3;
            const rankClass = isTop3 ? `rank-num rank-${item.rank}` : 'rank-num';
            const rowClass = isTop3 ? 'leaderboard-row top-rank' : 'leaderboard-row';
            
            let badge = '';
            if (item.rank === 1) badge = '🥇';
            else if (item.rank === 2) badge = '🥈';
            else if (item.rank === 3) badge = '🥉';
            
            const rowHtml = `
                <div class="${rowClass}">
                    <div class="row-left">
                        <span class="${rankClass}">${item.rank}</span>
                        <img class="player-avatar" src="${item.avatar}" alt="${item.name}'s Avatar">
                        <span class="player-name">${item.name}</span>
                    </div>
                    <div class="row-right">
                        <span class="player-score">${item.score.toLocaleString()}</span>
                        <span class="score-label">${badge} pts</span>
                    </div>
                </div>
            `;
            rowsContainer.insertAdjacentHTML('beforeend', rowHtml);
        });
    }

    // Set Initial
    renderLeaderboard('global');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabKey = btn.getAttribute('data-tab');
            renderLeaderboard(tabKey);
        });
    });
}

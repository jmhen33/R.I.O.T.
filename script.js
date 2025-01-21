document.addEventListener('DOMContentLoaded', () => {
    initWebsite();
    setupNavbarScrollEffect();
    setupNavbarToggle();
    setupSmoothScrolling();
});

async function initWebsite() {
    try {
        await Promise.all([loadClanStats(), loadLeaderboard()]);
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

// Fetch and display leaderboard
async function loadLeaderboard() {
    try {
        const response = await fetch('/api/members');
        const members = await response.json();
        const leaderboardList = document.getElementById('leaderboard-list');

        leaderboardList.innerHTML = members
            .slice(0, 5)
            .map(
                (member, index) => `
                    <li>
                        <strong>#${index + 1} ${member.name}</strong>
                        <span>TH: ${member.townHallLevel} | Trophies: ${member.trophies}</span>
                    </li>`
            )
            .join('');
    } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
    }
}

// Change navbar background on scroll
function setupNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Toggle mobile menu
function setupNavbarToggle() {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    toggle.addEventListener('click', () => {
        menu.classList.toggle('show');
    });
}

// Smooth scrolling to sections
function setupSmoothScrolling() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            gsap.to(window, {
                duration: 1.5,
                scrollTo: target,
                ease: 'power2.out',
            });

            // Close mobile menu after click
            const menu = document.querySelector('.navbar-menu');
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
            }
        });
    });
}

// Updated script.js

document.addEventListener('DOMContentLoaded', () => {
    initWebsite();
    setupParallaxEffect();
    animateHeroContent();
});

function setupParallaxEffect() {
    const heroEmblem = document.getElementById('hero-emblem');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Move emblem at slower speed than scroll
        heroEmblem.style.transform = `translateY(${scrollY * 0.3}px)`;
    });
}

function animateHeroContent() {
    const title = document.getElementById('hero-title');
    const description = document.getElementById('hero-description');
    const button = document.getElementById('cta-button');

    gsap.fromTo(
        title,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }
    );
    gsap.fromTo(
        description,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'power2.out' }
    );
    gsap.fromTo(
        button,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, delay: 1, ease: 'elastic.out(1, 0.5)' }
    );
}

async function loadClanStats() {
    const clanStats = {
        level: document.getElementById('clan-level'),
        donations: document.getElementById('total-donations'),
        members: document.getElementById('members'),
        warLeague: document.getElementById('war-league'),
    };

    try {
        const response = await fetch('/api/clan');
        const data = await response.json();

        // Update stats dynamically
        clanStats.level.textContent = data.clanLevel;
        clanStats.donations.textContent = data.clanPoints || '0';
        clanStats.members.textContent = data.members || '0';
        clanStats.warLeague.textContent = data.warWins || 'Unknown';

        setupCounterAnimation();
    } catch (error) {
        console.error('Failed to load clan stats:', error);
    }
}

function setupCounterAnimation() {
    document.querySelectorAll('.stat-item h3').forEach((counter) => {
        const target = +counter.textContent;
        counter.textContent = '0';

        let count = 0;
        const increment = Math.ceil(target / 100);

        const updateCounter = () => {
            count += increment;
            if (count < target) {
                counter.textContent = count;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadClanStats();
});

// Smooth fade-up animation for stat items
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    const statItems = document.querySelectorAll('.stat-item');

    // GSAP Animation
    gsap.from(statItems, {
        y: 50, // Slide in from 50px below
        opacity: 0, // Start fully transparent
        duration: 1.2, // Animation duration
        stagger: 0.3, // Delay between animations for each item
        ease: 'power3.out', // Smooth easing effect
        scrollTrigger: {
            trigger: '.clan-stats', // Start animation when '.clan-stats' enters viewport
            start: 'top 75%', // Trigger when top of section reaches 75% of viewport
            toggleActions: 'play none none reverse', // Play animation when scrolling down, reverse when scrolling up
        },
    });
});

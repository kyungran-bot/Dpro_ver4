document.addEventListener('DOMContentLoaded', () => {
    const hoverArea = document.getElementById('hover-area');
    const bgVideo = document.getElementById('bg-video');
    const hoverImg = document.getElementById('hover-img');

    // Ensure the video plays smoothly without interaction
    bgVideo.muted = true;
    bgVideo.setAttribute('muted', '');
    bgVideo.setAttribute('playsinline', '');
    bgVideo.autoplay = true;

    const startVideo = () => {
        bgVideo.muted = true;
        bgVideo.play().catch(error => {
            console.log("Autoplay waiting for interaction...", error);
        });
    };

    // Attempt to start immediately
    startVideo();

    // Secondary triggers
    bgVideo.addEventListener('loadedmetadata', startVideo);
    bgVideo.addEventListener('canplay', startVideo);

    // Final safety net: start on any interaction
    const interactionEvents = ['mousedown', 'touchstart', 'mousemove', 'keydown', 'wheel'];
    interactionEvents.forEach(event => {
        window.addEventListener(event, () => {
            if (bgVideo.paused) {
                bgVideo.play().catch(() => { });
            }
        }, { once: true, passive: true });
    });




    // We can add more complex JS logic here if needed, 
    // but the hover effect is handled elegantly by CSS for performance.

    let hasInteracted_7 = false;
    let isTOCVisible = false;

    const hoverImgM = document.querySelector('.center-hover-img-m');

    // Optional: Log interactions
    hoverArea.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1080) {
            if (typeof isTOCVisible !== 'undefined' && isTOCVisible) return;
            console.log('User hovered over the center area.');
            hasInteracted_7 = true;
        }
    });

    hoverArea.addEventListener('mouseleave', () => {
        if (window.innerWidth > 1080) {
            console.log('User left the center area.');
        }
    });

    // Mobile touch interaction
    hoverArea.addEventListener('click', (e) => {
        if (window.innerWidth <= 1080) {

            if (typeof isTOCVisible !== 'undefined' && isTOCVisible) return;

            const isCurrentlyVisible = hoverImgM && hoverImgM.style.display === "block";
            if (hoverImgM) {
                hoverImgM.style.display = isCurrentlyVisible ? "none" : "block";
            }
        }
    });

    // Hide mobile hover image if clicking anywhere else
    window.addEventListener('click', (e) => {
        if (window.innerWidth <= 1080 && hoverImgM) {
            if (hoverArea && hoverArea.contains(e.target)) return;
            hoverImgM.style.display = "none";
        }
    });

    // Handling window resize if needed (CSS object-fit handles most cases)
    window.addEventListener('resize', () => {
        // Any custom resize logic
    });
});

// Next Screen Logic
const nextScreen = document.getElementById('next-screen');

function showNextScreen() {
    if (nextScreen) {
        isTOCVisible = true;
        const videoBg = document.querySelector('.video-background');
        if (videoBg) videoBg.style.display = 'none';
        const hoverCont = document.querySelector('.hover-container');
        if (hoverCont) hoverCont.style.display = 'none';

        nextScreen.style.display = 'flex';
        setTimeout(() => {
            nextScreen.classList.add('active');
        }, 10);
    }
}

function showHomeScreen() {
    if (nextScreen) {
        nextScreen.classList.remove('active');
        setTimeout(() => {
            nextScreen.style.display = 'none';
        }, 500);
    }
}

// Double-click to Transition to Next Screen
window.addEventListener('dblclick', () => {
    showNextScreen();
});

// Home button listener
const homeBtn = document.querySelector(".home-button");
if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {

        redirectToRandomHome();
    });
}

function redirectToRandomHome() {
    const homes = [
        "Home_1.html",
        "Home_2/Home_2.html",
        "Home_3/Home_3.html",
        "Home_4/Home_4.html",
        "Home_5/index.html",
        "Home_6/index.html",
        "Home_7/index.html"
    ];
    const currentPath = window.location.pathname;
    const availableHomes = homes.filter(home => !currentPath.endsWith(home));
    const randomHome = availableHomes[Math.floor(Math.random() * availableHomes.length)];
    // Home_7 is in a subfolder, so paths need to go up one level
    window.location.href = '../' + randomHome;
}

/* Custom Cursor JS - Home Screen Version */
(function () {
    if (document.querySelector('.custom-cursor')) return;
    const container = document.createElement('div');
    container.className = 'custom-cursor';

    const circle = document.createElement('div');
    circle.className = 'cursor-circle';

    const text = document.createElement('span');
    text.className = 'cursor-text';
    text.innerText = window.innerWidth <= 1080 ? 'Double Tab!' : 'Double click!';

    container.appendChild(circle);
    container.appendChild(text);
    document.body.appendChild(container);

    window.addEventListener('mousemove', (e) => {
        container.style.left = e.clientX + 'px';
        container.style.top = e.clientY + 'px';
    });

    // Observer to handle cases where CSS sibling selector might fail
    const nextScreen = document.getElementById('next-screen');
    if (nextScreen) {
        const observer = new MutationObserver(() => {
            const isVisible = nextScreen.classList.contains('active') || nextScreen.style.display === 'flex';
            if (isVisible) {
                text.style.display = 'none';
            } else {
                text.style.display = 'inline';
            }
        });
        observer.observe(nextScreen, { attributes: true, attributeFilter: ['class', 'style'] });
    }
})();

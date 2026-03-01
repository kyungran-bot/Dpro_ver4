const ap1 = document.getElementById('ap_1');
const ap2 = document.getElementById('ap_2');
const apMove3 = document.getElementById('apmove_3');
const bar = document.getElementById('ap_bar');

let isSpaceActive = false; // (On/Off)
let isTOCVisible = false;


let hasInteracted_4 = false;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        hasInteracted_4 = true;

        isSpaceActive = !isSpaceActive;

        bar.classList.toggle('paused');

        if (isSpaceActive) {
            ap2.classList.add('active-bg');
            ap1.classList.remove('active-bg');
            apMove3.classList.add('show-element');
        } else {
            ap2.classList.remove('active-bg');
            ap1.classList.add('active-bg');
            apMove3.classList.remove('show-element');
        }
    }
});

let isDragging = false;
let startX = 0;
let initialLefts = [];

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    hasInteracted_4 = true;
    startX = e.clientX;

    const groupElements = document.querySelectorAll('.draggable-group');
    initialLefts = [];
    groupElements.forEach(el => {
        const currentLeft = parseInt(window.getComputedStyle(el).left) || 0;
        initialLefts.push(currentLeft);
    });

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const groupElements = document.querySelectorAll('.draggable-group');

    groupElements.forEach((el, index) => {
        el.style.left = (initialLefts[index] + deltaX) + 'px';
    });
}

function stopDrag() {
    isDragging = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
}

// --- 다음 화면 (목차) 전환 로직 ---
const nextScreen = document.getElementById('next-screen');

function showNextScreen() {
    if (nextScreen) {
        isTOCVisible = true;
        document.querySelector('.container').style.display = 'none';
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
    // Home_4 is in a subfolder, so paths need to go up one level
    window.location.href = '../' + randomHome;
}

// 더블클릭 이벤트 리스너
window.addEventListener('dblclick', (e) => {
    showNextScreen();
});

// 기타 버튼/호버 리스너
document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.querySelector(".home-button");
    if (homeBtn) {
        homeBtn.addEventListener("click", (e) => {

            redirectToRandomHome();
        });
    }

    const hoverTrigger = document.querySelector('.hover-trigger');
    const hoverImgM = document.querySelector('.center-hover-img-m');

    if (hoverTrigger) {
        hoverTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 1080) {

                if (typeof isTOCVisible !== 'undefined' && isTOCVisible) return;

                const isCurrentlyVisible = hoverImgM && hoverImgM.style.display === "block";
                if (hoverImgM) {
                    hoverImgM.style.display = isCurrentlyVisible ? "none" : "block";
                }
            }
        });
    }

    // Hide mobile hover image if clicking anywhere else
    window.addEventListener('click', (e) => {
        if (window.innerWidth <= 1080 && hoverImgM) {
            if (hoverTrigger && hoverTrigger.contains(e.target)) return;
            hoverImgM.style.display = "none";
        }
    });

    if (hoverTrigger) {
        hoverTrigger.addEventListener('mouseleave', () => {

        });
    }
});

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

const scene1 = document.getElementById('scene-1');
const scene2 = document.getElementById('scene-2');
const camBack = document.getElementById('cam_back');


let targetX = 0;
let targetY = 0;
let targetScale = 1.1;


let currentX = 0;
let currentY = 0;
let currentScale = 1.1;

// 부드러움 정도 
// 숫자가 작을수록 더 미끄럽고 느리게 따라옴 (0.05 추천)
const ease = 0.05;
let isTOCVisible = false;


function goToScene2() {
    scene1.classList.add('zoom-out-effect');
    setTimeout(() => {
        scene1.classList.remove('active-scene');
        scene1.classList.remove('zoom-out-effect');
        scene2.classList.add('active-scene');
    }, 500);
}

function goToScene1() {
    scene2.classList.add('zoom-out-effect');
    setTimeout(() => {
        scene2.classList.remove('active-scene');
        scene2.classList.remove('zoom-out-effect');
        scene1.classList.add('active-scene');
    }, 500);
}



document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;


    targetX = (e.clientX - centerX) / 1.5;
    targetY = (e.clientY - centerY) / 1.5;
});


document.addEventListener('wheel', (e) => {
    if (!scene2.classList.contains('active-scene')) return;

    const zoomSpeed = 0.001;
    targetScale += e.deltaY * -zoomSpeed;


    targetScale = Math.min(Math.max(1.0, targetScale), 2.5);
});


function animate() {


    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    currentScale += (targetScale - currentScale) * ease;


    const x = currentX.toFixed(3);
    const y = currentY.toFixed(3);
    const s = currentScale.toFixed(3);


    camBack.style.transform = `translate(${-x}px, ${-y}px) scale(${s})`;


    requestAnimationFrame(animate);
}

// 애니메이션 시작
animate();

let hasInteracted_3 = false;

function toggleScene() {
    hasInteracted_3 = true;
    if (scene1.classList.contains('active-scene')) {
        goToScene2();
    } else {
        goToScene1();
    }
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
    // Home_3 is in a subfolder, so paths need to go up one level
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
            } else {
                // Desktop click = toggle scene
                toggleScene();
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

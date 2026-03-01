// --- 변수 설정 ---
const boxContainer = document.getElementById('box-container');
const clickTrigger = document.getElementById('click-trigger');
const px1 = document.getElementById('px_1');
const px2 = document.getElementById('px_2');
const pxText = document.getElementById('px_text');
const pxHover = document.getElementById('px_hover');
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const mainContainer = document.getElementById('main-container');

// [설정] 펜툴 시작 위치
const START_X_RATIO = 0.5;
const START_Y_RATIO = 0.5;

// [설정] 최대 클릭 횟수
const MAX_CLICKS = 20;

// 상태 변수
let isAnimating = false;
let isDrawingMode = false;
let clickCount = 0;
let points = [];
let mouseX = 0;
let mouseY = 0;
let isTOCVisible = false;

// --- 1. 초기화: 박스 이미지 생성 ---
for (let i = 1; i <= 47; i++) {
    const img = document.createElement('img');
    img.src = `./Homeasset_2/box_${i}.png`;
    img.className = 'box-img';
    img.id = `box_${i}`;
    boxContainer.appendChild(img);
}
const allBoxes = document.querySelectorAll('.box-img');


// --- 2. 캔버스 사이즈 세팅 ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (isDrawingMode) draw();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


let isMobileHoverShown_2 = false;

// --- 3. Phase 1: 박스 애니메이션 시작 ---
function startBoxAnimation() {
    if (isAnimating || isDrawingMode) return;

    // [추가] 모바일 대응: 이미 호버 이미지가 떠 있는 상태가 아니면 호버 이미지만 띄웁니다.
    if (window.innerWidth <= 1080) {
        const hoverImgM = document.querySelector('.center-hover-img-m');
        if (hoverImgM && !isMobileHoverShown_2) {
            hoverImgM.style.display = "block";
            isMobileHoverShown_2 = true;
            return; // 첫 터치 시에는 호버 이미지만 띄우고 종료
        }
    }

    isAnimating = true;
    hasInteracted_2 = true;

    // [수정] 데스크탑에서는 호버 이미지를 고정하고, 모바일에서는 호버 이미지의 z-index를 낮춰 박스가 보이게 합니다.
    if (window.innerWidth > 1080) {
        pxHover.style.opacity = '1';
    } else {
        const hoverImgM = document.querySelector('.center-hover-img-m');
        if (hoverImgM) {
            hoverImgM.style.display = 'block';
            hoverImgM.style.zIndex = '5'; // 박스(10)보다 아래로 내려서 애니메이션이 보이게 함
            isMobileHoverShown_2 = false; // 진행 중에는 플래그 리셋 (필요시)
        }
    }

    // 클릭 트리거 제거 (중복 클릭 방지)
    clickTrigger.style.display = 'none';

    // **중요: 여기서 텍스트를 숨기는 코드를 삭제했습니다.**
    // 이제 박스가 다 덮을 때까지 텍스트/호버이미지가 뒤에 남아있습니다.

    let currentBox = 1;

    const interval = setInterval(() => {
        if (currentBox > 47) {
            clearInterval(interval);
            setTimeout(() => {
                startDrawingMode();
            }, 2000);
            return;
        }

        const box = document.getElementById(`box_${currentBox}`);
        if (box) box.classList.add('box-visible');

        currentBox++;
    }, 50);
}


// --- 4. Phase 2: 그리기 모드 전환 ---
function startDrawingMode() {
    isAnimating = false;
    isDrawingMode = true;

    // 1. 배경 교체
    px1.classList.remove('active-bg');
    px2.classList.add('active-bg');

    // 2. [수정됨] 이제서야 텍스트와 호버 이미지를 숨깁니다.
    pxText.style.opacity = '0';
    pxHover.style.opacity = '0';
    const hoverImgM = document.querySelector('.center-hover-img-m');
    if (hoverImgM) hoverImgM.style.display = 'none';

    // 박스 컨테이너 숨김
    boxContainer.style.display = 'none';

    // 3. 캔버스 활성화
    canvas.classList.add('canvas-active');

    // 4. 시작점 등록
    points = [{ x: START_X_RATIO, y: START_Y_RATIO }];

    requestAnimationFrame(drawLoop);
}


// --- 5. 펜툴 로직 ---
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawingMode) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener('click', (e) => {
    if (!isDrawingMode) return;

    const ratioX = e.clientX / canvas.width;
    const ratioY = e.clientY / canvas.height;

    points.push({ x: ratioX, y: ratioY });
    clickCount++;

    if (clickCount >= MAX_CLICKS) {
        resetPage();
    }
});

function drawLoop() {
    if (!isDrawingMode) return;
    draw();
    requestAnimationFrame(drawLoop);
}

function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1AC677'; // 선 색상 변경
    ctx.fillStyle = '#1AC677';   // 점(채우기) 색상 변경

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (points.length === 0) return;

    if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x * w, points[0].y * h);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x * w, points[i].y * h);
        }
        ctx.stroke();
    }

    for (let i = 0; i < points.length; i++) {
        const px = points[i].x * w;
        const py = points[i].y * h;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.moveTo(lastPoint.x * w, lastPoint.y * h);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
}


// --- 6. 리셋 함수 ---
function resetPage() {
    isDrawingMode = false;
    canvas.classList.remove('canvas-active');
    mainContainer.classList.add('fading-out');

    setTimeout(() => {
        // 배경 복구
        px1.classList.add('active-bg');
        px2.classList.remove('active-bg');

        // 텍스트 & 호버 이미지 스타일 초기화 (CSS 호버가 다시 작동하도록)
        pxText.style.opacity = '';
        pxHover.style.opacity = '';
        const hoverImgM = document.querySelector('.center-hover-img-m');
        if (hoverImgM) {
            hoverImgM.style.display = 'none';
            hoverImgM.style.zIndex = ''; // z-index 초기화
        }

        boxContainer.style.display = 'block';
        allBoxes.forEach(box => box.classList.remove('box-visible'));

        // 변수 초기화
        clickCount = 0;
        points = [];

        // 트리거 다시 활성화
        clickTrigger.style.display = 'block';

        mainContainer.classList.remove('fading-out');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }, 1000);
}

// --- 7. 다음 화면 (목차) 전환 로직 ---
const nextScreen = document.getElementById('next-screen');

function showNextScreen() {
    if (nextScreen) {
        isTOCVisible = true;
        nextScreen.style.display = 'flex';
        setTimeout(() => {
            nextScreen.classList.add('active');
        }, 10);
        mainContainer.style.display = 'none';
    }
}

function showHomeScreen() {
    if (nextScreen) {
        nextScreen.classList.remove('active');
        setTimeout(() => {
            nextScreen.style.display = 'none';
            mainContainer.style.display = 'block';
        }, 500);
    }
}

// 더블클릭 이벤트 리스너
window.addEventListener('dblclick', (e) => {
    showNextScreen();
});

let hasInteracted_2 = false;

// 호버 및 애니메이션 트리거
if (clickTrigger) {
    clickTrigger.addEventListener('click', (e) => {
        // TOC가 보일 때는 트리거 무시
        if (typeof isTOCVisible !== 'undefined' && isTOCVisible) return;
        startBoxAnimation();
    });

    // 모바일에서 영역 외 클릭 시 호버 이미지 숨김
    window.addEventListener('click', (e) => {
        if (window.innerWidth <= 1080) {
            const hoverImgM = document.querySelector('.center-hover-img-m');
            if (hoverImgM && !clickTrigger.contains(e.target)) {
                hoverImgM.style.display = "none";
                isMobileHoverShown_2 = false;
            }
        }
    });
}

// Home 버튼 리스너
document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.querySelector(".home-button");
    if (homeBtn) {
        homeBtn.addEventListener("click", (e) => {

            redirectToRandomHome();
        });
    }
});

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
    // Home_2 is in a subfolder, so paths need to go up one level
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

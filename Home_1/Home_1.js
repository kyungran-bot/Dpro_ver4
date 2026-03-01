const bookGroups = [
    [1, 2],           // 1단계
    [3, 4],           // 2단계
    [5, 6, 7],        // 3단계
    [8, 9, 10],       // 4단계
    [11],             // 5단계
    [12, 13]          // 6단계
];

let currentStep = 0;
let isResetting = false;
let isTOCVisible = false;

function dropNextGroup() {

    if (isResetting) return;


    if (currentStep >= bookGroups.length) {

        resetAllBooks();
        return;
    }


    const currentGroupIds = bookGroups[currentStep];

    currentGroupIds.forEach((bookNum, index) => {
        const bookElement = document.getElementById(`book_${bookNum}`);
        if (bookElement) {
            setTimeout(() => {
                bookElement.classList.add('dropped');
            }, index * 100);
        }
    });

    currentStep++;
}


function resetAllBooks() {
    isResetting = true;

    const allBooks = document.querySelectorAll('.falling-book');


    allBooks.forEach((book, index) => {

        setTimeout(() => {
            book.classList.add('reset');
            book.classList.remove('dropped');
        }, index * 50);
    });


    setTimeout(() => {
        allBooks.forEach(book => {

            book.classList.remove('reset');



        });

        // 
        currentStep = 0;
        isResetting = false;
    }, 1200); // 1.2초 뒤에 리셋 완료
}
// hover-trigger 영역을 벗어날 때 Home_5로 이동
document.addEventListener('DOMContentLoaded', () => {
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

    // Double-click to Transition to Next Screen
    const interactionContainer = document.querySelector('.interaction-container');
    const nextScreen = document.getElementById('next-screen');

    if (nextScreen) {
        window.addEventListener('dblclick', () => {
            isTOCVisible = true;
            if (interactionContainer) {
                interactionContainer.classList.add('hidden');

                setTimeout(() => {
                    interactionContainer.style.display = 'none';
                    nextScreen.style.display = 'flex';
                    // Trigger fade in
                    setTimeout(() => {
                        nextScreen.classList.add('active');
                    }, 50);
                }, 800);
            } else {
                nextScreen.style.display = 'flex';
                setTimeout(() => {
                    nextScreen.classList.add('active');
                }, 10);
            }
        });
    }

    // Add listener for Home button
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
    // Home_1 is the root, so paths are direct
    window.location.href = './' + randomHome;
}

function showHomeScreen() {
    const interactionContainer = document.querySelector('.interaction-container');
    const nextScreen = document.getElementById('next-screen');

    if (interactionContainer && nextScreen) {
        nextScreen.classList.remove('active');

        setTimeout(() => {
            nextScreen.style.display = 'none';
            interactionContainer.style.display = 'block';
            // Trigger fade in
            setTimeout(() => {
                interactionContainer.classList.remove('hidden');
            }, 50);
        }, 800);
    }
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

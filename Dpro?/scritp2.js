// 페이지 로드 시 부드럽게 나타나게 하기
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.text-section, .image-gallery, .credits, .slashes');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
});

/* Custom Cursor JS */
(function() {
    if (document.querySelector('.custom-cursor')) return;
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
})();

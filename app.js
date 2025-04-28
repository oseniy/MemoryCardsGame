function switchScreen(nextScreen) {
    const current = document.querySelector('.active');
    const next = document.querySelector(`[data-screen="${nextScreen}"]`);

    current.classList.add('slide-out');
    current.addEventListener('animationend', () => {
        current.classList.remove('active', 'slide-out');
        next.classList.add('active', 'slide-in');

        next.addEventListener('animationend', () => {
            next.classList.remove('slide-in');
        }, { once: true });
    }, { once: true });
}

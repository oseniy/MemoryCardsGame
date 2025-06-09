export default function switchScreen(nextScreen) {

    const current = document.querySelector('.screen.active');
    const next = document.getElementById(`${nextScreen}`);

    current.classList.add('slide-out');
    current.addEventListener('animationend', () => {
        current.classList.remove('active', 'slide-out');
        next.classList.add('active', 'slide-in');

        next.addEventListener('animationend', () => {
            next.classList.remove('slide-in');
        }, { once: true });
    }, { once: true });
}
const loadingText = document.getElementById('loadingTextJS');
const animator = createDotsAnimator(loadingText)

function createDotsAnimator(loadingText) {
    const frames = ['.', '..', '...'];
    let index = 0;
    let intervalId = null;

    function start() {
        if (intervalId !== null) return;
        intervalId = setInterval(() => {
        loadingText.innerText = frames[index];
        index = (index + 1) % frames.length;
        }, 250)    
    }

    function stop() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    return {start, stop};
}

export function startLoading() { 
    const screen = document.querySelector('.screen.active');
    screen.classList.add('transparent');
    animator.start();
    loadingText.classList.replace('text-overlay-hidden', 'text-overlay-active');
}

export function endLoading() {
    const screen = document.querySelector('.screen.active');
    screen.classList.remove('transparent');
    animator.stop();
    loadingText.classList.replace('text-overlay-active', 'text-overlay-hidden');
}
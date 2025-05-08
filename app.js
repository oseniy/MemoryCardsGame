
// анимация смены экрана
function switchScreen(nextScreen) {
    const current = document.querySelector('.active');
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



// игра
const cardsContainer = document.querySelector('.cards');
let HPsLeft;
let cardValues = [];
let totalPairs;

function startLevel(difficulty) {
    if (difficulty === 'easy') {HPsLeft = 12; totalPairs = 6};
    if (difficulty === 'normal') {HPsLeft = 12; totalPairs = 6};
    if (difficulty === 'hard') {HPsLeft = 12; totalPairs = 6};

    document.getElementById('moves-counter').textContent = `Жизней: ${HPsLeft}`;

    // Прочистка поля и перемешивание карточек
    resetCards(); 
    setupCardEvents();
    switchScreen(difficulty);
}

function resetCards() {

    if (cardsContainer.classList.contains('cards-transparent')) {
        cardsContainer.classList.remove('cards-transparent')
        const textLvlEnded = document.querySelector('.text-lvl-ended-active')
        textLvlEnded.classList.remove('text-lvl-ended-active')
        const LevelBtn = document.querySelector('.level-btn.active')
        LevelBtn.classList.remove('active') 
    }

    cardsContainer.innerHTML = '';

    const values = [];
    for (let i = 1; i <= totalPairs; i++) {
        values.push(i);
        values.push(i);
    }

    cardValues = shuffleArray(values);

    cardValues.forEach(value => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.dataset.value = value
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${value}</div>
            </div>
        `
        cardsContainer.appendChild(card)
    })
}

function setupCardEvents() {
    const cards = document.querySelectorAll('.card');
    let flipped = [];
    let lock = false;
    pairsFound = 0;
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (lock || card.classList.contains('flipped')) return;

            card.classList.add('flipped');
            flipped.push(card);

            if (flipped.length === 2) {
                lock = true;
                const [a, b] = flipped;
                if (a.dataset.value === b.dataset.value) {
                    flipped = [];
                    lock = false;
                    pairsFound += 1;
                    if (pairsFound == totalPairs) victory();
                } else {
                    setTimeout(() => {
                        a.classList.remove('flipped');
                        b.classList.remove('flipped');
                        flipped = [];
                        lock = false;
                        doDamage()
                        if (HPsLeft == 0) defeat();
                    }, 1000);
                }
            }
        });
    });
}

function victory() {
    const nextLevel = document.getElementById('nextLevelJS');
    nextLevel.classList.add('slide-in');
    nextLevel.classList.add('active');
    nextLevel.addEventListener('animationend', () => {
        nextLevel.classList.remove('slide-in');
    })

    cardsContainer.classList.add('cards-transparent')

    const textVictory = document.getElementById('textVictoryJS')
    textVictory.classList.add('text-lvl-ended-active')
}

function defeat() {
    const tryAgain = document.getElementById('tryAgainJS');
    tryAgain.classList.add('slide-in');
    tryAgain.classList.add('active');
    tryAgain.addEventListener('animationend', () => {
        tryAgain.classList.remove('slide-in');
    })

    cardsContainer.classList.add('cards-transparent')

    const textDefeat = document.getElementById('textDefeatJS')
    textDefeat.classList.add('text-lvl-ended-active')
}

function doDamage() {
    HPsLeft -= 1;
    document.getElementById('moves-counter').textContent = `Жизней: ${HPsLeft}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
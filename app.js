const cardsContainer = document.querySelector('.cards');
const movesCounter =  document.getElementById('movesCounterJS')
const nextLevelBtn = document.getElementById('nextLevelBtnJS');
const tryAgainBtn = document.getElementById('tryAgainBtnJS');
const textVictory = document.getElementById('textVictoryJS')
const textDefeat = document.getElementById('textDefeatJS')

let HPsLeft;
let cardValues = [];
let totalPairs;
let textDifficulty = ''
let nextLevel = ''
let difficulty = ''

function startLevel(difficultyLocal) {
    difficulty = difficultyLocal
    console.log(difficulty)
    if (difficulty === 'easy') {HPsLeft = 12; totalPairs = 6; textDifficulty = 'Лёгкий'; nextLevel = 'normal'};
    if (difficulty === 'normal') {HPsLeft =18; totalPairs = 9; textDifficulty = 'Средний'; nextLevel = 'hard'};
    if (difficulty === 'hard') {HPsLeft = 24; totalPairs = 12; textDifficulty = 'Сложный'};

    movesCounter.textContent = `Жизней: ${HPsLeft}`;
    document.getElementById('difficultyJS').textContent = `${textDifficulty}`;

    // Прочистка поля и перемешивание карточек
    resetCards(); 
    setLayout(difficulty)
    setupCardEvents();
    switchScreen('levelJS');
}

function setLayout(difficulty) {
    if (difficulty === 'easy') cardsContainer.classList.add('layout-12');
    if (difficulty === 'normal') cardsContainer.classList.add('layout-18');
    if (difficulty === 'hard') cardsContainer.classList.add('layout-24');
}

function resetCards() {
    cardsContainer.classList.remove('layout-12', 'layout-18', 'layout-24');
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


nextLevelBtn.addEventListener( 'click', () => {
    startLevel(nextLevel)
})

tryAgainBtn.addEventListener( 'click', () => {
    startLevel(difficulty)
})

function victory() {
    if (difficulty != 'hard') {
        nextLevelBtn.classList.add('slide-in');
        nextLevelBtn.classList.add('active');
        nextLevelBtn.addEventListener('animationend', () => {
            nextLevelBtn.classList.remove('slide-in');
        }, { once: true })
    }
    cardsContainer.classList.add('cards-transparent')

    textVictory.classList.add('text-lvl-ended-active')
}

function defeat() {
    tryAgainBtn.classList.add('slide-in');
    tryAgainBtn.classList.add('active');
    tryAgainBtn.addEventListener('animationend', () => {
        tryAgainBtn.classList.remove('slide-in');
    }, { once: true })

    cardsContainer.classList.add('cards-transparent')

    textDefeat.classList.add('text-lvl-ended-active')
}

function doDamage() {
    HPsLeft -= 1;
    movesCounter.textContent = `Жизней: ${HPsLeft}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
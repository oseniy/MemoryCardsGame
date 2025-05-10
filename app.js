

function startLevel(difficulty) {

    const level = document.getElementById(difficulty)
    const cardsContainer = level.querySelector('.cards');
    const movesCounter =  level.querySelector('.moves-counter')
    const nextLevelBtn = level.querySelector('.next-level-btn');
    const tryAgainBtn = level.querySelector('.try-again-btn');
    const textVictory = level.querySelector('.text-victory')
    const textDefeat = level.querySelector('.text-defeat')

    let HPsLeft;
    let cardValues = [];
    let totalPairs;
    
    if (difficulty === 'levelEasyJS') {HPsLeft = 6; totalPairs = 6};
    if (difficulty === 'levelNormalJS') {HPsLeft =6; totalPairs = 9};
    if (difficulty === 'levelHardJS') {HPsLeft = 6; totalPairs = 12};

    movesCounter.textContent = `Жизней: ${HPsLeft}`;

    // Прочистка поля и перемешивание карточек
    resetCards(); 
    setupCardEvents();
    switchScreen(difficulty);

    function resetCards() {
        if (cardsContainer.classList.contains('cards-transparent')) {
            cardsContainer.classList.remove('cards-transparent')
            textVictory.classList.remove('text-lvl-ended-active')
            textDefeat.classList.remove('text-lvl-ended-active')
            if (difficulty != 'levelHardJS') nextLevelBtn.classList.remove('active');
            tryAgainBtn.classList.remove('active')
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
                        victory();
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
        if (difficulty != 'levelHardJS') {
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
}

// анимация смены экрана
function switchScreen(nextScreen) {

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
import switchScreen from "./switchScreen.js";
import png1 from "../assets/imgs/1.png";
import png2 from "../assets/imgs/2.png";
import png3 from "../assets/imgs/3.png";
import png4 from "../assets/imgs/4.png";
import png5 from "../assets/imgs/5.png";
import png6 from "../assets/imgs/6.png";
import png7 from "../assets/imgs/7.png";
import png8 from "../assets/imgs/8.png";
import png9 from "../assets/imgs/9.png";
import png10 from "../assets/imgs/10.png";
import png11 from "../assets/imgs/11.png";
import png12 from "../assets/imgs/12.png";

const images = { 
    1: png1, 
    2: png2,
    3: png3,
    4: png4,
    5: png5,
    6: png6,
    7: png7,
    8: png8,
    9: png9,
    10: png10,
    11: png11,
    12: png12,
};

export default function startLevel(difficulty) {

    const level = document.getElementById(difficulty)
    const cardsContainer = level.querySelector('.cards');
    const movesCounter =  level.querySelector('.moves-counter')
    const nextLevelBtn = level.querySelector('.next-level-btn');
    const tryAgainBtn = level.querySelector('.try-again-btn');
    const textVictory = level.querySelector('.text-victory')
    const textDefeat = level.querySelector('.text-defeat')

    let HPsLeft;
    let totalPairs;
    
    const colors = [ 
        "#FFD1DC", "#B5EAD7", "#C7CEEA", "#E2F0CB", 
        "#FFDAC1", "#B2E2F1", "#F8C8DC", "#D5E6ED", 
        "#F3E6DD", "#D4A5C3", "#A8D8B9", "#FFE5B4" 
    ];

    const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    
    if (difficulty === 'levelEasyJS') {HPsLeft = 8; totalPairs = 6};
    if (difficulty === 'levelNormalJS') {HPsLeft =14; totalPairs = 9};
    if (difficulty === 'levelHardJS') {HPsLeft = 16; totalPairs = 12};

    movesCounter.textContent = `Жизней: ${HPsLeft}`;

    // Прочистка поля и перемешивание карточек
    resetCards(); 
    setupCardEvents();
    switchScreen(difficulty);

    function resetCards() {
        if (cardsContainer.classList.contains('')) {
            cardsContainer.classList.remove('transparent')
            textVictory.classList.remove('text-lvl-ended-active')
            textDefeat.classList.remove('text-lvl-ended-active')
            if (difficulty != 'levelHardJS') nextLevelBtn.classList.remove('active');
            tryAgainBtn.classList.remove('active')
        }

        cardsContainer.innerHTML = '';

        const shuffledColors = shuffleArray(colors).slice(0, totalPairs)
        const shuffledValues = shuffleArray(values).slice(0, totalPairs)
         
        const cardsData = shuffledValues.map((value, index) => ({
            value: value,
            color: shuffledColors[index]
        }));

        const pairedCardsData = cardsData.flatMap(card => [card, { ...card }]);

        const finalCards = shuffleArray(pairedCardsData);
        finalCards.forEach(data => {
            const card = document.createElement('div')
            card.classList.add('card')
            card.dataset.color = data.color;
            card.dataset.value = data.value
            const imageUrl = images[data.value];
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back" style="background-color: ${data.color}; background-image: url('${imageUrl}')">
                    </div>
                </div>
            `
            cardsContainer.appendChild(card)
        })
    }

    function setupCardEvents() {
        const cards = document.querySelectorAll('.card');
        let flipped = [];
        let lock = false;
        let pairsFound = 0;
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
        if (difficulty != 'levelHardJS') {
            nextLevelBtn.classList.add('slide-in');
            nextLevelBtn.classList.add('active');
            nextLevelBtn.addEventListener('animationend', () => {
                nextLevelBtn.classList.remove('slide-in');
            }, { once: true })
        }
        cardsContainer.classList.add('transparent')

        textVictory.classList.add('text-lvl-ended-active')
    }

    function defeat() {
        tryAgainBtn.classList.add('slide-in');
        tryAgainBtn.classList.add('active');
        tryAgainBtn.addEventListener('animationend', () => {
            tryAgainBtn.classList.remove('slide-in');
        }, { once: true })

        cardsContainer.classList.add('transparent')

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


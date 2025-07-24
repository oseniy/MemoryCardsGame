import { doc, runTransaction, getDoc } from 'firebase/firestore';
import { auth } from "./main.js";
import { db } from "./main.js";
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

let levelStartTime = null;
let timeSpentMs = 0;
let timerStarted = false;

export default function startLevel(difficulty) {

    const level = document.getElementById(difficulty)
    const cardsContainer = level.querySelector('.cards');
    const movesCounter =  level.querySelector('[data-selectorJS="moves-counter"]');
    const nextLevelBtn = level.querySelector('[data-selectorJS="next-level-btn"]');
    const tryAgainBtn = level.querySelector('[data-selectorJS="try-again-btn"]');
    const textVictory = level.querySelector('[data-selectorJS="text-victory"]');
    const textbestScoreUpdated = level.querySelector('[data-selectorJS="text-bestScoreUpdated"]');
    const textDefeat = level.querySelector('[data-selectorJS="text-defeat"]');

    let HPs;
    let HPsLeft;
    let totalPairs;
    let HPsPenalty;
    let bestScoreKey;
    
    const colors = [ 
        "#FFD1DC", "#B5EAD7", "#C7CEEA", "#E2F0CB", 
        "#FFDAC1", "#B2E2F1", "#F8C8DC", "#D5E6ED", 
        "#F3E6DD", "#D4A5C3", "#A8D8B9", "#FFE5B4" 
    ];

    const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    
    if (difficulty === 'levelEasyJS') {HPs = 8; totalPairs = 6; HPsPenalty = 2600, bestScoreKey = 'bestScoreEasy'};
    if (difficulty === 'levelNormalJS') {HPs =14; totalPairs = 9; HPsPenalty = 3000, bestScoreKey = 'bestScoreNormal'};
    if (difficulty === 'levelHardJS') {HPs = 16; totalPairs = 12; HPsPenalty = 5400, bestScoreKey = 'bestScoreHard'};

    HPsLeft = HPs;
    movesCounter.textContent = `Жизней: ${HPsLeft}`;

    // Прочистка поля и перемешивание карточек
    resetCards(); 
    setupCardEvents();
    switchScreen(difficulty);

    function resetCards() {
        console.log("reset cards")
        stopLevelTimer();
        if (cardsContainer.classList.contains('transparent')) {
            cardsContainer.classList.remove('transparent')
            textVictory.classList.replace('text-overlay-active', 'text-overlay-hidden')
            textDefeat.classList.replace('text-overlay-active', 'text-overlay-hidden')
            textbestScoreUpdated.classList.replace('text-overlay-active', 'text-overlay-hidden');
            if (difficulty != 'levelHardJS') nextLevelBtn.classList.replace('text-overlay-active', 'text-overlay-hidden');
            tryAgainBtn.classList.replace('text-overlay-active', 'text-overlay-hidden')
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
        let firstCardFlipped = false;
        cards.forEach(card => {
            card.addEventListener('click', async () => {
                if (lock || card.classList.contains('flipped')) return;
                card.classList.add('flipped');
                flipped.push(card);
                if (!firstCardFlipped) {
                    startLevelTimer();
                    firstCardFlipped = true;
                }
                if (flipped.length === 2) {
                    lock = true;
                    const [a, b] = flipped;
                    if (a.dataset.value === b.dataset.value) {
                        flipped = [];
                        lock = false;
                        pairsFound += 1;
                        if (pairsFound == totalPairs) {
                            try {
                                await victory();
                            } catch (error) {
                                console.error("Ошибка при обновлении рекорда:", error);
                                throw error;
                            }
                        }
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

    async function victory() {
        stopLevelTimer();
        let HPsLost = HPs - HPsLeft;
        const penaltyPoints = timeSpentMs + HPsLost * HPsPenalty;
        let newBest;
        try {
            newBest = await isThisANewBest(bestScoreKey, penaltyPoints)
            console.log(newBest);
        } catch (error) {
            console.error("Ошибка при обновлении рекорда:", error);
            throw error;
        }
        console.log('Жизней осталось: ', HPsLeft);
        console.log('время на уровне: ', timeSpentMs);
        console.log('штрафных очков: ', penaltyPoints);
        if (difficulty != 'levelHardJS') {
            nextLevelBtn.classList.add('slide-in');
            nextLevelBtn.classList.add('active');
            nextLevelBtn.addEventListener('animationend', () => {
                nextLevelBtn.classList.remove('slide-in');
            }, { once: true })
        }
        cardsContainer.classList.add('transparent')
        if (newBest) {
            textbestScoreUpdated.classList.replace('text-overlay-hidden', 'text-overlay-active');
            updateBestScore(bestScoreKey, penaltyPoints, HPsLeft, timeSpentMs);
        } else textVictory.classList.replace('text-overlay-hidden', 'text-overlay-active')
    }

    function defeat() {
        tryAgainBtn.classList.add('slide-in');
        tryAgainBtn.classList.add('active');
        tryAgainBtn.addEventListener('animationend', () => {
            tryAgainBtn.classList.remove('slide-in');
        }, { once: true })

        cardsContainer.classList.add('transparent')

        textDefeat.classList.replace('text-overlay-hidden', 'text-overlay-active')
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

    function startLevelTimer() {
        if (timerStarted) return;
        levelStartTime = Date.now();
        timerStarted = true;
    }

    function stopLevelTimer() {
        if (!timerStarted || levelStartTime === null) return;
        timeSpentMs = Date.now() - levelStartTime;
        timerStarted = false;
    }
}

async function isThisANewBest(key, currentResult) {
    const user = auth.currentUser;
    if (!user) return;
    const uid = user.uid;
    const userDocRef = doc(db, 'users', uid); 
    const userDocSnap = await getDoc(userDocRef);
    const data = userDocSnap.data();
    if ( typeof data[key] === 'object') {
        if (currentResult < data[key].Score) {return true}
        else {return false};
    } else {
        return true
    }
} 

async function updateBestScore(key, currentResult, HPs, time) {
    const user = auth.currentUser;
    if (!user) return;
    const uid = user.uid;
    const userDocRef = doc(db, 'users', uid);
    try {
        await runTransaction(db, async (transaction) => { {
            transaction.update(userDocRef, { [key]: {
                Score: currentResult,
                HPs: HPs,
                time:time
            }
             });
            console.log(`Рекорд игрока ${uid} обновлен`);
            return true;
            }
        })
    } catch (error) {
        console.error("Ошибка при обновлении рекорда в транзакции:", error);
        throw error;
    }
}

import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from "./main.js";



export async function updateBestScoresTable() {
    const [bestScoreEasy, bestScoreNormal, bestScoreHard] = await getUsersScores();
    console.log (bestScoreEasy, bestScoreNormal, bestScoreHard);

    const HPsEasy = document.querySelector('[data-selectorJS ="HPsEasy"]');
    const timeEasy = document.querySelector('[data-selectorJS ="timeEasy"]');
    const HPsNormal = document.querySelector('[data-selectorJS ="HPsNormal"]');
    const timeNormal = document.querySelector('[data-selectorJS ="timeNormal"]');
    const HPsHard = document.querySelector('[data-selectorJS ="HPsHard"]');
    const timeHard = document.querySelector('[data-selectorJS ="timeHard"]');

    if (typeof bestScoreEasy === 'undefined') {
        HPsEasy.innerText = "-"
        timeEasy.innerText = "-"       
    } else {    
        HPsEasy.innerText = bestScoreEasy.HPs
        timeEasy.innerText = formatMilliseconds(bestScoreEasy.time)
    }    
    if (typeof bestScoreNormal === 'undefined') {
        HPsNormal.innerText = "-"
        timeNormal.innerText = "-"
    } else {
        HPsNormal.innerText = bestScoreNormal.HPs
        timeNormal.innerText = formatMilliseconds(bestScoreNormal.time)
    }    
    if (typeof bestScoreHard === 'undefined') {
        HPsHard.innerText = "-"
        timeHard.innerText = "-"
    } else {
        HPsHard.innerText = bestScoreHard.HPs
        timeHard.innerText = formatMilliseconds(bestScoreHard.time)
    }    
}

async function getUsersScores() {
    const user = auth.currentUser;
    if (!user) return;
    const uid = user.uid;
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        console.error("документа игрока не существует");
        return
    }
    const data = userDocSnap.data();
    return [data.bestScoreEasy, data.bestScoreNormal, data.bestScoreHard];
}

function formatMilliseconds(ms) {
    return (ms / 1000).toFixed(3).replace(/\.?0+$/, '');
}
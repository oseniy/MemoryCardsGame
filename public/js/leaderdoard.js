import { getDoc, doc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from "./main.js";
import { startLoading, endLoading } from './loading.js';



export async function updateBestScoresTable() {
    startLoading();
    const scores = await getUsersScores();
    const difficulties = ['Easy', 'Normal', 'Hard'];

    difficulties.forEach((level, i) => {
        const HPsEl = document.querySelector(`[data-selectorJS="HPs${level}"]`);
        const timeEl = document.querySelector(`[data-selectorJS="time${level}"]`);
        const score = scores[i];
        if (!score) {
            HPsEl.innerText = '-';
            timeEl.innerText = '-';
        } else {
            HPsEl.innerText = score.HPs;
            timeEl.innerText = formatMilliseconds(score.time);
        }
    })
    endLoading();
}

async function getUsersScores() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const uid = user.uid;
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            console.error("Документа игрока не существует");
            return;
        }

        const data = userDocSnap.data();
        return [data.bestScoreEasy, data.bestScoreNormal, data.bestScoreHard];

    } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
    }
}

function formatMilliseconds(ms) {
    return (ms / 1000).toFixed(3).replace(/\.?0+$/, '');
}

const leaderBoardEasy = document.querySelector('[data-selectorJS="leaderBoardTableEasy"]');

const leaderBoardNormal = document.querySelector('[data-selectorJS="leaderBoardTableNormal"]');

const leaderBoardHard = document.querySelector('[data-selectorJS="leaderBoardTableHard"]');


export async function updateLeaderBoard(level) {
    console.log('updateLeaderBoard')
    startLoading();
    let leaderBoard;

    if (level === 'bestScoreEasy') {
        leaderBoard = leaderBoardEasy;
    } else if (level === 'bestScoreNormal') {
        leaderBoard = leaderBoardNormal;
    } else {
        leaderBoard = leaderBoardHard;
    }

    leaderBoard.innerHTML = '';

    let users;

    try {
        users = await getAllUsers();
    } catch (error) {
        console.error("Ошибка при обновлении лидерборда:", error);
    }

    const sortedUsers = sortingUsers(users, level);

    console.log(sortedUsers);

    sortedUsers.forEach((user, i) => {
        console.log(user[level]);
        if (!user[level]) return;
        const row = document.createElement('div');
        row.classList.add('best-score-table__row');
        if (i == 0) row.classList.add('gold-color');
        const time = formatMilliseconds(user[level].time);
        row.innerHTML = `
                <p class="best-score-table__element font-small text-item" data-selectorJS="leaderBoardRank">${i+1}</p>
                <p class="best-score-table__element font-small text-item" data-selectorJS="leaderBoardElemUser">${user.username}</p>
                <p class="best-score-table__element font-small text-item" data-selectorJS="leaderBoardElemHPs">${user[level].HPs}</p>
                <p class="best-score-table__element font-small text-item" data-selectorJS="leaderBoardElemTime">${time}</p>
        `
       leaderBoard.appendChild(row); 
    })
    endLoading();
}

function sortingUsers(users, level) {
        return users
        .filter(user => user[level] /*&& user.emailVerified*/)
        .sort((a, b) => a[level].Score - b[level].Score);

}

async function getAllUsers() {
    const users = [];
    try {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef);
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        })
        return users
    } catch (error) {
        console.error("Ошибка при загрузке рекордов игроков:", error);
    }
}
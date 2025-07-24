import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from "./main.js";



export async function updateBestScoresTable() {

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
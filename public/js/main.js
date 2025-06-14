import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import switchScreen from "./switchScreen.js";
import startLevel from "./level.js";
import { handleRegistration, handleSingIn } from './auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyD_k8EUQgEdFfsUCDJs3RGuIQ4sTXXXi4M",
  authDomain: "memorycardsgame-6b7d9.firebaseapp.com",
  projectId: "memorycardsgame-6b7d9",
  storageBucket: "memorycardsgame-6b7d9.firebasestorage.app",
  messagingSenderId: "952997676593",
  appId: "1:952997676593:web:1ac70c05e492b64c297710"
};

// Инициализируем Firebase в приложении
const app = initializeApp(firebaseConfig);

// Получаем экземпляр сервиса аутентификации
const auth = getAuth(app);
export { auth };

const db = getFirestore(app);
export { db };


// обработчик события кнопки "Назад"
document.querySelectorAll('[data-action="back"]').forEach((btn) => {
    btn.addEventListener('click', () => {
        switchScreen('mainJS')
    })
})

// обработчики событий кнопок уровней
document.querySelectorAll('[data-action="startEasy"]').forEach((btn) => {
    btn.addEventListener('click', () => {
    startLevel("levelEasyJS");
    })
});

document.querySelectorAll('[data-action="startNormal"]').forEach((btn) => {
    btn.addEventListener('click', () => {
    startLevel("levelNormalJS");
    })
});

document.querySelectorAll('[data-action="startHard"]').forEach((btn) => {
    btn.addEventListener('click', () => {
    startLevel("levelHardJS");
    })
});


document.querySelector('[data-action="singUp"]').addEventListener("click", () => {
    switchScreen("singUpJS");
});

document.querySelector('[data-action="singIn"]').addEventListener("click", () => {
    switchScreen("singInJS");
});

// обработчик события кнопки Зарегистрироваться
const singUpForm = document.getElementById('singUpFormJS')
singUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleRegistration();
})

const singInForm = document.getElementById('singInFormJS')
singInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSingIn();
})

// отображение области аутентификации
const authArea = document.getElementById('authAreaJS');
const usernameArea = document.getElementById('usernameJS');

async function getUsername(user) {
    const uid = user.uid;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const data = userSnap.data();
        return data.username
    } else {
        console.log("Документ не найден");
    }
}


function showLoggedInUI(user) {
    getUsername(user).then( username => {
        if (username) {
            usernameArea.innerHTML = `
                <p class="text-item font-main">${username}</p>
            `;
        }
    })
    authArea.classList.add('disable');
    usernameArea.classList.remove('disable');
}

function showLoggedOutUI() {
    authArea.classList.remove('disable');
    usernameArea.classList.add('disable');
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInUI(user);
  } else {
    showLoggedOutUI();
  }
});
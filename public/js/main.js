import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import switchScreen from "./switchScreen.js";
import startLevel from "./level.js";
import { handleRegistration } from './auth.js';

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

const singUpForm = document.getElementById('singUpFormJS')
singUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleRegistration();
})

// Получаем экземпляр сервиса аутентификации
const auth = getAuth(app);
export { auth };
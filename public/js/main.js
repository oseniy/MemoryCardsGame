import switchScreen from "./switchScreen.js";
import startLevel from "./level.js";


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
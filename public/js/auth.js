import switchScreen from "./switchScreen.js";
import { auth } from "./main.js";

// регистрация
function revertScreen() {
    const singUp = document.querySelector('.sing-up__inner');
    singUp.classList.add('sing-up--flipped');
}

export async function handleRegistration() {
  const emailInput = document.getElementById('singUpEmailJS'); // Получаем поле ввода email
  const passwordInput = document.getElementById('singUpPasswdJS'); // Получаем поле ввода password

  const email = emailInput.value; // Получаем значение email
  const password = passwordInput.value; // Получаем значение password

  try {
    // Вызываем функцию Firebase для создания пользователя
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Если успешно, userCredential содержит информацию о созданном пользователе
    const user = userCredential.user;
    console.log("Пользователь успешно зарегистрирован и вошел:", user);
    revertScreen();
    // Здесь вы можете перенаправить пользователя,
    // обновить UI, показать сообщение об успехе и т.д.
    // Поскольку после создания аккаунта пользователь автоматически входит,
    // Firebase Auth автоматически обновит статус входа в вашем приложении.

    // Firebase автоматически сохраняет сессию пользователя.
    // При следующей загрузке страницы пользователь может остаться вошедшим,
    // если вы не вызовете функцию выхода (signOut).

  } catch (error) {
    // Обрабатываем ошибки, которые могут возникнуть
    const errorCode = error.code; // Код ошибки (например, 'auth/email-already-in-use')
    const errorMessage = error.message; // Сообщение об ошибке

    console.error(`Ошибка регистрации: ${errorCode}`, errorMessage);

    // Здесь вы должны показать понятное сообщение об ошибке пользователю
    // Например, если errorCode === 'auth/email-already-in-use', выводите:
    // "Этот адрес почты уже используется."
    // Если errorCode === 'auth/weak-password', выводите:
    // "Пароль слишком простой. Придумайте более надежный."
    // и т.д.
  }
}

// Вам нужно будет подключить эту функцию к событию клика по вашей кнопке регистрации
// Например:
// const registerButton = document.getElementById('register-button');
// registerButton.addEventListener('click', handleRegistration);


// Вход
const singInForm = document.getElementById('singInFormJS');
singInForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('singInEmailJS').value;
    const password = document.getElementById('singInPasswdJS').value;

    this.reset();
    switchScreen('mainJS')

})
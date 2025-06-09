import switchScreen from "./switchScreen.js";

const singInForm = document.getElementById('singInFormJS');

singInForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('singInEmailJS').value;
    const password = document.getElementById('singInPasswdJS').value;

    this.reset();
    switchScreen('mainJS')
    console.log(email, password);

})

function revertScreen() {
    const singUp = document.querySelector('.sing-up__inner');
    singUp.classList.add('sing-up--flipped');
}
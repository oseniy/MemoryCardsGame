import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import switchScreen from "./switchScreen.js";
import { auth } from "./main.js";
import { db } from "./main.js";

async function isUsernameTaken(usernameToCheck) {
  const usersCollectionRef = collection(db, "users");
  const q = query(usersCollectionRef, where("username", "==", usernameToCheck));

  try {
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
      console.error("Ошибка при проверке никнейма:", error);
      throw error;
  }
}

export async function handleRegistration() {
  const emailInput = document.getElementById('signUpEmailJS');
  const passwordInput = document.getElementById('signUpPasswdJS');
  const passwordConfirmInput = document.getElementById('signUpPasswdConfirmJS');
  const usernameInput = document.getElementById('signUpUsernameJS');

  const email = emailInput.value;
  const password = passwordInput.value;
  const confirm = passwordConfirmInput.value;
  const username = usernameInput.value;

  if (password !== confirm) {
    alert('Пароли не совпадают!')
    return;
  }

  const isTaken = await isUsernameTaken(username);

  if (isTaken) {
    alert('Такой никнейм уже используется!')
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Если успешно, userCredential содержит информацию о созданном пользователе
    const user = userCredential.user;
    console.log("Пользователь успешно зарегистрирован и вошел:", user);
    const uid = user.uid;
    
    await setDoc(doc(db, 'users', uid), {
      username: username,
      email: email,
    })
    switchScreen('mainJS');

  } catch (error) {

    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Ошибка регистрации: ${errorCode}`, errorMessage);
    console.error(`Ошибка регистрации: ${errorCode}`);

  }
}



// Вход
export async function handleSignIn(formElement) {
  const emailInput = document.getElementById('signInEmailJS')
  const passwordInput = document.getElementById('signInPasswdJS')

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Пользователь вошел:", user);
    switchScreen('mainJS');
  } catch(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Ошибка при входе:", errorCode, errorMessage);
    alert(`Ошибка при входе:, ${errorCode}`);
  }
  formElement.reset();
}
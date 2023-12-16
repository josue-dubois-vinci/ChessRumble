import { setAuthenticatedUser } from '../../utils/auths';
import Navbar from '../Navbar/Navbar';
import Navigate from '../Router/Navigate';
/* eslint-disable */
import anime from 'animejs/lib/anime.es.js';

const RegisterPage = () => {

    const registerPageContent =`
        <div class="container register-container">
            <h2 class="text-center mb-4">Register</h2>
            <form id="registrationForm" action="/register" method="post">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter your username" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter your password" required>
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm your password" required>
                    <div id="passwordError" class="text-danger" ></div>
                </div>
                <button type="submit" class="btn btn-primary custom-btn" id="registerButton">Register</button>
            </form>
            <div class="mt-3 text-center">
                <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>`;
    

const main = document.querySelector('main');
main.innerHTML = registerPageContent;

const registerButton = document.getElementById('registerButton');

registerButton.addEventListener('mouseover', () => {
  anime({
    targets: registerButton,
    width: '+=100px', 
    easing: 'linear',
    duration: 150,
  });
});

registerButton.addEventListener('mouseout', () => {
  anime({
    targets: registerButton,
    width: '-=100px', 
    easing: 'linear',
    duration: 150,
  });
});

const register = document.querySelector("form");
register.addEventListener('submit', onRegister);


async function onRegister(e) {
    e.preventDefault();
  
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    if (password !== confirmPassword) {
      const passwordError = document.querySelector('#passwordError');
      passwordError.textContent = 'Password does not match.';
      return; 
    }

    const passwordError = document.querySelector('#passwordError');
    passwordError.textContent = '';
  
    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    const response = await fetch('http://localhost:3000/auths/register', options);
  
    if (!response.ok){
      if(response.status === 409){
        const passwordError = document.querySelector('#passwordError');
        passwordError.textContent = 'Le username existe déjà!';
        return;
      }

      if(response.status === 400){
        
        const errorResponse = await response.json();

        const formattedErrors = errorResponse.errors.join('\n');

        console.log('Détails de l\'erreur :', formattedErrors);

        const passwordError = document.querySelector('#passwordError');
        passwordError.textContent = formattedErrors;
        return;
      }
    }

    passwordError.textContent = '';
  
    const authenticatedUser = await response.json();
  
    console.log('Newly registered & authenticated user : ', authenticatedUser);
  
    setAuthenticatedUser(authenticatedUser);
  
    Navbar();
  
    Navigate('/');
};
};

export default RegisterPage;
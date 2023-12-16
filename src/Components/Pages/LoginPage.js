import Navigate from '../Router/Navigate';
import { setAuthenticatedUser } from '../../utils/auths';
import Navbar from '../Navbar/Navbar';
import { clearPage } from '../../utils/render';
/* eslint-disable */
import anime from 'animejs/lib/anime.es.js';


const LoginPage = () => {
    
    clearPage();
    
    // Creation of the login page 
    const loginPageContent =`
    <div class="container login-container">
        <h2 class="text-center mb-4">Login</h2>
            <form>
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter your username">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter your password">
                    <div id="passwordError" class="text-danger"></div>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="rememberMe">
                    <label class="form-check-label" for="rememberMe">Remember me</label>
                </div>
                <button type="submit" class="btn btn-primary  custom-btn" id="loginButton">Login</button>
            </form>
            <div class="mt-3 text-center">
                <p>Don't have an account? <a href="/register" data-uri="/register">Register here</a></p>
            </div>
    </div>
    `;

const main = document.querySelector('main');
main.innerHTML = loginPageContent;

const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('mouseover', () => {
  anime({
    targets: loginButton,
    width: '+=100px', // Increase width by 50 pixels (adjust as needed)
    easing: 'linear',
    duration: 150,
  });
});

loginButton.addEventListener('mouseout', () => {
  anime({
    targets: loginButton,
    width: '-=100px', // Decrease width by 50 pixels (adjust as needed)
    easing: 'linear',
    duration: 300,
  });
});

const login = document.querySelector("form");
login.addEventListener('submit', onLogin);


// function qui va appeler l'api pour se connecter
async function onLogin(e) {
    e.preventDefault();
  
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

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
  
    const response = await fetch('http://localhost:3000/auths/login', options);
  
    if (!response.ok) {
      if(response.status === 401){
        const passwordError = document.querySelector('#passwordError');
        passwordError.textContent = 'Username or Password does not match.';
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

    const passwordError = document.querySelector('#passwordError');
    passwordError.textContent = '';
  
    const authenticatedUser = await response.json();
    
    setAuthenticatedUser(authenticatedUser);
  
    Navbar();
  
    Navigate('/');
  };
};

export default LoginPage;
import anime from 'animejs';
import { clearPage } from '../../utils/render';
import chessImage from '../../img/chessImage.jpg';
import History from '../History/History';
import Navigate from '../Router/Navigate';
import { isAuthenticated } from '../../utils/auths';

const HomePage = () => {
  clearPage();

  const homePageContent = `
    <div class="container text-center overflow-auto ">
      <div class="row pb-5">
        <div class="col">
          <h3 class="display-3" id="welcomeTitle">Bienvenue sur Chess Rumble !</h3>
          <p class="lead">Amusez-vous ;)</p>
        </div>
      </div>

      <div class="row pb-5">
        <div class="col">
          <div id="groot">
            <img class="chessImage" src="${chessImage}" alt="chessImage" />
          </div>
        </div>
      </div>

      <div class="row pb-5">
        <div class="col">
          <button type="submit" class="btn btn-lg btn-primary custom-btn" id="playButton">Play</button>
        </div>
      </div>

      <div class="row">
        <div class="col history-section">
          <h3>Historique des parties</h3>
          <p>Consultez vos parties.</p>
          <div id="history-wrapper"></div>
        </div>
      </div>
    </div>
  `;

  const main = document.querySelector('main');
  main.innerHTML = homePageContent;

  const playButton = document.getElementById('playButton');
  playButton.addEventListener('mouseenter', () => {
    anime({
      targets: playButton,
      scale: 1.4,
      duration: 300,
    });
  });

  playButton.addEventListener('mouseleave', () => {
    anime({
      targets: playButton,
      scale: 1,
      duration: 300,
    });
  });
  playButton.addEventListener('click', () => {
    if (isAuthenticated()) {
      Navigate('/chess');
    } else {
      Navigate('/login');
    }
  });
  History();
};

export default HomePage;

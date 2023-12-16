import Phaser from 'phaser';
import GameScene from '../History/GameBoard';
import { clearPage } from '../../utils/render';

let game;

const GameDetailsPage = async () => {
  clearPage();

  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('id');

  const gameData = await fetch(`http://localhost:3000/games/${gameId}`).then((response) => {
    if (!response.ok) throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
    return response.json();
  });

  const main = document.querySelector('main');
  main.innerHTML = `
    <div id="gameDiv" class="col game-container d-flex justify-content-center my-3"></div>
  `;

  const config = {
    type: Phaser.AUTO,
    width: 560,
    height: 600,
    scene: [GameScene],
    parent: 'gameDiv',
  };

  if (game) game.destroy(true);
  game = new Phaser.Game(config);

  const checkScenes = () => {
    if (game.scene.getScene('GameScene')) {
      game.scene.getScene('GameScene').initData(gameData.moves);
    } else {
      setTimeout(checkScenes, 100);
    }
  };

  checkScenes();
};

export default GameDetailsPage;

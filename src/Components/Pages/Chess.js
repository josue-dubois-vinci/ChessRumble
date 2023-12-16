import Phaser from 'phaser';
import GameScene from '../ChessGame/indexbeta2';
import { getAuthenticatedUser, isAuthenticated } from '../../utils/auths';
import Navigate from '../Router/Navigate';

let game;

const createCheckerboardScene = () => {
  if (!isAuthenticated()) {
    Navigate('/login');
    return;
  }

  const { username } = getAuthenticatedUser();

  const phaserGame = `
    <div id="gameDiv" class="game-container d-flex justify-content-center my-3">
    </div>
  `;

  const main = document.querySelector('main');
  main.innerHTML = phaserGame;

  const config = {
    type: Phaser.AUTO,
    width: 642.25,
    height: 642.25,
    scene: [GameScene],
    parent: 'gameDiv',
  };

  if (game) game.destroy(true);
  game = new Phaser.Game(config);

  const checkScenes = () => {
    if (game.scene.getScene('GameScene')) {
      game.scene.getScene('GameScene').initData(username);
    } else {
      setTimeout(checkScenes, 100);
    }
  };

  checkScenes();
};

export default createCheckerboardScene;

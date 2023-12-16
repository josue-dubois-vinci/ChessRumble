import Navigate from '../Router/Navigate';
import { getAuthenticatedUser } from '../../utils/auths';

const History = async () => {
  let games;
  const user = getAuthenticatedUser()?.username;
  try {
    games = await fetch(`http://localhost:3000/games?user=${user}`).then((response) => {
      if (!response.ok)
        throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
      return response.json();
    });
  } catch (error) {
    console.log(error);
  }

  renderHistory(games, user);

  attachOnClickEventToWatchButton();
  attachOnClickEventToDeleteButton();
};

function renderHistory(games, user) {
  let formattedGames = [];
  if (games) {
    formattedGames = games.map((game, index) => {
      const g = { ...game };
      g.num = index + 1;
      g.date = new Date(game.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
      return g;
    });
  } else formattedGames = [];

  const history = `
  <div class="table-responsive">
    <table class='table table-hover'>
      <thead>
        <th class='col'><h6>#</h6></th>
        <th class='col'><h6>Date</h6></th>
        <th class='col'><h6>Result</h6></th>
        <th class='col'><h6>Opponent</h6></th>
        <th class='col'></th>
      </thead>
      <tbody>
      ${
        formattedGames.length > 0
          ? formattedGames
              .map(
                (game) => `
          <tr>
            <td>${game.num}</td>
            <td>${game.date}</td>
            ${
              game.winner === user
                ? `<td><i class="bi bi-check-circle-fill"></i></td>`
                : `<td><i class="bi bi-x-circle-fill"></i></td>`
            }
            <td>${game.opponent}</td>
            <td class="col text-end">
              <button type="button" value="${game.id}" class="watch-button btn btn-primary btn-sm">
                <i class="bi bi-eye-fill"></i>
              </button>
              <button type="button" class="delete-button btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i class="bi bi-trash"></i>
              </button>
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">Are you sure ?</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      This action cannot be undone !
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" value="${
                        game.id
                      }" class="confirm-delete-button btn btn-danger" data-bs-dismiss="modal">Delete game</button>
                    </div>
                  </div>
                </div>
              </div>
            </td>  
          </tr>
          `,
              )
              .join('\n')
          : `<tr><td colspan='7' class="text-center">Aucun partie n'a été trouvée</td></tr>`
      }
      </tbody>
    </table>
  </div>`;

  const historyWrapper = document.querySelector('#history-wrapper');
  historyWrapper.innerHTML = history;
}

function attachOnClickEventToWatchButton() {
  const watchButtons = document.querySelectorAll('.watch-button');
  watchButtons.forEach((button) => {
    button.addEventListener('click', () => {
      Navigate(`/gameDetails?id=${button.getAttribute('value')}`);
    });
  });
}

function attachOnClickEventToDeleteButton() {
  const deleteButton = document.querySelectorAll('.confirm-delete-button');
  deleteButton.forEach((button) => {
    button.addEventListener('click', () => {
      fetch(`http://localhost:3000/games/${button.getAttribute('value')}`, { method: 'DELETE' });
    });
  });
}

export default History;

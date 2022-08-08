/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const htmlBoard = document.querySelector('#board');
const customForm = document.querySelector('#custom-form');
const customHeight = document.querySelector('input[name="custom-height"]');
const customWidth = document.querySelector('input[name="custom-width"]');
const turnToken = document.querySelector('h1 label');


let WIDTH = 7;
let HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if(checkForWin()) {
    customHeight.value = HEIGHT;
    customWidth.value = WIDTH;
    if(currPlayer === 2) {
      currPlayer = 1;
      turnToken.setAttribute('class', 'p1');
      turnToken.innerText = 'P1';
    }
  }
  if(customHeight.value >= 4 || customWidth.value >= 4 && customHeight.value != '' && customHeight.value < 1 && customWidth.value != '' && customWidth.value < 1) {
    HEIGHT = customHeight.value;
    WIDTH = customWidth.value;
    while(htmlBoard.lastElementChild) {
      htmlBoard.removeChild(htmlBoard.lastElementChild);
    }
    makeBoard();
    makeHtmlBoard();
  }
  else {
    alert('Unplayable Game Parameters')
    customHeight.value = HEIGHT;
    customWidth.value = WIDTH;
  }
});

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  // const htmlBoard = document.querySelector('#board');
  // TODO: add comment for this code
  const top = document.createElement("tr");                   // Creates a tr for the top of each column
  top.setAttribute("id", "column-top");                       // Adds id=colum-top to the top of the columns
  top.addEventListener("click", handleClick);                 // Adds an event listener for each column
  const playLabel = document.createElement("label");          // My addition to denote where to play
  playLabel.innerText = '← Click this row to drop a piece!';  // My addition to denote where to play

  for (let x = 0; x < WIDTH; x++) {                           // Creates td cells with the id=x
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);                                     // Appends each td to the top-column tr
  }
  top.append(playLabel);                                      // My addition appends play area marker label to the end of the top-column tr
  htmlBoard.append(top);                                      // Appends top-column tr to the htmlBoard to form the clickable top row

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {                          // Creates column height y variable
    let row = document.createElement("tr");                   // Creates a tr row for each column
    for (let x = 0; x < WIDTH; x++) {                         // Creates row length x variable
      let cell = document.createElement("td");                // Creates mutable td cell
      cell.setAttribute("id", `${y}-${x}`);                   // Gives each td cell an id of "their y position"-"their x position" for accessability during play
      row.append(cell);                                       // Appends each td to its respective y-row tr
    }
    htmlBoard.append(row);                                    // Appends each filled tr row to the game board
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let i = HEIGHT-1; i >= 0; i--) {
    if(board[i][x] === null) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let htmlCell = document.getElementById(`${y}-${x}`);
  let cellToAdd = document.createElement("div");
  cellToAdd.classList.add("piece");
  cellToAdd.classList.add(`p${currPlayer}`);
  htmlCell.append(cellToAdd);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
  // setTimeout(alert(msg), 2000);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(board[0].every(function(value) {
    return value != null;
  })) {
    return endGame("It's a Tie!");
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  // currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
  if(currPlayer === 1) {
    currPlayer = 2;
    turnToken.setAttribute('class', 'p2');
    turnToken.innerText = 'P2';
  }
  else {
    currPlayer = 1;
    turnToken.setAttribute('class', 'p1');
    turnToken.innerText = 'P1';
  }

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];               // Creates horizontal win-condition variable for each coordinate
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];                // Creates vertical win-condition variable for each coordinate
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];  // Creates diagonal win-condition variable from bottom-left to top-right for each coordinate
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];  // Creates diagonal win-condition variable from top-left to bottom-right for each coordinate

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {          // Checks all win-condition variables for validity
        return true;                                                             // if confirmed, return true and end win check loop
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

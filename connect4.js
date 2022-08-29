/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie) */

const WIDTH = 7;
const HEIGHT = 6;
let win = false;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells (board[y][x])

/** makeBoard: create in-JS board structure:
 *  board = array of rows, each row is array of cells  (board[y][x]) */

/* makeBoard creates a boardRow (an array of WIDTH arrays) and pushes that row
into board HEIGHT times */
function makeBoard() {
    let boardRow = [];
    for (let x = 0; x < WIDTH; x++){
      boardRow.push(undefined)
    };
    for (let y = 0; y < HEIGHT; y++){
      board.push(Array.from(boardRow))
    };
};

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

/* These lines creates an HTML table row for the top of the htmlBoard, gives it
the id 'column-top', and adds a click listener */
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

/* These lines create WIDTH html cells and, gives them id 'x',
appends them to 'top' (table top row), then appends that to
the htmlBoard */
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  };
  htmlBoard.append(top);

/* These lines create HEIGHT html table rows, append WIDTH
html table cells to each, and append the rows to the htmlBoard */
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  };
};

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT-1; y >= 0; y--){
    if (board[y][x] === undefined){
      return y;
    };
  };
  return undefined;
};

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece', `player${currPlayer}`);
  let spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
};

/** endGame: announce game end */
function endGame(msg) {
  window.alert(msg)
};

/** handleClick: handle click of column top to play piece, stops clicks at game end */
function handleClick(evt) {
  // get x from ID of clicked cell
  if (win === true){
    return;
  }
  else {
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    win = true;
    window.setTimeout(function(){
      return endGame(`Player ${currPlayer} won`);
    }, 1000)
  };

  // check for tie
  if (board.every(y => y.every(x => (x != undefined)))){
      win = true;
      window.setTimeout(function(){
        return endGame(`It's a tie`);
      }, 1000)
    };

  // switch players
  if (currPlayer === 1){
    currPlayer = 2
  }
  else {
    currPlayer = 1
  };};
};

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

// Defines the possible cell combinations that qualify as a 'win'
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
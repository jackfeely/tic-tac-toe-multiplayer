var player = 'X',
    board = document.querySelector('table'),
    gameOn = true,
    hasError = false,
    error = document.createElement('p');
error.innerHTML = 'Illegal move!';


// Convert HTML table elements into an array of arrays, where each sub-array is a row containing 3 cells.
function boardToArray() {
  var cells = document.querySelectorAll('td'),
      row = [],
      boardArray = [];
  for (var i = 0; i < cells.length; i++) {
    row.push(cells[i].innerHTML);
    if (row.length === 3) {
      boardArray.push(row);
      row = [];
    }
  }
  return boardArray;
}


// Place player symbol ('X' or 'O') in the selected cell. Make sure the move is legal.
function move(event) {
  let cell = event.target;
  if (cell.innerHTML === '') {
    if (hasError) {
      document.body.removeChild(error);
      hasError = false;
    }
    cell.innerHTML = player;
    cell.style.textAlign = 'center';
  } else {
    hasError = true;
    document.body.appendChild(error);
  }
  
}

// Switch player (after a move is made) and change the display accordingly.
function switchPlayer() {
  var playerDisplay = document.querySelector('h2');
  if (hasError) {
    play();
  } else {
    if (player === 'X') {
      player = 'O';
      playerDisplay.style.backgroundColor = "blue";

    } else {
      player = 'X';
      playerDisplay.style.backgroundColor = "red";
    }
    playerDisplay.innerHTML = player + "'s turn";
  }
}


// Check the board for a winner or tie game.
function winner() {
  var boardArray = boardToArray();
  if (threeRow(boardArray) || threeCol(boardArray)|| threeDiag(boardArray) || catsGame(boardArray)) {
    gameOn = false;
    displayResult(boardArray);
  }
}

function catsGame(boardArray) {
  var fullRows = 0;
  for (var i = 0; i < boardArray.length; i++) {
    var row = boardArray[i];
    if (!row.includes('')) {
      fullRows += 1;
    }
  }
  if (fullRows === 3) {
    return true;
  }
  return false;
}

// Displays the winner.
function displayResult(boardArray) {
  var result = '';
  if (catsGame(boardArray)) {
    result = "Tie!";
  } else {
    result = player + " wins!";
  }
  var endGameText = document.querySelector('h2');
  endGameText.innerHTML = result; 
}

// Check each row.
function threeRow(boardArray) {
  if (threeConsec(boardArray)) {
    return true;
  }
  return false;
}

// Check each column.
function threeCol(boardArray) {
  var cols = boardArray[0].map(function(col, i) { 
    return boardArray.map(function(row) { 
      return row[i];
    })
  });
  if (threeConsec(cols)) {
    return true;
  }
  return false;
}

// Check each diagonal.
function threeDiag(boardArray) {
  var diag1 = [],
      diag2 = [],
      diags = [];
  diag1.push(boardArray[0][0], boardArray[1][1], boardArray[2][2]);
  diag2.push(boardArray[2][0], boardArray[1][1], boardArray[0][2]);
  diags.push(diag1, diag2);
  if (threeConsec(diags)) {
    return true;
  }
  return false;
}

// Checks rows, columns, and diagonals for three in a row.
function threeConsec(lines) {
  for (var i = 0; i < lines.length; i++) {
    let count_o = 0,
        count_x = 0,
        line = lines[i];
    for (var j = 0; j < line.length; j++) {
      let cell = line[j];
      if (cell === 'X') {
        count_o = 0;
        count_x += 1;
      }
      else if (cell === 'O') {
        count_x = 0;
        count_o += 1;
      }
      if (count_x === 3 || count_o === 3) {
        return true;
      }
    }
  }
  return false;
}


// Start a new game--clears the board.
var newGameButton = document.querySelector('button');
newGameButton.onclick = function() {
  var boardArray = boardToArray();
  if (!gameOn) {
    var result = document.querySelector('h2');
    result.innerHTML = player + "'s turn";

    var board = document.querySelector('table');
    for (var i = 0; i < boardArray.length; i++) {
      for (var j = 0; j < boardArray[i].length; j++) {
        board.children[0].children[i].children[j].innerHTML = '';
      }
    }
  }
  gameOn = true;
}


// Everytime the board is clicked, the game logic runs.
function play() {
  board.onclick = function(e) {
    // Board is only clickable while there's an active game.
    if (gameOn) {
      move(e);
      winner();
      // Switch player only if the game is still going.
      if (gameOn) {
        switchPlayer();
      }
    }
  }
}

play();
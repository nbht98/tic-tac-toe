const gameBoard = (() => {
  let board = new Array(9);

  const getBoard = () => {
    return board;
  };

  const makeBoard = (container) => {
    for (c = 0; c < board.length; c++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("value", c);

      cell.addEventListener("click", (e) => {
        gameController.playRound(parseInt(e.target.getAttribute("value")));
      });

      container.appendChild(cell);
    }
  };

  const setField = (index, sign) => {
    board[index] = sign;
  };

  const getField = (index) => {
    return board[index];
  };

  const reset = () => {
    board = new Array(9);
  };

  const getEmptyField = () => {
    const fields = [];
    for (let i = 0; i < board.length; i++) {
      const field = board[i];
      if (field == undefined) {
        fields.push(i);
      }
    }
    return fields;
  };

  return { getBoard, makeBoard, setField, getField, reset, getEmptyField };
})();

const displayController = (() => {
  const container = document.querySelector(".container");
  gameBoard.makeBoard(container);
  const fieldElements = document.querySelectorAll(".cell");
  const messageElement = document.querySelector(".message");

  const updateGameboard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].textContent = gameBoard.getField(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner === "draw") {
      messageElement.textContent = "It's a draw!";
    } else {
      messageElement.textContent = `${winner} won!`;
    }
  };

  return { updateGameboard, setResultMessage };
})();

const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const minimaxAi = ((percentage) => {
  let scores = {
    X: 1,
    O: -1,
    draw: 0,
  };

  let aiPrecision = percentage;

  const chooseField = () => {
    //random number between 0 and 100
    // const value = Math.floor(Math.random() * (100 + 1));

    // if the random number is smaller then the ais threshold, it findds the best move
    // let choice = null;
    // if (value <= aiPrecision) {
    //     console.log('bestChoice');
    //     choice = minimax(gameBoard, gameController.getAiPlayer()).index
    //     const field = gameBoard.getField(choice);
    //     if (field != undefined) {
    //         return "error"
    //     }
    // }
    // else {
    // const emptyField = gameBoard.getEmptyField();
    // let randomMove = Math.floor(Math.random() * emptyField.length);
    // choice = emptyField[randomMove];
    // return choice;

    console.log('bestChoice');
    choice = bestMove(gameBoard.getBoard())
    return choice
  };

  const bestMove = (board) => {
    let bestMove
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == undefined) {
        board[i] = gameController.getComputer().getSign();
        let score = minimax(board, 0, false);
        board[i] = undefined;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const minimax = (board, depth, isMaximizing) => {
    let result = gameController.checkWin(board);
    if (result) {
      return scores[result];
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] == undefined) {
          board[i] = gameController.getComputer().getSign();
          let score = minimax(board, depth + 1, false);
          board[i] = undefined;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] == undefined) {
          board[i] = gameController.getPlayer().getSign();
          let score = minimax(board, depth + 1, true);
          board[i] = undefined;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  return { chooseField };
})();

const gameController = (() => {
  const player = Player("O");
  const computer = Player("X");
  const computerLogic = minimaxAi;
  let round = 1;
  let isOver = false;

  const getPlayer = () => player;
  const getComputer = () => computer;

  const play = (fieldIndex, sign) => {
    gameBoard.setField(fieldIndex, sign);
    displayController.updateGameboard();
    if (checkWin(gameBoard.getBoard())) {
      displayController.setResultMessage(checkWin(gameBoard.getBoard()));
      isOver = true;
      return;
    }
  };

  const playRound = (fieldIndex) => {
    if (
      gameController.gameIsOver() ||
      gameBoard.getField(fieldIndex) !== undefined ||
      gameBoard.getField(fieldIndex) == computer.getSign()
    )
      return;
    play(fieldIndex, player.getSign());
    round++;
    if (!isOver) {
      play(computerLogic.chooseField(), computer.getSign());
      round++;
    }
  };


  const checkWin = (board) => {
    let winner;
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const isWin = winConditions
      .some((possibleCombination) => {
        if (
          possibleCombination.every(
            (field) => board[field] === "O"
          )
        )
          winner = "O";
        if (
          possibleCombination.every(
            (field) => board[field] === "X"
          )
        )
          winner = "X";
        return (
          possibleCombination.every(
            (field) => board[field] === "O"
          ) ||
          possibleCombination.every(
            (field) => board[field] === "X"
          )
        );
      });
    if (isWin) {
      return winner;
    }
    for (let i = 0; i < board.length; i++) {
      if (board[i] == undefined) {
        return 
      }
    }
    return 'draw'
  };

  const gameIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return {
    getPlayer,
    getComputer,
    playRound,
    checkWin,
    gameIsOver,
    reset,
  };
})();

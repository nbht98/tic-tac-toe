const gameBoard = (() => {
  let board = new Array(9);

  const getBoard = () => {
    return board;
  };

  const makeBoard = () => {
    const container = document.querySelector(".container");
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
  const messageElement = document.querySelector(".message");
  const mask = document.querySelector(".mask");
  gameBoard.makeBoard();

  const fieldElements = document.querySelectorAll(".cell");

  const resetGameboard = () => {
    gameController.reset();
    mask.classList.remove("active");
    updateGameboard();
  };

  const updateGameboard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      if (gameBoard.getField(i) == "X") {
        fieldElements[i].innerHTML = `&#10005`;
        fieldElements[i].classList.add("cell-x");
      } else if (gameBoard.getField(i) == "O") {
        fieldElements[i].innerHTML = `&#9711`;
        fieldElements[i].classList.add("cell-o");
      } else {
        fieldElements[i].innerHTML = "";
        fieldElements[i].classList.remove("cell-o");
        fieldElements[i].classList.remove("cell-x");
      }
    }
  };

  const setResultMessage = (winner) => {
    mask.classList.add("active");
    mask.addEventListener("click", resetGameboard);

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

  const setSign = (newSign) => {
    sign = newSign;
  };

  return { getSign, setSign };
};

const minimaxAi = ((percentage) => {
  let aiPrecision = percentage;

  const chooseField = () => {
    const value = Math.floor(Math.random() * (100 + 1));
    let choice;

    if (value <= aiPrecision) {
      choice = bestMove(gameBoard.getBoard());
    } else {
      const emptyField = gameBoard.getEmptyField();
      let randomMove = Math.floor(Math.random() * emptyField.length);
      choice = emptyField[randomMove];
    }
    return choice;
  };

  const bestMove = (board) => {
    let bestMove;
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
    if (result == gameController.getComputer().getSign()) {
      return 1;
    }
    if (result == gameController.getPlayer().getSign()) {
      return -1;
    }
    if (result == "draw") {
      return 1;
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

  const changeAI = () => {
    let select = document.querySelector("#level");
    aiPrecision = parseInt(select.options[select.selectedIndex].value);
  };

  return { chooseField, changeAI };
})(0);

const gameController = (() => {
  let player = Player("X");
  let computer = Player("O");
  const computerLogic = minimaxAi;
  const selector = document.querySelector(".select");
  const x = document.querySelector(".x");
  const o = document.querySelector(".o");

  let isOver = false;

  const getPlayer = () => player;
  const getComputer = () => computer;

  const init = (() => {
    x.classList.add("button-active");
    selector.addEventListener("change", () => {
      computerLogic.changeAI();
      reset();
    });
    o.addEventListener("click", () => {
      player.setSign("O");
      computer.setSign("X");
      o.classList.add("button-active");
      x.classList.remove("button-active");
      reset();
    });
    x.addEventListener("click", () => {
      player.setSign("X");
      computer.setSign("O");
      x.classList.add("button-active");
      o.classList.remove("button-active");
      reset();
    });
  })();

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
    if (!isOver) {
      play(computerLogic.chooseField(), computer.getSign());
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

    const isWin = winConditions.some((possibleCombination) => {
      if (possibleCombination.every((field) => board[field] === "O"))
        winner = "O";
      if (possibleCombination.every((field) => board[field] === "X"))
        winner = "X";
      return (
        possibleCombination.every((field) => board[field] === "O") ||
        possibleCombination.every((field) => board[field] === "X")
      );
    });
    if (isWin) {
      return winner;
    }
    for (let i = 0; i < board.length; i++) {
      if (board[i] == undefined) {
        return;
      }
    }
    return "draw";
  };

  const gameIsOver = () => {
    return isOver;
  };

  const reset = () => {
    isOver = false;
    gameBoard.reset();
    displayController.updateGameboard()
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

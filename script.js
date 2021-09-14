// fieldElements.forEach((field) =>
// field.addEventListener("click", (e) => {
//   if (gameController.getIsOver() || e.target.textContent !== "") return;
//   gameController.playRound(parseInt(e.target.dataset.index));
//   updateGameboard();
// })
// );

const gameBoard = (() => {
  let board = new Array(9);

  const makeBoard = (container) => {
    for (c = 0; c < board.length; c++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("value", c);

      cell.addEventListener("click", (e) => {
        if (gameController.getIsOver() || e.target.textContent !== "") return;
        gameController.playRound(parseInt(e.target.getAttribute("value")));
        // updateGameboard();
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

  return { makeBoard, setField, getField, reset };
})();

const displayController = (() => {
  const container = document.querySelector(".container");
  gameBoard.makeBoard(container);
})();

const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const gameController = (() => {
  const player = Player("X");
  const computer = Player("O");
  let round = 1;
  let isOver = false;

  const playRound = (fieldIndex) => {
    console.log(round, fieldIndex, getCurrentPlayerSign())
    gameBoard.setField(fieldIndex, getCurrentPlayerSign());
    if (checkWin(fieldIndex)) {
      // displayController.setResultMessage(getCurrentPlayerSign());
      isOver = true;
      return;
    }
    if (round === 9) {
      // displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }
    round++;
    // displayController.setMessageElement(
    //   `Player ${getCurrentPlayerSign()}'s turn`
    // );
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? player.getSign() : computer.getSign();
  };

  const checkWin = (fieldIndex) => {
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
    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (field) =>
            gameBoard.getField(field) === "X"
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, reset };
})();

const gameBoard = (() => {
  const board = new Array(9);

  const makeBoard = (container) => {
    for (c = 0; c < board.length; c++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("value", c);
      container.appendChild(cell);
    }
  };

  return { makeBoard };
})();

const displayController = (() => {
  const container = document.querySelector(".container");
  gameBoard.makeBoard(container);
})();

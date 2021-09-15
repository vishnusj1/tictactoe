var gameBoard = (function() {
    let _board = new Array(9).fill(null);
    let totalX = [];
    let totalO = [];
    let isDraw = null;
    let roundCount = 1;

    board = document.querySelector(".game-board");
    fields = board.querySelectorAll(`[data-index]`);
    restartButton = document.querySelector(".restart-btn");

    var getBoardArray = () => {
        return _board;
    };

    var getField = (num) => {
        return _board[num];
    };

    var setField = (num) => {
        if (_board[num] == null) {
            playerSign = game.currentPlayer().getSign();
            playerSign === "X" ? totalX.push(Number(num)) : totalO.push(Number(num));
            console.log(totalX, totalO);
            field = board.querySelector(`[data-index='${num}']`);
            field.innerHTML = playerSign;
            _board[num] = playerSign;
        } else {
            console.log("Already Filled!", _board);
            return null;
        }
    };

    var refreshArray = () => {
        for (i = 0; i < _board.length; i++) {
            _board[i] = null;
        }
    };

    var checkDraw = () => {
        if (!_board.some((el) => el === null)) {
            isDraw = true;
            return roundOver(false);
        }
    };

    var checkWinner = () => {
        const winningMoves = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        winningMoves.forEach((move) => {
            const countX = [];
            const countO = [];
            playerX = game.getPlayer1();
            playerO = game.getPlayer2();
            move.forEach((num) => {
                if (checkDraw() === false) return;
                if (totalX.includes(num)) {
                    countX.push(num);
                    if (countX.length === 3) {
                        isDraw = false;
                        return roundOver(playerX, countX);
                    }
                }
                if (totalO.includes(num)) {
                    countO.push(num);
                    if (countO.length === 3) {
                        isDraw = false;
                        return roundOver(playerO, countO);
                    }
                }
            });
        });
    };

    var roundOver = (winner) => {
        if (winner === false) {
            console.log("Its a Draw");
            game.currentPlayer();
            displayController.endRound();
        } else {
            console.log(winner.getSign(), "is Winner");
            winner.incrementWin();
            setRoundCount();
            displayController.setRoundWin(playerX, playerO);
            totalO.length = 0;
            totalX.length = 0;
            game.currentPlayer();
            if (winner.getWinCount() === 3) {
                displayController.displayWinner(winner);
                restartButton.addEventListener(
                    "click",
                    gameOver.bind(playerX, playerO),
                    false
                );
                board.removeEventListener("click", game.play);
            } else {
                displayController.endRound();
            }
        }
    };

    var gameOver = () => {
        resetRoundCount();
        playerX.resetWin();
        playerO.resetWin();
        window.setTimeout(() => {
            displayController.setRoundWin(playerX, playerO);
            displayController.endRound();
        }, 1000);
        console.log("Restarting");
    };

    var getRoundCount = () => {
        return roundCount;
    };

    var setRoundCount = () => {
        return roundCount++;
    };

    var resetRoundCount = () => {
        return (roundCount = 1);
    };

    return {
        getBoardArray,
        getField,
        setField,
        checkWinner,
        refreshArray,
        getRoundCount,
        setRoundCount,
    };
})();

var Player = function(sign, currentPlayer, playerType) {
    let _sign = sign;
    let _roundWin = 0;

    var getSign = () => {
        return _sign;
    };

    var setSign = (sign) => {
        _sign = sign;
        return _sign;
    };

    var getWinCount = () => {
        return _roundWin;
    };

    var incrementWin = () => {
        return _roundWin++;
    };

    var resetWin = () => {
        return (_roundWin = 0);
    };

    var getCurrent = () => {
        return currentPlayer;
    };

    var updateCurrentPlayer = (isCurrent) => {
        return (currentPlayer = isCurrent);
    };

    var updateType = (type) => {
        return (playerType = type);
    };

    var getType = () => playerType;

    return {
        getSign,
        setSign,
        getWinCount,
        incrementWin,
        resetWin,
        getCurrent,
        updateCurrentPlayer,
        getType,
        updateType,
    };
};

var botController = (function() {
    console.log("bots");
    var availableMoves = () => {
        const possibleMoves = [];
        const ar = gameBoard.getBoardArray();
        ar.forEach((el, i) => {
            if (el === null) {
                possibleMoves.push(i);
                console.log(possibleMoves);
            }
        });
        const randomMove =
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        console.log(randomMove);
    };
    return {
        availableMoves,
    };
})();

var game = (() => {
    var _player1 = Player("X", false, "human"); //(sign, currentPlayer)
    var _player2 = Player("O", false, "human");
    var _aiPlayer = Player("O", false, "ai");

    var getPlayer1 = () => _player1;
    var getPlayer2 = () => _player2;
    var getAiPlayer = () => _aiPlayer;

    var currentPlayer = () => {
        if (_player1.getCurrent() === false && _player2.getCurrent() === false) {
            _player1.updateCurrentPlayer(true);
            return _player1;
        } else if (
            _player1.getCurrent() === true &&
            _player2.getCurrent() === false
        ) {
            _player1.updateCurrentPlayer(false);
            _player2.updateCurrentPlayer(true);
            return _player2;
        } else if (
            _player1.getCurrent() === false &&
            _player2.getCurrent() === true
        ) {
            _player2.updateCurrentPlayer(false);
            _player1.updateCurrentPlayer(true);
            return _player1;
        }
    };

    var play = function(e) {
        if (e.target.classList.contains("grid-fields")) {
            var index = e.target.dataset.index;
            gameBoard.setField(index);
            gameBoard.checkWinner();
        }
    };

    return {
        getPlayer1,
        getPlayer2,
        getAiPlayer,
        play,
        currentPlayer,
    };
})();

var displayController = (function() {
    const playerOne = document.querySelector(".one");
    const playerTwo = document.querySelector(".two");
    const statOne = playerOne.querySelector(".stat");
    const statTwo = playerTwo.querySelector(".stat");
    const roundStat = document.querySelector(".round-stat");
    const winnerCard = document.querySelector(".winner-card");
    const gameBoardContainer = document.querySelector(".container");
    const modeButton = document.querySelector(".mode-btn");

    var playerChange = (e) => {
        modeButton.textContent === "vs Bot" ?
            (modeButton.textContent = "PvP") :
            (modeButton.textContent = "vs Bot");
        console.log(game.getAiPlayer().getType());
        update;
    };

    var startRound = () => {
        board.addEventListener("click", game.play);
    };

    var endRound = () => {
        board.removeEventListener("click", game.play);
        clear();
    };

    var setRoundWin = (playerX, playerO, winner) => {
        statOne.textContent = playerX.getWinCount();
        statTwo.textContent = playerO.getWinCount();
    };

    var setRoundCount = () => {
        roundStat.textContent = gameBoard.getRoundCount();
    };

    var render = () => {
        modeButton.addEventListener("click", playerChange);
        gameBoardContainer.classList.add("toggle-on");
        fields.forEach((field, i) => {
            field.innerHTML = gameBoard.getField(i);
        });
        startRound();
        setRoundCount();
    };

    var clear = () => {
        gameBoard.refreshArray();
        window.setTimeout(() => {
            render();
            winnerCard.classList.remove("toggle-on");
        }, 1000);
    };

    var displayWinner = (winner) => {
        winnerCard.classList.add("toggle-on");
        winnerCard.textContent = `${winner.getSign()} has won the game. `;
    };

    return {
        playerChange,
        startRound,
        endRound,
        setRoundWin,
        render,
        clear,
        displayWinner,
    };
})();

displayController.render();
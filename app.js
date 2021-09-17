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

    var setFieldAi = (num, player) => {
        console.log("set field for ai");
        if (_board[num] === null) {
            playerSign = player.getSign();
            playerSign === "X" ? totalX.push(Number(num)) : totalO.push(Number(num));
            console.log(totalX, totalO);
            field = board.querySelector(`[data-index='${num}']`);
            field.innerHTML = playerSign;
            _board[num] = playerSign;
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

    var checkForDraw = () => {
        for (let i = 0; i < 9; i++) {
            const field = getField(i);
            if (field == undefined) {
                return false;
            }
        }
        return true;
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
            // game.currentPlayer();
            displayController.endRound();
        } else {
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

    var gameOver = (playerX, playerO) => {
        resetRoundCount();
        resetWinCount(playerX, playerO);
        window.setTimeout(() => {
            displayController.setRoundWin(playerX, playerO);
            displayController.endRound();
        }, 300);
        console.log("Restarting");
    };

    var resetWinCount = (playerX, playerO) => {
        playerX.resetWin();
        playerO.resetWin();
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
        setFieldAi,
        checkForDraw,
        checkWinner,
        refreshArray,
        getRoundCount,
        setRoundCount,
        gameOver,
    };
})();

var Player = function(sign, currentPlayer, playerType) {
    let _sign = sign;
    let _roundWin = 0;
    let _name = "Player";

    var setName = (name) => {
        _name = name;
    };

    var getName = () => {
        return _name;
    };

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
        playerType = type;
    };

    var getType = () => playerType;

    return {
        setName,
        getName,
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
    var availableMoves = () => {
        const possibleMoves = [];
        const ar = gameBoard.getBoardArray();
        ar.forEach((el, i) => {
            if (el === null) {
                possibleMoves.push(i);
                // console.log(possibleMoves);
            }
        });

        var findBestMove = (player) => {
            let bestScore = null;
            let bestMove;
            ar.forEach((el, i) => {
                console.log(ar[i]);
                if (ar[i] === null); {
                    ar[i] = player.getSign();
                    score = minimax(ar, 0, false, player);
                    ar[i] = "";
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = ar[i];
                    }
                    console.log(bestMove);
                }
            });
        };

        var minimax = (board, depth, isMaximizingPlayer, player) => {
            let result = gameBoard.checkForDraw();
            if (result === true) {
                return (score = 0);
            }
            if (isMaximizingPlayer) {
                let bestScore = -Infinity;
                board.forEach((el, i) => {
                    if (board[i] === null) {
                        board[i] = player.getSign();
                        score = minimax(ar, depth + 1, false, player);
                        board[i] === "";
                        return (score = Math.max(score, bestScore));
                        // console.log(max(score, bestScore));
                    }
                });
            } else {
                let bestScore = Infinity;
                board.forEach((el, i) => {
                    if (board[i] === null) {
                        board[i] = player.getSign();
                        let score = minimax(ar, depth + 1, true, player);
                        board[i] === "";
                        return (score = Math.min(score, bestScore));
                    }
                });
            }
        };

        const randomMove =
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return Object.freeze({ possibleMoves, randomMove, findBestMove });
    };

    var botStep = (player) => {
        return availableMoves().findBestMove(player);
    };

    return {
        botStep,
    };
})();

var game = (() => {
    var _player1 = Player("X", false, "human"); //(sign, currentPlayer,type)
    var _player2 = Player("O", false, "human");

    var getPlayer1 = () => _player1;
    var getPlayer2 = () => _player2;

    var changePlayerType = () => {
        _player2.getType() === "human" ?
            _player2.updateType("ai") :
            _player2.updateType("human");
    };

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

    var play = (e) => {
        if (e.target.classList.contains("grid-fields")) {
            var index = e.target.dataset.index;
            gameBoard.setField(index);
            gameBoard.checkWinner();
            let player = currentPlayer();
            checkPlayerType(player);
        }
    };

    var aiPlay = (player) => {
        const index = botController.botStep(player);
        gameBoard.setFieldAi(index, player);
    };

    var checkPlayerType = (player) => {
        if (player.getType() === "ai") {
            board.removeEventListener("click", game.play);
            window.setTimeout(() => {
                aiPlay(player);
                board.addEventListener("click", game.play);
            }, 200);
        } else if (player.getType() === "human") {
            currentPlayer();
        }
    };

    return {
        getPlayer1,
        getPlayer2,
        changePlayerType,
        play,
        currentPlayer,
    };
})();

var displayController = (function() {
    const playerOne = document.querySelector(".one");
    const playerTwo = document.querySelector(".two");
    const playerOneName = playerOne.querySelector(".name");
    const playerTwoName = playerTwo.querySelector(".name");
    const statOne = playerOne.querySelector(".stat");
    const statTwo = playerTwo.querySelector(".stat");
    const roundStat = document.querySelector(".round-stat");
    const winnerCard = document.querySelector(".winner-card");
    const gameBoardContainer = document.querySelector(".container");
    const modeButton = document.querySelector(".mode-btn");

    var changeGameMode = () => {
        playerX = game.getPlayer1();
        playerO = game.getPlayer2();
        if (modeButton.textContent === "1P") {
            gameBoard.gameOver(playerX, playerO);
            game.changePlayerType();
            playerO.setName("Computer");
            displayName();
            modeButton.textContent = "2P";
            console.log(playerO.getType());
        } else if (modeButton.textContent === "2P") {
            gameBoard.gameOver(playerX, playerO);
            game.changePlayerType();
            playerO.setName("Player");
            displayName();
            modeButton.textContent = "1P";
            console.log(playerO.getType());
        }
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
        modeButton.addEventListener("click", changeGameMode);
        gameBoardContainer.classList.add("toggle-on");
        fields.forEach((field, i) => {
            field.innerHTML = gameBoard.getField(i);
        });
        displayName();
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

    var displayName = () => {
        playerOneName.textContent = `
            ${game.getPlayer1().getName()} (${game.getPlayer1().getSign()})
            `;
        playerTwoName.textContent = `
            ${game.getPlayer2().getName()} (${game.getPlayer2().getSign()})
            `;
    };

    return {
        changeGameMode,
        startRound,
        endRound,
        setRoundWin,
        render,
        clear,
        displayWinner,
    };
})();

displayController.render();
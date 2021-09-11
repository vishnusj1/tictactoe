var gameBoard = (function() {
    let _board = new Array(9).fill(null);

    board = document.querySelector(".game-board");
    fields = board.querySelectorAll(`[data-index]`);

    var getField = (num) => {
        return _board[num];
        // console.log(_board[num]);
    };

    var setField = (num) => {
        if (_board[num] == null) {
            playerSign = game.currentPlayer().getSign();
            field = board.querySelector(`[data-index='${num}']`);
            field.innerHTML = playerSign;
            _board[num] = playerSign;
            console.log(_board);
        } else {
            console.log("Already Filled!", _board);
            return null;
        }
    };

    var render = () => {
        fields.forEach((field, i) => {
            field.innerHTML = _board[i];
        });
    };

    var clear = () => {
        for (i = 0; i < _board.length; i++) {
            _board[i] = "";
        }
        render();
    };

    return {
        getField,
        setField,
        render,
        clear,
    };
})();
gameBoard.render();

var Players = function(sign, currentPlayer) {
    let _sign = sign;
    let _roundWin = 0;

    var getSign = function() {
        return _sign;
    };
    var setSign = function(sign) {
        _sign = sign;
        return _sign;
    };
    var getWinCount = function() {
        return _roundWin;
    };
    var incrementWin = function() {
        _roundWin++;
    };
    var resetWin = function() {
        _roundWin = 0;
    };
    var getCurrent = function() {
        return currentPlayer;
    };
    var updateCurrentPlayer = function(isCurrent) {
        currentPlayer = isCurrent;
    };
    return {
        getSign,
        setSign,
        getWinCount,
        incrementWin,
        resetWin,
        getCurrent,
        updateCurrentPlayer,
    };
};

var playerType = (function() {
    var human = function(sign, currentPlayer) {
        prototype = Players(sign, currentPlayer);
        return Object.assign({}, prototype);
    };
    var ai = function(sign, currentPlayer) {
        prototype = Players(sign, currentPlayer);
        return Object.assign({}, prototype);
    };

    return { human, ai };
})();

var game = (() => {
    var _player1 = playerType.human("X", false);
    var _player2 = playerType.ai("O", false);

    board.addEventListener("click", (e) => {
        if (e.target.classList.contains("grid-fields")) {
            const index = e.target.dataset.index;
            play(index);
        }
    });

    var getPlayer1 = () => _player1;

    var getPlayer2 = () => _player2;

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

    var play = function(num) {
        gameBoard.setField(num);
        checkWinner();
    };

    var checkWinner = function() {
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
            console.log(move);
        });
    };
    // var playAi = function(num) {
    //     console.log(num);
    //     gameBoard.setField(num, _player2);
    //     checkWin(gameBoard, _player2);
    // }

    return {
        getPlayer1,
        getPlayer2,
        // playHuman,
        // playAi,
        currentPlayer,
    };
})();

var displayController = (function() {
    console.log("display controller module");
})();
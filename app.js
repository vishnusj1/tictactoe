var gameBoard = (function() {
    let _board = ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'];
    let _boardAr = new Array(9);

    board = document.querySelector('.game-board');
    fields = board.querySelectorAll(`[data-index]`);

    function setFields(num, player) {
        field = board.querySelector(`[data-index='${num}']`)
        field.innerHTML = player.getSign();
        _board[num] = player.getSign();
    };

    function render() {
        fields.forEach((field, i) => {
            field.innerHTML = _board[i]
        });
    };

    function clear() {
        for (i = 0; i < _board.length; i++) {
            _board[i] = '';
        };
        render();
    };

    return {
        setFields,
        render,
        clear
    }
})();
gameBoard.render();


var Players = function(sign) {
    let _sign = sign;
    let _roundWin = 0;

    var getSign = function() {
        return _sign;
    }
    var setSign = function(sign) {
        _sign = sign;
        return _sign;
    }
    var getWinCount = function() {
        return _roundWin;
    }
    var incrementWin = function() {
        _roundWin++
    }
    var resetWin = function() {
        _roundWin = 0;
    }

    return {
        getSign,
        setSign,
        getWinCount,
        incrementWin,
        resetWin,
    }
};

var playerType = (function() {
    var human = function(sign) {
        prototype = Players(sign);
        return Object.assign({}, prototype)
    }
    var ai = function(sign) {
        prototype = Players(sign);
        return Object.assign({}, prototype)
    }

    return { human, ai }
})();

var game = (() => {
    var _player1 = playerType.human('X');
    var _player2 = playerType.ai('O');

    board.addEventListener('click', (e) => {
        if (e.target.classList.contains("grid-fields")) {
            const index = e.target.dataset.index;
            play(index)
        }
    })

    var getPlayer1 = () => _player1;
    var getPlayer2 = () => _player2;


    var play = function(num) {
        console.log(num);
        gameBoard.setFields(num, _player1);

    }

    return {
        getPlayer1,
        getPlayer2,
        play,
    }
})();

var displayController = (function() {
    console.log('display');
})();
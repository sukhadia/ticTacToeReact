const initialState = function() {
    const rows = [];
    for (let i=0; i<3; i++) {
        let row = {},
            cells = [];
        for (let j=0; j<3; j++) {
            cells.push({position: {x: j, y: i}, value: ''});
        }
        row.cells = cells;
        rows.push(row);
    }
    return {rows: rows, player: 'O'};
}

const ticTacToeMove = (board = initialState(), action) => {
    console.log('action: '+JSON.stringify(action));
    let cell;
    switch (action.type) {
        case 'MOVE':
            let boardCopy = Object.assign({}, board);
            let player = boardCopy.player === 'X'? 'O' : 'X';
            cell = boardCopy.rows[action.position.y].cells[action.position.x];
            if (!cell.value) cell.value = player;
            boardCopy.player = player;
            return boardCopy;
        default:
            return board;
    }
}

const toggleGameOver = (gameOver = false, action) => {
    console.log('action: '+JSON.stringify(action));
    switch (action.type) {
        case 'TOGGLE_GAME_OVER':
            return gameOver? false : true;
        default:
            return gameOver;
    }
}

const toggleTie = (tie = false, action) => {
    console.log('action: '+JSON.stringify(action));
    switch (action.type) {
        case 'TOGGLE_TIE':
            return tie? false : true;
        default:
            return tie;
    }
}


const {createStore, combineReducers} = Redux;
const reducer = combineReducers({
    board: ticTacToeMove,
    gameOver: toggleGameOver,
    tie: toggleTie
});
const store = createStore(reducer);

class TTTCell extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.cellClick = this.cellClick.bind(this);
    }

    cellClick(event) {
        if (store.getState().gameOver) {
            return;
        }
        let el = $(event.currentTarget);
        let position = el.data('position').split(',');
        store.dispatch({ type: 'MOVE', position: { x: position[0], y: position[1] }});

        let winner = strategy(store.getState().board.rows);
        if (winner) {
            alert("Player " + winner + " Wins!!");
            store.dispatch({type: 'TOGGLE_GAME_OVER'});
        } else if (!store.getState().tie && this.boardFilled()) {
            alert("It's a tie!!");
            store.dispatch({type: 'TOGGLE_TIE'});
        }
    }

    boardFilled() {
        let board = store.getState().board.rows;
        for (let y = 0; y < board.length; y++) {
            let row = board[y],
                cells = row.cells;
            for (let x = 0; x < cells.length; x++) {
                if (!row.cells[x].value) {
                    return false;
                }
            }
        }
        return true;
    }

    render() {
        let cell = store.getState().board.rows[this.props.rowIndex].cells[this.props.cellIndex];
        return (
            <div className={"ttt-cell " + (cell.winningCell? 'winning-cell':'')} onClick={this.cellClick} data-position={cell.position.x+','+cell.position.y}>
        {cell.value}
    </div>
    );
    }
}


class TTTCells extends React.Component {
    render() {
        return (
            <div>
            {store.getState().board.rows[this.props.rowIndex].cells.map((cell, i) =>
            <TTTCell rowIndex={this.props.rowIndex} cellIndex={i} key={i} />
    )}
    </div>
    );
    }
}


class TTTRow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<div className="ttt-row">
            <TTTCells rowIndex={this.props.index} />
        </div>);
    }
}

class TTTRows extends React.Component {
    constructor(props) {
        super(props);
        store.subscribe(() => {
            this.setState(store.getState());
    })
    }
    render() {
        return (
            <div>
            {store.getState().board.rows.map((row, i) =>
            <TTTRow index={i} key={i} />
    )}
    </div>
    );
    }
}

class TicTacToe extends React.Component {
    render () {
        return (<div className="game">
            <TTTRows />
            </div>);
    }
}



ReactDOM.render(
<TicTacToe />, $('#ticTacToe')[0]
);




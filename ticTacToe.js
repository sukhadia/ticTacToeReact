const rows = [];
for (var i=0; i<3; i++) {
    var row = {},
        cells = [];
    for (var j=0; j<3; j++) {
        cells.push({position: {x: j, y: i}, value: ''});
    }
    row.cells = cells;
    rows.push(row);
}

let isX, gameOverFlag, tieAlerted;


class TTTCell extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.cellClick = this.cellClick.bind(this);
    }

    cellClick(event) {
        if (gameOverFlag) {
            return;
        }
        var el = $(event.currentTarget);
        var position = el.data('position').split(',');
        var clickedCell = rows[parseInt(position[1])].cells[parseInt(position[0])];
        if (!clickedCell.value) {

            clickedCell.value = isX ? 'O' : 'X';
            isX = !isX;
        }

        var winner = this.gameOver();
        if (winner) {
            alert("Player " + winner + " Wins!!");
            gameOverFlag = true;
        } else if (!tieAlerted && this.boardFilled()) {
            alert("It's a tie!!");
            tieAlerted = true;
        }
        this.setState(rows);
        this.props.callback();

    }

    gameOver() {
        return strategy(rows);
    }

    boardFilled() {
        for (var y = 0; y < rows.length; y++) {
            var row = rows[y],
                cells = row.cells;
            for (var x = 0; x < cells.length; x++) {
                if (!row.cells[x].value) {
                    return false;
                }
            }
        }
        return true;
    }

    render() {
        var cell = rows[this.props.rowIndex].cells[this.props.cellIndex];
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
                {rows[this.props.rowIndex].cells.map((cell, i) =>
                    <TTTCell callback={this.props.callback} rowIndex={this.props.rowIndex} cellIndex={i} key={i} />
                )}
            </div>
        );
    }
}


class TTTRow extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        // this.handleClick = this.handleClick.bind(this);
    }
    // handleClick(e) {
    //     e.preventDefault();
    //     stock.splice($(e.currentTarget).data('index'), 1);
    //     this.props.callback();
    // }
    render() {
        return (<div className="ttt-row">
            <TTTCells rowIndex={this.props.index} callback={this.props.callback}/>
        </div>);

    }
}

class TTTRows extends React.Component {
    constructor(props) {
        super(props);
        this.stateUpdate = this.stateUpdate.bind(this);
    }
    stateUpdate() {
        this.setState(rows);
    }
    render() {
        return (
        <div>
            {rows.map((row, i) =>
            <TTTRow callback={this.stateUpdate} index={i} key={i} />
            )}
        </div>
        );
    }

}

class TicTacToe extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        // this.handleClick = this.handleClick.bind(this);
        this.state = {
            rows: rows
        }
    }

    render () {
        return (<div className="game">
            <TTTRows />
        </div>);
    }
}



ReactDOM.render(
<TicTacToe />, $('#ticTacToe')[0]
);




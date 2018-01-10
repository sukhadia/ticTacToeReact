function strategy (rows) {
    var horizontal, vertical, diagonal, diagonal1, diagonal2,
        horizontalLoser, verticalLoser, winner;
    //horizontal
    if (!winner) {
        var winningRow = -1;
        for (var y=0; y<3; y++) {
            var thisRowIsWinner = true;
            for (var x=1; x<3; x++) {
                if (!rows[y].cells[x].value || (rows[y].cells[x].value !== rows[y].cells[x-1].value )) {
                    thisRowIsWinner = false;
                    break;
                }
            }
            if (thisRowIsWinner) {
                horizontal = true;
                winningRow = y;
                winner = rows[winningRow].cells[0].value;

                //paint winning combination
                for (var x=0; x<3; x++) {
                    rows[winningRow].cells[x].winningCell = true;
                }

            }
        }
    }

    //vertical
    if (!winner) {
        var winningCol = -1;
        for (var x=0; x<3; x++) {
            var thisColIsWinner = true;
            for (var y=1; y<3; y++) {
                if (!rows[y].cells[x].value || (rows[y].cells[x].value !== rows[y-1].cells[x].value) ) {
                    thisColIsWinner = false;
                    verticalLoser = rows[y].cells[x].value;
                    break;
                }
            }
            if (thisColIsWinner) {
                vertical = true;
                winningCol = x;
                winner = rows[0].cells[winningCol].value;

                //paint winning combination
                for (var y=0; y<3; y++) {
                    rows[y].cells[winningCol].winningCell = true;
                }

            }
        }
    }

    //diagonal
    if (!winner) {
        var centerValue = rows[1].cells[1].value;
        diagonal1 = centerValue && rows[0].cells[0].value === centerValue &&
            centerValue === rows[2].cells[2].value;
        diagonal2 = centerValue && rows[0].cells[2].value === centerValue &&
            centerValue === rows[2].cells[0].value;
        diagonal = diagonal1 || diagonal2;

        if (diagonal) {
            winner = centerValue;

            //paint winning combination
            rows[1].cells[1].winningCell = true;
            if (diagonal1) {
                rows[0].cells[0].winningCell = rows[2].cells[2].winningCell = true;
            } else {
                rows[0].cells[2].winningCell = rows[2].cells[0].winningCell = true;
            }
        }
    }

    return winner;
};
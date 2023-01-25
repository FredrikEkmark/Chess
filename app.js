"use strict";

// Declaring the Pieces and Free space const variables //

const pB = { name: "Pawn", notation: "P", color: "black", img: "<img class='piece' src='m/pB.svg'></img" };
const rB = { name: "Rook", notation: "R", color: "black", img: "<img class='piece' src='m/rB.svg'></img>" };
const nB = { name: "Knight", notation: "N", color: "black", img: "<img class='piece' src='m/nB.svg'></img>" };
const bB = { name: "Bishop", notation: "B", color: "black", img: "<img class='piece' src='m/bB.svg'></img>" };
const qB = { name: "Queen", notation: "Q", color: "black", img: "<img class='piece' src='m/qB.svg'></img>" };
const kB = { name: "King", notation: "K", color: "black", img: "<img class='piece' src='m/kB.svg'></img>" };

const pW = { name: "Pawn", notation: "P", color: "white", img: "<img class='piece' src='m/pW.svg'></img>" };
const rW = { name: "Rook", notation: "R", color: "white", img: "<img class='piece' src='m/rW.svg'></img>" };
const nW = { name: "Knight", notation: "K", color: "white", img: "<img class='piece' src='m/nW.svg'></img>" };
const bW = { name: "Bishop", notation: "B", color: "white", img: "<img class='piece' src='m/bW.svg'></img>" };
const qW = { name: "Queen", notation: "Q", color: "white", img: "<img class='piece' src='m/qW.svg'></img>" };
const kW = { name: "King", notation: "K", color: "white", img: "<img class='piece' src='m/kW.svg'></img>" };

const fr = { name: "Free", notation: "", color: "", img: "" };

// Declaring variables //

const letterArray = ["a", "b", "c", "d", "e", "f", "g", "h"];

let turn = "white";
let notTurn = "black";

let helpView = true;

let coordinate = { from: "", to: "" };

// Declaring the boards and adding eventlisteners //

const mainBoard = [
    //    A   B   C   D   E   F   G   H //
    /*1*/[rW, nW, bW, qW, kW, bW, nW, rW],
    /*2*/[pW, pW, pW, pW, pW, pW, pW, pW],
    /*3*/[fr, fr, fr, fr, fr, fr, fr, fr],
    /*4*/[fr, fr, fr, fr, fr, fr, fr, fr],
    /*5*/[fr, fr, fr, fr, fr, fr, fr, fr],
    /*6*/[fr, fr, fr, fr, fr, fr, fr, fr],
    /*7*/[pB, pB, pB, pB, pB, pB, pB, pB],
    /*8*/[rB, nB, bB, qB, kB, bB, nB, rB],
];

// FUNTIONS //

// Update board funtion //

function updateBoard() {

    console.log("UpdateBoard")

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let htmlSquare = letterArray[j] + (i + 1);
            document.getElementById(htmlSquare).innerHTML = mainBoard[i][j].img;
            if (helpView) {
                showValidMove(htmlSquare);
            }
        }
    }
}

// Move Funtions // 

function choseSquare(clicked_id) {
    console.log(clicked_id);
    if (coordinate.from !== "") {
        if (coordinate.from === clicked_id) {
            coordinate.from = "";
            document.getElementById(clicked_id).classList.remove("marked");

        } else {
            coordinate.to = clicked_id;
            declareMove(coordinate.from, coordinate.to);
        }
    } else {
        if (getSquareByID(mainBoard, clicked_id).color === turn) {
            coordinate.from = clicked_id;
            document.getElementById(clicked_id).classList.add("marked");
        }
    }
    updateBoard();
}

function declareMove() {

    console.log("declareMove");

    let validMove = validateMove(mainBoard, coordinate.from, coordinate.to);

    console.log("Valid Move: " + validateMove(mainBoard, coordinate.from, coordinate.to));

    if (validMove) {
        validMove = !check(mainBoard, turn);
        console.log(validMove);
    }

    if (validMove) {
        console.log("Move from " + coordinate.from + " to " + coordinate.to);

        move();
        document.getElementById(coordinate.from).classList.remove("marked");
        coordinate.from = "";

        passTurn();
    }

    coordinate.to = "";

}

function check(board, color) {

    let co = combineCoordinates(coordinate.from, coordinate.to);

    const tempBoard = JSON.parse(JSON.stringify(board));

    tempBoard[co.to.y][co.to.x] = tempBoard[co.from.y][co.from.x];
    tempBoard[co.from.y][co.from.x] = fr;

    console.log(tempBoard);
    console.log(mainBoard);

    let king = "";

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (tempBoard[i][j].name === "King" && tempBoard[i][j].color === color) {
                king = (letterArray[j] + (i + 1))
            }
        }
    }

    console.log("king is on " + king);


    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (validateMove(tempBoard, (letterArray[j] + (i + 1)), king)) {
                return true;
            }
        }
    }

    return false;

}

function validateMove(board, from, to) {

    let co = combineCoordinates(from, to)

    if (from === to) {
        return false;
    }

    if (getSquareByID(board, from).color === getSquareByID(board, to).color) {
        return false;
    }

    let x = co.from.y - co.to.y;

    let y = co.from.x - co.to.x;

    let pieceMove = true;

    switch (getSquareByID(board, from).name) {
        case "King":
            pieceMove = kingMove(x, y);
            break;
        case "Queen":
            pieceMove = queenMove(x, y);
            break;
        case "Bishop":
            pieceMove = bishopMove(x, y);
            break;
        case "Knight":
            pieceMove = knightMove(x, y);
            break;
        case "Rook":
            pieceMove = rookMove(x, y);
            break;
        case "Pawn":
            pieceMove = pawnMove(x, y, getSquareByID(board, from).color, getSquareByID(board, to).name !== "Free", co.from.y);
            break;
        default:
            pieceMove = false;
    }

    if (!pieceMove) {
        return false;
    }

    return canMoveThrough(board, co.from, co.to, (getSquareByID(board, from).name === "Knight"));;
}

function canMoveThrough(board, from, to, canJump) {

    if (canJump) {
        return true;
    }

    let low;
    let high;

    if (from.x === to.x) {
        if (from.y > to.y) { low = to.y; high = from.y; } else { low = from.y; high = to.y; }
        for (let i = (low + 1); i < high; i++) {
            if (board[i][from.x].name !== "Free") { return false; }
        }
    }

    if (from.y === to.y) {
        if (from.x > to.x) { low = (to.x + 1); high = from.x; } else { low = (from.x + 1); high = to.x; }
        for (let i = low; i < high; i++) {
            if (board[from.y][i].name !== "Free") { return false; }
        }
    }
    let xDif = from.x - to.x;
    let yDif = from.y - to.y;

    if (xDif < 0) { xDif = xDif * -1; }
    if (yDif < 0) { yDif = yDif * -1; }

    if (xDif === yDif) {
        let xAdd = 0;
        let yAdd = 0;
        for (let i = 1; i < xDif; i++) {
            if (from.x < to.x) { xAdd++; } else { xAdd--; }
            if (from.y < to.y) { yAdd++; } else { yAdd--; }
            if (board[from.y + yAdd][from.x + xAdd].name !== "Free") { return false; }
        }
    }
    return true;
}


function move() {

    console.log("move excecuted")

    let co = combineCoordinates(coordinate.from, coordinate.to);

    mainBoard[co.to.y][co.to.x] = mainBoard[co.from.y][co.from.x];
    mainBoard[co.from.y][co.from.x] = fr;

}


function pawnMove(x, y, color, isTaking, currentRow) {

    let firstMove = ((currentRow === 1) || (currentRow === 6));

    let moveX;

    if (color === "black") {
        moveX = 1;
    } else {
        moveX = -1;
    }

    if (isTaking) {
        if (y == 1) {
            if (x == moveX) {
                return true;
            }
        }
        if (y == -1) {
            if (x == moveX) {
                return true;
            }
        }
    }

    if (!isTaking)
        if (y == 0) {
            if (firstMove) {
                if (x == (moveX * 2)) {

                    return true;
                }
            }
            if (x == (moveX)) {
                return true;
            }
        }
    return false;
}

function rookMove(x, y) {

    if (x == 0)
        if (y != 0)
            return true;

    if (y == 0)
        return x != 0;

    return false;

}

function knightMove(x, y) {

    if (x < 0) { x = x * -1; }
    if (y < 0) { y = y * -1; }

    if (x == 1)
        if (y == 2)
            return true;

    if (y == 1)
        if (x == 2)
            return true;

    return false;

}

function bishopMove(x, y) {

    if (x < 0) { x = x * -1; }
    if (y < 0) { y = y * -1; }

    return x == y;

}

function queenMove(x, y) {

    if (x == 0)
        if (y != 0)
            return true;

    if (y == 0)
        if (x != 0)
            return true;

    if (x < 0) { x = x * -1; }
    if (y < 0) { y = y * -1; }

    return x == y;

}

function kingMove(x, y) {

    let move = 1;

    if (x < 0) { x = x * -1; }
    if (y < 0) { y = y * -1; }

    if (x <= move && y <= move)
        return true;

    return false;
}

// Utility functions //

function idToIndex(id) {

    let indexList = Array.from(id);
    indexList[0] = letterArray.indexOf(indexList[0]);
    indexList[1] = parseInt(indexList[1]) - 1;

    return indexList;
}

function getSquareByID(board, id) {

    let indexList = Array.from(id);
    indexList[0] = letterArray.indexOf(indexList[0]);
    indexList[1] = parseInt(indexList[1]) - 1;

    return board[indexList[1]][indexList[0]];

}

function applyColor(id) {

    let validMove;

    let ar = idToIndex(id);

    if (ar[1] % 2 === 0) {
        if (ar[0] % 2 === 0) {
            validMove = "validMoveBlack";
        } else {
            validMove = "validMoveWhite";
        }


    } else {
        if (ar[0] % 2 === 0) {
            validMove = "validMoveWhite";
        } else {
            validMove = "validMoveBlack";
        }
    }

    return validMove;

}

function combineCoordinates(from, to) {

    let fromAr = Array.from(from);
    let toAr = Array.from(to);
    fromAr[0] = letterArray.indexOf(fromAr[0]);
    fromAr[1] = parseInt(fromAr[1]) - 1;
    toAr[0] = letterArray.indexOf(toAr[0]);
    toAr[1] = parseInt(toAr[1]) - 1;

    return { from: { id: from, x: fromAr[0], y: fromAr[1] }, to: { id: to, x: toAr[0], y: toAr[1] } };

}

// Rules fuctions

function passTurn() {
    if (turn === "white") {
        turn = "black";
        notTurn = "white";
        document.getElementById("board").classList.add("blackTurn");
    } else {
        turn = "white";
        notTurn = "black";
        document.getElementById("board").classList.remove("blackTurn");
    }
}

function showValidMove(id) {
    if (coordinate.from === "") {
        document.getElementById(id).classList.remove(applyColor(id));
    } else {
        if (validateMove(mainBoard, coordinate.from, id)) {
            document.getElementById(id).classList.add(applyColor(id));
        }
    }
}

// RUN GAME // 

updateBoard();
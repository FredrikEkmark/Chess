"use strict";

// Declaring the Pieces and Free space const variables //

const pB = { name: "Pawn", notation: "P", color: "black", img: "<img class='piece' src='m/pB.svg'></img>", move: pawnMove(), startRow: 6 };
const rB = { name: "Rook", notation: "R", color: "black", img: "<img class='piece' src='m/rB.svg'></img>", move: rookMove(), startRow: 7 };
const nB = { name: "Knight", notation: "N", color: "black", img: "<img class='piece' src='m/nB.svg'></img>", move: knightMove(), startRow: 7 };
const bB = { name: "Bishop", notation: "B", color: "black", img: "<img class='piece' src='m/bB.svg'></img>", move: bishopMove(), startRow: 7 };
const qB = { name: "Queen", notation: "Q", color: "black", img: "<img class='piece' src='m/qB.svg'></img>", move: queenMove(), startRow: 7 };
const kB = { name: "King", notation: "K", color: "black", img: "<img class='piece' src='m/kB.svg'></img>", move: kingMove(), startRow: 7 };

const pW = { name: "Pawn", notation: "P", color: "white", img: "<img class='piece' src='m/pW.svg'></img>", move: pawnMove(), startRow: 1 };
const rW = { name: "Rook", notation: "R", color: "white", img: "<img class='piece' src='m/rW.svg'></img>", move: rookMove(), startRow: 0 };
const nW = { name: "Knight", notation: "K", color: "white", img: "<img class='piece' src='m/nW.svg'></img>", move: knightMove(), startRow: 0 };
const bW = { name: "Bishop", notation: "B", color: "white", img: "<img class='piece' src='m/bW.svg'></img>", move: bishopMove(), startRow: 0 };
const qW = { name: "Queen", notation: "Q", color: "white", img: "<img class='piece' src='m/qW.svg'></img>", move: queenMove(), startRow: 0 };
const kW = { name: "King", notation: "K", color: "white", img: "<img class='piece' src='m/kW.svg'></img>", move: kingMove(), startRow: 0 };

const fr = { name: "Free", notation: "", color: "", img: "", move: "No Move" };

// Declaring variables //

const letterArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
let coordinateLetter;
let coordinateNumber;
let htmlSquare;

let turn = "white"

let coordinate = { from: "", to: "" }

// Declaring the boards and adding eventlisteners //

let board = [
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

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            htmlSquare = indexToId(i, j,)
            document.getElementById(htmlSquare).innerHTML = board[i][j].img;
            showValidMove(htmlSquare);
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
            declareMove(coordinate.from, coordinate.to)
        }
    } else {
        let idIndex = idToIndex(clicked_id)
        if (board[idIndex[1]][idIndex[0]].color === turn) {
        coordinate.from = clicked_id;
        document.getElementById(clicked_id).classList.add("marked");
        }
    }
    updateBoard();
}

function declareMove(from, to) {

    console.log("Move from " + from + " to " + to);
    console.log("Valid Move: " + validateMove(from, to));
    move(from, to);

    document.getElementById(from).classList.remove("marked");
    coordinate.from = "";
    coordinate.to = "";
    passTurn();

}

function validateMove(from, to) {

    let co = combineCoordinates(from, to)

    if (from === to) {
        return false;
    }

    if (getSquareByID(from).color === getSquareByID(to).color) {
        return false;
    }

    let fromIndexAr = idToIndex(from);
    let toIndexAr = idToIndex(to);

    let x = fromIndexAr[1] - toIndexAr[1];

    let y = fromIndexAr[0] - toIndexAr[0];

    let pieceMove = true;

   switch (board[fromIndexAr[1]][fromIndexAr[0]].name) {
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
            pieceMove = pawnMove(x, y, getSquareByID(from).color, getSquareByID(to).name !== "Free", fromIndexAr[1]);
            break;
        default:
            pieceMove = false;
    }

    if (pieceMove) {
        return canMoveThrough(co.from, co.to, (getSquareByID(from).name === "Knight"));
    }

    return false;
}

function canMoveThrough(from, to, canJump) {

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


function move(from, to) {

    let co = combineCoordinates(from, to);

    board[co.to.y][co.to.x] = board[co.from.y][co.from.x];
    board[co.from.y][co.from.x] = fr;
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

function indexToId(i, j,) {

    coordinateLetter = letterArray[j];
    coordinateNumber = (i + 1);
    let id = coordinateLetter + coordinateNumber;

    return id;
}

function idToIndex(id) {

    let indexList = Array.from(id);
    indexList[0] = letterArray.indexOf(indexList[0]);
    indexList[1] = parseInt(indexList[1]) - 1;

    return indexList;
}

function getSquareByID(id) {

    let indexList = Array.from(id);
    indexList[0] = letterArray.indexOf(indexList[0]);
    indexList[1] = parseInt(indexList[1]) - 1;

    return board[indexList[1]][indexList[0]];

}

function showValidMove(id) {
    if (coordinate.from === "") {
        document.getElementById(id).classList.remove(applyColor(id));
    } else {
        if (validateMove(coordinate.from, id)) {
            document.getElementById(id).classList.add(applyColor(id));
        }
    }
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

    return { from: { x: fromAr[0], y: fromAr[1] }, to: { x: toAr[0], y: toAr[1] } };

}

function passTurn() {
    if (turn === "white") {
        turn = "black";
        document.getElementById("board").classList.add("blackTurn");
    } else {
        turn = "white";
        document.getElementById("board").classList.remove("blackTurn");
    }
}

// RUN GAME // 

updateBoard();

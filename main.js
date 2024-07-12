
var game = new Chess()
var board = null;
var CHECKMATE = 5000;
var BOARD_SIZE = 64;
var DEPTH = 3;
let nextMove = null;

const knightBishopSquareTable = {
  'a1': -50, 'b1': -40, 'c1': -30, 'd1': -30, 'e1': -30, 'f1': -30, 'g1': -40, 'h1': -50,
  'a2': -40, 'b2': -20, 'c2': 0, 'd2': 0, 'e2': 0, 'f2': 0, 'g2': -20, 'h2': -40,
  'a3': -30, 'b3': 0, 'c3': 10, 'd3': 15, 'e3': 15, 'f3': 10, 'g3': 0, 'h3': -30,
  'a4': -30, 'b4': 5, 'c4': 15, 'd4': 20, 'e4': 20, 'f4': 15, 'g4': 5, 'h4': -30,
  'a5': -30, 'b5': 0, 'c5': 15, 'd5': 20, 'e5': 20, 'f5': 15, 'g5': 0, 'h5': -30,
  'a6': -30, 'b6': 5, 'c6': 10, 'd6': 15, 'e6': 15, 'f6': 10, 'g6': 5, 'h6': -30,
  'a7': -40, 'b7': -20, 'c7': 0, 'd7': 5, 'e7': 5, 'f7': 0, 'g7': -20, 'h7': -40,
  'a8': -50, 'b8': -40, 'c8': -30, 'd8': -30, 'e8': -30, 'f8': -30, 'g8': -40, 'h8': -50
};

// onDragStart helps keep the board in correct shape by denying the humans access to pick up black pieces or if the game is over
function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for White because human is playing white
  if (piece.search(/^b/) !== -1) return false
}

// makes a random move
function makeRandomMove() {
  var computer_move = ''
  var possibleMoves = game.moves({ verbose: true });

  // game over
  if (possibleMoves.length === 0)
    return

  // let largestScore = -CHECKMATE;
  var alpha = -CHECKMATE;
  var beta = CHECKMATE;

  minMax(possibleMoves, DEPTH, alpha, beta, true);
  computer_move = nextMove;

  if (computer_move == '') {
    console.log("random")
    var randomIdx = Math.floor(Math.random() * possibleMoves.length)
    game.move(possibleMoves[randomIdx])
  }
  else {
    game.move(computer_move)
  }

  board.position(game.fen());
}

function calculateScore(player) {
  let score = 0;
  let numPosMoves = game.moves({ verbose: true }).length;

  //game.move(move);

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (game.get(game.SQUARES[i]) != null) {
      let type = game.get(game.SQUARES[i]).type;
      let color = game.get(game.SQUARES[i]).color;
      if (color === 'b')
        score += getBoardScore(type, i)
      else if (color === 'w')
        score -= getBoardScore(type, i)
    }
  }
  if (player) {
    if (game.in_check())
      score += 50;
    else if (game.in_checkmate())
      score += CHECKMATE;

    score += numPosMoves * 2
  }

  else {
    if (game.in_check())
      score -= 50;
    else if (game.in_checkmate())
      score -= CHECKMATE;

    score -= numPosMoves * 2
  }

  return score;
}

function getBoardScore(type, i) {
  let boardScore = 0;
  boardScore += captureScore(type);
  if (type === 'n' || type === 'b')
    boardScore += knightBishopSquareTable[game.SQUARES[i]]
  else if (type === 'p') {
    if (game.SQUARES[i] === 'd4' || game.SQUARES[i] === 'd5' ||
      game.SQUARES[i] === 'e4' || game.SQUARES[i] === 'e5')
      boardScore += 20
  }
  else if (type === 'k') {
    if (game.SQUARES[i] === 'h8' || game.SQUARES[i] === 'g8' ||
      game.SQUARES[i] === 'c8' || game.SQUARES[i] === 'b8' ||
      game.SQUARES[i] === 'a8' || game.SQUARES[i] === 'g1' ||
      game.SQUARES[i] === 'h1' || game.SQUARES[i] === 'c1' ||
      game.SQUARES[i] === 'b1' || game.SQUARES[i] === 'a1')
      boardScore += 40;
  }
  return boardScore
}

function captureScore(piece) {
  switch (piece) {
    case 'r': return 500;
    case 'n': return 300;
    case 'b': return 350;
    case 'q': return 2000;
    default: return 100;
  }
}

// checks if human move is legal, then calls function for computer's move
function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  // make random legal move for black
  window.setTimeout(makeRandomMove, 250)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}

function minMax(posMoves, depth, alpha, beta, maximizePlayer) {
  if (depth == 0 || game.game_over()) {
    return calculateScore(maximizePlayer);
  }

  if (maximizePlayer) {
    let maxScore = -CHECKMATE;
    for (let i = 0; i < (posMoves.length); i++) {
      game.move(posMoves[i]);
      let nextMoves = game.moves({ verbose: true });
      let score = minMax(nextMoves, depth - 1, alpha, beta, false);
      game.undo()
      if (score > maxScore) {
        maxScore = score;
        if (depth === DEPTH) {
          nextMove = posMoves[i]
        }
        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha)
          break; // Beta cut-off
      }
    }
    return maxScore
  }
  else {
    minScore = CHECKMATE;
    for (let i = 0; i < (posMoves.length); i++) {
      game.move(posMoves[i]);
      let nextMoves = game.moves({ verbose: true });
      let score = minMax(nextMoves, depth - 1, alpha, beta, true);
      game.undo();
      if (score < minScore) {
        minScore = score;
        if (depth === DEPTH) {
          nextMove = posMoves[i]
        }
        beta = Math.min(beta, minScore);
        if (beta <= alpha)
          break; // Alpha cut-off
      }
    }
    return minScore;
  }
}


// end of functions
// config on chessboard.js
var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
22
// chessboard.js html board representation with ability for human to play white, chess.js functions called inside config
board = Chessboard('myBoard', config)

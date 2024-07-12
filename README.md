# Project Overview

This project is a Chess Engine implemented in JavaScript, featuring an interactive chessboard interface and an AI opponent powered by a Minimax algorithm with alpha-beta pruning.

## Features

- **Interactive Chessboard**: Visual representation of the chessboard with draggable pieces and legal move highlighting.
   
- **AI Opponent**: Implements a computer player using a Minimax algorithm with alpha-beta pruning for efficient move calculation.
  
- **Chess Rules Enforcement**: Handles standard chess rules including castling, en passant, and pawn promotion.

## Components

1. **Chessboard Interface**: Utilizes Chessboard.js for rendering the chessboard and managing user interactions.
   
2. **Game Logic**: Utilizes chess.js to enforce chess rules, validate moves, and manage game state.

3. **AI with Minimax and Alpha-Beta Pruning**: Implements a depth-limited Minimax algorithm enhanced with alpha-beta pruning to optimize the search for the best move.

## Structure

### Files

- `index.html`: HTML structure for the chessboard interface.
- `main.js`: JavaScript file containing game logic, move generation, and AI implementation.

### Dependencies

- `Chessboard.js`: JavaScript library for chessboard visualization.
- `chess.js`: JavaScript library for chess move generation and validation.

## Demo

Include a screenshot or GIF demonstrating the functionality of your chess engine here, showcasing the interactive chessboard and gameplay.

## Usage

1. Clone the repository

2. Open `index.html` in a web browser to launch the chessboard interface.

3. Play against the computer by making legal moves and observing the computer's response

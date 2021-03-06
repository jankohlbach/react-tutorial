import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let highlight = false;

  if(props.winner === 'X' && props.value === 'X') {
    highlight = true;
  } else if(props.winner === 'O' && props.value === 'O') {
    highlight = true;
  }

  return (
    <button className="square" onClick={() => {props.onClick();}}>
      {highlight ? <mark>{props.value}</mark> : props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i}
      value={this.props.squares[i]}
      onClick={() => {this.props.onClick(i);}}
      winner={this.props.winner}
    />;
  }

  createBoard() {
    let board = [];
    let j = 0;

    for(let i = 1; i <= 3; i++) {
      let squares = [];

      for(j; j < i * 3; j++) {
        squares.push(this.renderSquare(j));
      }

      board.push(<div key={j} className="board-row">{squares}</div>);
    }

    return board;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        box: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let box = current.box;

    switch(i) {
      case 0:
        box = 'row 1, col 1';
        break;
      case 1:
        box = 'row 1, col 2';
        break;
      case 2:
        box = 'row 1, col 3';
        break;
      case 3:
        box = 'row 2, col 1';
        break;
      case 4:
        box = 'row 2, col 2';
        break;
      case 5:
        box = 'row 2, col 3';
        break;
      case 6:
        box = 'row 3, col 1';
        break;
      case 7:
        box = 'row 3, col 2';
        break;
      case 8:
        box = 'row 3, col 3';
        break;
      default:
        break;
    }

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        box: box,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let noWinner = false;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const place = step.box;
      let selected = false;
      if (move === this.state.stepNumber) {
        selected = true;
      }
      if (this.state.stepNumber === 9) {
        noWinner = true;
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {selected ? <b>{desc}<br />{'marked: ' + place}</b> : <span>{desc}<br />{'marked: ' + place}</span>}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (noWinner) {
      status = `It's a draw.`;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

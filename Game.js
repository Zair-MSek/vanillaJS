// first take at Tic-tac-toe using a 3-by-3 board

// get player name
const board = document.querySelector('section.board');
const firstMoverButton = document.querySelector('#first-mover');
const secondMoverButton = document.querySelector('#second-mover');

// handle player name
firstMoverButton.addEventListener('click',setPlayer,false);
secondMoverButton.addEventListener('click',setPlayer,false);

// get name of player and add it to the board
function setPlayer(e){
    e.preventDefault();
    let selector = e.target.id === 'first-mover' ? 'first':'second';
    let input = document.querySelector(`[name="${selector}"]`);
    let playerName = input.value;
    let playerOrder = input.dataset.player;
    addPlayerNameToBoard(playerOrder, playerName)
}

// add play to board
function addPlayerNameToBoard(playerOrder, playerName){

    switch(playerOrder){
        case "1":
            board.dataset.player1 = playerName;
            hideParagraph("first-mover");
            ShowParagraph("second-mover");
            break;

        case "2":
            board.dataset.player2 = playerName;
            hideParagraph("second-mover");

            // start game by adding 'click' event Listener
            // to button
            startGame();
    
            break;

        default:
            return;

    }

}

// class 'hide' triggers css display rule 
function hideParagraph(selector){
    let el = document.querySelector(`p.${selector}`);
    el.classList.add('hide');
}

function ShowParagraph(selector){
   let el = document.querySelector(`p.${selector}`);
    el.classList.remove('hide'); 
}

// create board class
class TicTacToe {

    constructor(board){
        this.board = board;
    }

    // player sign
    xo = {"player1": "X", "player2":"O"};

    // score value
    scoreValue = {"player1": 1,"player2": -1};

    // create scorecard
    // board game reference and array position
    // col 1 to 3 correspond to position 0-2 in array score
    // row 1 to 3 correspond to position 3-5 in array score
    // edge 1 (north-west) corresponds to position 6 in array score
    // edge 2 (south-west) corresponds to position 7 in array score
    score = [0,0,0,0,0,0,0,0]

    // who's playing now
    get player(){         
        return board.dataset.move;
    }

    
    // who's playing next
    set player(player){
        board.dataset.move = player === "player1" ? "player2" : "player1";
    }

    // check for winner
    isWinner(){

        let winner1 = this.score.includes(3);
        let winner2 = this.score.includes(-3);
        let winner;
        switch(true){

            case winner1:
                winner = "player1";
                break;
            
            case winner2:
                winner = "player2";
                break;

            default:
                winner = false;

        }

        return winner;
    }


    // instruct player to play
    displayInstructionMessage(player){
        let instructions = document.querySelector('.instructions');
        let message = `It's now <span>${player}'s</span> turn. Make you more!`;
        instructions.innerHTML = message;
        instructions.classList.remove('hide');
    }

    // record play
    capturePlay(player, el){

        // get data
        let row = el.dataset.row;
        let col = el.dataset.col;
        let val = this.scoreValue[`${player}`];
        let type = this.cellType(row,col);

        // score play
        this.scorePlay(player, parseInt(row), parseInt(col), type);

        // ---------- uncomment line below to see 
        // ---------- the logic for updating score. 
        // console.log(this.score);
    }

    // the edge, center and regular cell references work well for a 3-by-3 board
    // for higher dimension matrix, the references need to better capture adjacent cells
    cellType(row, col){
        let type;
        switch(row){
            case "1":
            case "3":
                type = (col === "1" || col === "3") ? 'edge': 'regular';
                break;

            case "2":
                type = (col === "2") ? 'center': 'regular';
                break;

            default:
                return 'regular';

        }
        
        return type;
    }

    // score play by modifying score array;
    // this approach works well for a 3-by-3 matrix
    // for higher dimension matrix, a better approach is needed
    // update coming soon.
    scorePlay(player, row, col, type){

        switch(type){
            
            case 'center':
                this.score[1] += this.scoreValue[`${player}`];
                this.score[4] += this.scoreValue[`${player}`];
                this.score[this.score.length-2] += this.scoreValue[`${player}`];
                this.score[this.score.length-1] += this.scoreValue[`${player}`];            
                break;

            case 'edge':
                this.score[col-1] += this.scoreValue[`${player}`];
                this.score[2+row] += this.scoreValue[`${player}`];
                let edge = col === row ? this.score.length - 1 : this.score.length - 2;
                this.score[edge] += this.scoreValue[`${player}`];
                break;

            default:
                this.score[col-1] += this.scoreValue[`${player}`];
                this.score[2+row] += this.scoreValue[`${player}`];
        }
    }

    showWinningPlay(player){
        let lookUpValue = player === 'player1' ? 3:-3;
        let strategy = this.score.indexOf(lookUpValue);
        
        // see array definition
        // status 'winner' triggers css rule
        // clean-up
        if(strategy < 3){

            let entries = document.querySelectorAll(`[data-col="${strategy + 1}"]`);
            for(let i = 0; i < entries.length; i++){
                entries[i].dataset.status = 'winner';
            }

        } else if(strategy >= 3 && strategy <= 5) {

            let entries = document.querySelectorAll(`[data-row="${strategy - 2}"]`);
            for(let i = 0; i < entries.length; i++){
                entries[i].dataset.status = 'winner';
            }

        } else {

            if(strategy === 6){
                document.querySelector('[data-col="1"][data-row="3"]').dataset.status = 'winner';
                document.querySelector('[data-col="2"][data-row="2"]').dataset.status = 'winner';
                document.querySelector('[data-col="3"][data-row="1"]').dataset.status = 'winner';
            }

            if(strategy === 7){
                document.querySelector('[data-col="1"][data-row="1"]').dataset.status = 'winner';
                document.querySelector('[data-col="2"][data-row="2"]').dataset.status = 'winner';
                document.querySelector('[data-col="3"][data-row="3"]').dataset.status = 'winner';
            }

        }
    }

}

// ----------------------------------------------------------
// ------------------------------------------- it's game time
// ----------------------------------------------------------

const t3 = new TicTacToe(board);

// starts game by adding 'click' listener to button
// once both players have entered their names.
function startGame(){
    let button = document.querySelectorAll('[data-row]');
    for(i = 0; i < button.length; i++){
        button[i].addEventListener('click', playGame, false);
    }
    board.dataset.move="player1";
    board.dataset.game="start";
    t3.displayInstructionMessage(board.dataset[t3.player]);

}

// end game by removing 'click' listener.
function endGame(player){

    // remove listener
    let button = document.querySelectorAll('[data-status="open"]');
    for(i = 0; i < button.length; i++){
        button[i].removeEventListener('click', playGame, false);
        button[i].dataset.status="over";
    }
    
    // add congrats message
    let instructions = document.querySelector('.instructions');
    let message = `Congrats <span>${player}</span>. You won!`;
    instructions.innerHTML = message;

    // option to play again
    let btnReload = document.createElement('button');
    btnReload.textContent = "Play again!";
    btnReload.setAttribute("class","reload");
    btnReload.addEventListener(
        'click'
        ,()=>{location.reload()}
        ,false);
    instructions.appendChild(btnReload);

    // 'over' triggers css rules
    board.dataset.game="over";
   
}
   
// game
function playGame(e){

    let el = e.target;
    el.removeEventListener("click", playGame);
    
    // add play "X" for player1 and "O" for player2
    el.textContent = t3.xo[t3.player];
    el.dataset.status = 'close';
    el.dataset.move = `${t3.player}`;

    // capture the play and remove event
    t3.capturePlay(t3.player, el);

    // check if there a winner
    if(t3.isWinner()){

        let winner = t3.board.dataset[t3.isWinner()];

        // game over
        endGame(winner);

        t3.showWinningPlay(t3.isWinner());

    } else {

        // set next player
        t3.player = t3.player;

        // display play instruction
        t3.displayInstructionMessage(board.dataset[t3.player]);

    }
      
}


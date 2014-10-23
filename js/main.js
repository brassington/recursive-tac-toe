"use strict";

// An immediately invoked function expression to prevent global-scope collisions
(function() {

// Reference to game container
var wrapper = document.querySelector(".wrapper");

// Game function with two methods, X and O hold SVG vector graphic strings
var Game = function() {
  var turn = true;
  var currentBoard = undefined;
  var target = undefined;

  var X = '<svg xmlns="http://www.w3.org/2000/svg" class="cancel" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128" enable-background="new 0 0 128 128">    <path d="M72.282,64.867l40.057-40.057c2.299-2.299,2.299-6.018,0-8.313c-2.294-2.299-6.014-2.299-8.313,0L63.97,56.554  L23.908,16.497c-2.295-2.299-6.018-2.299-8.313,0c-2.295,2.295-2.295,6.014,0,8.313l40.061,40.057l-40.061,40.061  c-2.295,2.295-2.295,6.018,0,8.313c1.15,1.15,2.653,1.722,4.156,1.722c1.504,0,3.007-0.572,4.157-1.722L63.97,73.18l40.057,40.062   c1.15,1.15,2.653,1.722,4.156,1.722c1.509,0,3.012-0.572,4.157-1.722c2.299-2.295,2.299-6.018,0-8.313L72.282,64.867z"/> </svg>';
  var O = '<svg xmlns="http://www.w3.org/2000/svg" class="Layer_1" x="0px" y="0px" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128" enable-background="new 0 0 128 128"> <path d="M64,11.7c-28.9,0-52.3,23.5-52.3,52.3c0,28.9,23.5,52.4,52.3,52.4s52.3-23.5,52.3-52.4 C116.3,35.1,92.9,11.7,64,11.7z M64.3,104.2c-22.2,0-40.2-18-40.2-40.2s18-40.2,40.2-40.2s40.2,18,40.2,40.2 C104.5,86.2,86.4,104.2,64.3,104.2z" fill="#010101"/> </svg>';

  // playPiece tests the target of each click or touch to match a play on a subboard
  // DOM traversal is handled by references to parentNodes
  this.playPiece = function(event) {
    target = event.target;
    var currentBoardNode = document.querySelector('.current-board');
    var twoNodesUp = target.parentNode.parentNode;
    var threeNodesUp = target.parentNode.parentNode.parentNode;

    // Check if currently highlighted square has already won, allow play anywhere
    if (currentBoardNode) {
      if (currentBoardNode.children[0].tagName === 'svg') currentBoard = undefined;
    }

    // Check target node is a playable node, not already full, and is avilable for play
    if (target.classList.contains('container') && twoNodesUp !== wrapper) {
      if (!target.classList.contains('X') || !target.classList.contains('O')) {
        if (threeNodesUp.classList.contains(currentBoard) || currentBoard === undefined) {
          // Remove previous currentBoard class background highlight
          if (currentBoardNode) {
            currentBoardNode.classList.remove('current-board');
          }
          // Set the next board available for play          
          currentBoard = target.classList[target.classList.length-1];
          // Fill space with X or O, add add corresponding className
          target.innerHTML += (turn) ? X: O;
          target.classList.add((turn) ? 'X': 'O');
          // Toggle to other player's turn
          turn = !turn;
          // Find all possible currentBoards, only highlight correct game
          [].slice.call(document.querySelectorAll('.'+currentBoard)).forEach(
            function(item) {
              if (item.parentNode.parentNode === wrapper) {
                item.classList.add('current-board');
              }
            }
          );
          // Check to see if player won
          this.checkWin();
        }
      }
    }
  }

  // checkWin checks 8 possible winning scenerios on each click and replaces with winning
  // X or O to indicate which player won the square.
  this.checkWin = function() {
    // Create reference to all siblings, replace with last added class: either X or O
    var siblings = [].slice.call(target.parentNode.children);
    siblings.forEach(function(item, iterator) {
      siblings[iterator] = item.classList[item.classList.length-1]
    });
    // Check winning scenerios
    if (siblings[0] === siblings[1] && siblings[1] === siblings[2] ||
        siblings[3] === siblings[4] && siblings[4] === siblings[5] ||
        siblings[6] === siblings[7] && siblings[7] === siblings[8] ||
        siblings[0] === siblings[3] && siblings[3] === siblings[6] ||
        siblings[1] === siblings[4] && siblings[4] === siblings[7] ||
        siblings[2] === siblings[5] && siblings[5] === siblings[8] ||
        siblings[0] === siblings[4] && siblings[4] === siblings[8] ||
        siblings[2] === siblings[4] && siblings[4] === siblings[6] ){
      // Replace contents of board with corresponding winning X or O
      target.parentNode.parentNode.parentNode.innerHTML = (turn) ? O: X;
    }
  }
}

// Instantiate game and attach event listers on page load
var game = new Game();
wrapper.addEventListener("click", game.playPiece.bind(game));
wrapper.addEventListener("touch", game.playPiece.bind(game));

})();
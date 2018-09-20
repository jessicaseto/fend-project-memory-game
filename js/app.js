// Start the game timer
const timer = document.querySelector('.timer');
const timerId = runTimer(timer);

/*
 * Create a list that holds all of your cards
 */
// Array cards
const cards = ['diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb','diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb'];

/*
 * Array for open card symbols
 * Hold 2 cards at a time
 * Global scope used for event listener access
 */
let openCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
 // Store deck in a variable (unordered list)
const deck = document.querySelector('.deck');

/*
 * Add counters for number of moves and number of matches
 * Store element with class name 'moves'
 */
let moveCounter = 0;
let matchCounter = 0;
const movesElement = document.querySelector('.moves');
movesElement.innerHTML = moveCounter;

// Store the winning modal & modal elements in variables
const winningModal = document.querySelector('.win-modal');
//const closeModal = winningModal.querySelector('.modal-close');
displayWinningModal(winningModal, moveCounter, 3);

// Shuffle cards
shuffle(cards);

// Loop through the card array and create HTML blocks
const deckFragment = document.createDocumentFragment();

cards.forEach(function (card) {
    // Create a new list item for each card
    const newCard = document.createElement('li');
    newCard.className = 'card';

    // Add icon to list item
    const icon = document.createElement('i');
    icon.className = 'fa fa-' + card;
    newCard.appendChild(icon);

    // Add created card to deck document fragment
    deckFragment.appendChild(newCard);
});

// Append the deck document fragment to the deck UL
deck.appendChild(deckFragment);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
deck.addEventListener('click', function(event) {
    // First, check if a card was clicked, is not already open, and openCards contains less than 2 cards
    if (event.target.nodeName === 'LI' && !event.target.classList.contains('open') && (openCards.length < 2)) {
        const selectedCard = event.target;

        // Display the card's symbol
        displayCardSymbol(selectedCard);

        // Add the card to a list of open cards
        addToOpenCards(selectedCard, openCards);

        // If the list of cards is not empty and there are an even number of cards in the list
        if(openCards.length != 0 && openCards.length % 2 === 0) {
            // Increment the move counter
            moveCounter++;

            // Display the new move count
            movesElement.innerHTML = moveCounter;

            // Add a delay so the card's symbol shows
            setTimeout(function() {
                // Check if the last 2 cards are a match
                if(openCards[openCards.length-1].firstChild.classList[1] === openCards[openCards.length-2].firstChild.classList[1]) {
                    displayMatch(openCards);
                    removeLastTwoCards(openCards);
                    matchCounter++;
                    if (matchCounter === 8) {
                        //displayWinningModal(winningModal, moveCounter, 3);
                        stopTimer(timerId);
                    }
                } else { // Remove the last 2 cards from the card list and hide them
                    displayMismatch(openCards);
                    setTimeout(function() {
                        removeMismatch(openCards);
                        hideLastTwoCards(openCards);
                        removeLastTwoCards(openCards);
                    }, 500);
                }
            }, 500);
        }
    }
});

/*
 * Event listener for winning modal
 */
winningModal.addEventListener('click', function(event) {
    // If close modal button is clicked, toggle winning modal display
    if (event.target.classList.contains('close')) {
        winningModal.style.display = 'none';
    }

    // If replay button is clicked, run replay function
});

// Function to display a card's symbol
function displayCardSymbol(card) {
    // To display a card's symbol, we need to add classes 'open' and 'show'
    card.classList.add('open', 'show');
}

// Function to add a card to a list of open cards
function addToOpenCards(card, cardList) {
    cardList.push(card);
}

// Function to display two matching cards as matched
function displayMatch(cardList) {
    if(cardList.length >= 2) {
        cardList[cardList.length-1].classList.add('match');
        cardList[cardList.length-2].classList.add('match');
    }
}

// Function to display a mismatch between two cards
function displayMismatch(cardList) {
    if(cardList.length >= 2) {
        cardList[cardList.length-1].classList.add('mismatch');
        cardList[cardList.length-2].classList.add('mismatch');
    }
}

// Function to remove a mismatch between two cards
function removeMismatch(cardList) {
    if(cardList.length >= 2) {
        cardList[cardList.length-1].classList.remove('mismatch');
        cardList[cardList.length-2].classList.remove('mismatch');
    }
}

// Function to hide the last two cards from the list
function hideLastTwoCards(cardList) {
    if(cardList.length >= 2) {
        // Remove 'open' and 'show' classes
        cardList[cardList.length-1].classList.remove('open', 'show');
        cardList[cardList.length-2].classList.remove('open', 'show');
    }
}

// Function to remove the last two cards from the card list
function removeLastTwoCards(cardList) {
    if(cardList.length >= 2) {
        // Pop the last 2 elements from the array
        cardList.pop();
        cardList.pop();
    }
}

// Function to display the winning modal
function displayWinningModal (modal, numMoves, numStars) {
    // Change to unhidden
    modal.style.display = 'block';

    // Display the number of moves
    modal.querySelector('.moves').innerHTML = numMoves;
    console.log( modal.querySelector('.moves'));

    // Display the star rating
    const starDisplay = modal.querySelector('.stars');
    const docFrag = document.createDocumentFragment();

    for(i=1; i<=numStars; i++) {
        const newStar = document.createElement('li');
        const icon = document.createElement('i');
        icon.classList = 'fa fa-star';
        newStar.appendChild(icon);

        newStar.style.display = 'inline-block';
        newStar.style.listStyle = 'none';
        docFrag.appendChild(newStar);
    }

    starDisplay.appendChild(docFrag);

    // Display the final timer
    modal.querySelector('.hours').innerHTML = document.querySelector('.timer-hours').innerHTML;
    modal.querySelector('.minutes').innerHTML = document.querySelector('.timer-minutes').innerHTML;
    modal.querySelector('.seconds').innerHTML = document.querySelector('.timer-seconds').innerHTML;
}

// Function to count seconds
function runTimer(timer) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    // Add an interval for counting seconds
    const timerId = setInterval(function() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }
        // Display the hours, minutes, and seconds elapsed
        timer.querySelector('.timer-hours').innerHTML = hours;
        timer.querySelector('.timer-minutes').innerHTML = minutes;
        timer.querySelector('.timer-seconds').innerHTML = seconds;
    }, 1000);

    return timerId;
}

// Function to stop timer
function stopTimer(timerId) {
    clearTimeout(timerId);
}
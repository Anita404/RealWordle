const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;

async function init() {
    let currentGuess = '';
    let currentRow = 0;

    const word = await fetchWordOfTheDay();

    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            /// replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            // do nothing 
            return;
        }

        const wordParts = word.split("");
        const guessParts = currentGuess.split("");

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] == wordParts[i]) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('correct');
            }
            else if (wordParts.includes(guessParts[i])) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('close');
            }
            else {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong');
            }
        }
        // TODO: validate the word

        //TODO: do all the marking as "correct", "close" or "wrong"

        // TODO: did they win or lose?

        currentRow++;
        currentGuess = "";
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[currentGuess.length].innerText = "";
    }

    document.addEventListener("keydown", (event) => {
        const action = event.key;

        if (action == 'Enter') {
            commit()
        } else if (action == 'Backspace') {
            backspace()
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        }
    })

}


function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function fetchWordOfTheDay() {
    const response = await fetch("https://words.dev-apis.com/word-of-the-day");
    const data = await response.json();


    const word = data.word.toUpperCase();
    setLoading(false);

    return word;
}

function setLoading(isLoading) {
    loadingDiv.classList.toggle('hidden', !isLoading);
}

init()


/* another approach but does not work for letters: 
switch (action) {
    case 'Enter':
        commit();
        break;
    case 'Backspace':
        backspace();
        break; */

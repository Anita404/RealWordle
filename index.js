const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

let done = false;
let isLoading = true;

async function init() {
    let currentGuess = '';
    let currentRow = 0;

    const word = await fetchWordOfTheDay();


    function markInvalidWord() {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[ANSWER_LENGTH * currentRow + i].classList.add('invalid');
        }
    }

    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            /// replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }


    async function validateWord(currentGuess) {
        isLoading = true;
        setLoading(true);

        const response = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({ word: currentGuess }),
        });

        const { validWord } = await response.json();

        isLoading = false;
        setLoading(false);

        if (!validWord) {
            markInvalidWord();
            return;
        }
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            // do nothing 
            return;
        }

        const wordParts = word.split("");
        const guessParts = currentGuess.split("");

        await validateWord(currentGuess);

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

        currentRow++;


        if (currentGuess == word) {
            alert("YOU WIN!");
            done = true;
            document.querySelector('.brand').classList.add("winner");
            return;
        }

        if (currentRow == ROUNDS) {
            alert(`YOU LOST, the word was ${word}`);
            done = true;
            return;
        }

        currentGuess = "";
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }

    document.addEventListener("keydown", (event) => {
        if (done || isLoading) {
            //do nothing
            return;
        }
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
    isLoading = false;

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

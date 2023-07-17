const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelectorAll(".info-bar");

async function init() {

    document.addEventListener("keydown", (event) => {
        const action = event.key;

        if (action == 'Enter') {
            commit()
        } else if (action == 'Backspace') {
            backspace()
        } else if (isLetter(action)) {
            addLetter(action)
        }
    })
}

init()


/* another approach but does not work for letters: 
switch (action) {
    case 'Enter':
        commit();
        break;
    case 'Backspace':
        backspace();
        break;

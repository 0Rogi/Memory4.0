const text = document.getElementById(`advise`);
const button = document.getElementById(`startButton`);

let points = 0;
const title = document.getElementById(`title`);
let found = [];

button.addEventListener(`click`, () => {
    start();
    shuffle();
});

const cards = document.getElementsByClassName(`card`);
let lastClick = undefined;
let clicked = false;
let foundAI = false;

for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener(`click`, e => {

        let divs = document.getElementsByClassName(`card`);
        divs = Array.from(divs)
        if (divs.find(x => x.style.border)) {
            for (let i = 0; i < 18; i++) {
                if (divs[i].style.border) divs[i].style.border = ``;
            }
        }

        if (lastClick == e.target) return getAdvise(`non puoi abbinare la stessa carta`);

        if (e.target.style.background == `transparent`) return;

        if (!e.target.id) {
            getAdvise(`devi prima mescolare le carte`);
            window.scrollTo(0, 0);
            return;
        }

        e.target.style.transform = `rotateY(180deg)`;
        setTimeout(() => {
            e.target.style.transform = ``;
            e.target.style.backgroundImage = `url('imgs/minigame/${e.target.id}.png')`;
        }, 125);

        setTimeout(() => {
            if (lastClick == e.target) return getAdvise(`non puoi abbinare la stessa carta`);

            if (clicked) {

                if (lastClick == e.target) return getAdvise(`non puoi abbinare la stessa carta`);

                if (lastClick.id == e.target.id) {
                    points += 20;

                    getAdvise(`abbinamento corretto`);

                    lastClick.style.background = `transparent`;
                    e.target.style.background = `transparent`;

                    lastClick.style.boxShadow = `0px 0px 0px`;
                    e.target.style.boxShadow = `0px 0px 0px`;

                    lastClick.style.cursor = `default`;
                    e.target.style.cursor = `default`;

                    found.push(lastClick.id);
                    found.push(e.target.id);

                    if (lastClick.id == 4 && e.target.id == 4 && found.length < 16) {
                        popup(`Le carte sono state mescolate!`);
                        shuffle();
                    }
                    if (lastClick.id == 2 && e.target.id == 2) {
                        popup(`Alla prossima carta riceverai un aiuto ;)`)
                        foundAI = true;
                    }

                    if (found.length >= 18) {
                        title.style.fontSize = `50px`;
                        title.textContent = `HAI ${points > 0 ? `VINTO` : `PERSO`} CON ${points} PUNTI!`;
                        window.scrollTo(0, 0);
                    }

                } else {
                    points -= 5;

                    getAdvise(`abbinamento sbagliato`);

                    lastClick.style.backgroundImage = `url('imgs/minigame/behind.png')`;
                    e.target.style.backgroundImage = `url('imgs/minigame/behind.png')`;
                }

                lastClick = undefined;
                clicked = false;
                return;
            }

            if (!clicked) {
                lastClick = e.target;
                clicked = true;

                if (foundAI) {
                    let id = e.target.id;

                    let divs = document.getElementsByClassName(`card`);
                    divs = Array.from(divs);

                    const doneDivs = [];

                    divs.find(x => x.id == id && x != e.target).style.border = `gold ridge 5px`;

                    for (let i = 0; i < divs.length; i++) {

                        if (divs[i].style.background == `transparent` || divs[i].id == id) continue;

                        if (doneDivs.length == 2) break;

                        if (Math.round(Math.random()) == 1) {
                            divs[i].style.border = `gold ridge 5px`;
                            doneDivs.push(divs[i]);
                        }
                    }

                    foundAI = false;
                }
            }
        }, 700);
    });
}

setInterval(() => {
    if (found.length < 18) title.textContent = `PUNTI: ${points}`;
}, 1000);

function getAdvise(content) {
    text.textContent = content;
    setTimeout(() => {
        text.textContent = ` `;
    }, 2000);
}

function shuffle() {
    const divs = document.getElementsByClassName(`card`);
    const doneDivs = [];

    let i = 1;
    let increment = true;
    do {
        increment = true;
        for (let j = 0; j < 2; j++) {

            if (found.includes(i.toString())) {
                i++;
                increment = false;
                break;
            }

            let divToUse = undefined;

            do {
                divToUse = divs[Math.floor(Math.random() * divs.length)];
            } while (doneDivs.includes(divToUse) || divToUse.style.background == `transparent`);

            divToUse.id = i;
            doneDivs.push(divToUse);
        }

        if (increment) i++;
    } while (doneDivs.length != 18 - found.length);

    getAdvise(`le carte sono state mescolate`);
}

function start() {
    found = [];
    points = 0;
    lastClick = undefined;
    clicked = false;

    title.style.fontSize = ``;

    const divs = document.getElementsByClassName(`card`);

    for (let i = 0; i < divs.length; i++) {
        divs[i].style.backgroundImage = `url('imgs/minigame/behind.png')`;
        divs[i].style.boxShadow = `10px 10px 10px black`;
        divs[i].style.cursor = `pointer`;
    }
}

function popup(description) {
    const box = document.getElementById(`popup`);
    console.log(box)
    const descriptionText = document.getElementById(`description`);

    box.style.visibility = `visible`;
    box.style.opacity = `1`;
    descriptionText.textContent = description;
}

document.getElementById(`close`).addEventListener(`click`, () => {
    document.getElementById(`popup`).style.visibility = `hidden`;
    document.getElementById(`popup`).style.opacity = `0`;
});
let balance;
let chosenDriver = {};
let bonus1 = false;
let bonus2 = false;
let bonus3 = false;
let opponentBonus2 = {};
let opponentBonus3 = {};

const drivers = [
    {
        name: "LeClerc",
        position: 0,
        element: document.getElementById("driver1"),
        photo: "../../assets/Drivers/leclerc.png",
        car: "../../assets/Cars/ferrari.png",
        background: "#f34238"
    },
    {
        name: "Max Verstappen",
        position: 0,
        element: document.getElementById("driver2"),
        photo: "../../assets/Drivers/max.png",
        car: "../../assets/Cars/redbull.png",
        background: "#2b2e41"
    },
    {
        name: "Lando Norris",
        position: 0,
        element: document.getElementById("driver3"),
        photo: "../../assets/Drivers/norris.png",
        car: "../../assets/Cars/mclaren.png",
        background: "#faa82c"
    },
    {
        name: "Fernando Alonso",
        position: 0,
        element: document.getElementById("driver4"),
        photo: "../../assets/Drivers/alonso.png",
        car: "../../assets/Cars/aston-martin.png",
        background: "#067e7b"
    },
    {
        name: "Lewis Hamilton",
        position: 0,
        element: document.getElementById("driver5"),
        photo: "../../assets/Drivers/hamilton.png",
        car: "../../assets/Cars/mercedes.png",
        background: "#424954"
    }
]

let positions = [];

const randomGeneratedNumbers = [];

function init() {
    balance = 100;
    chosenDriver = {};
    const spanBalance = document.getElementById("balance");
    spanBalance.innerText = `SALDO: R$ ${balance}`;

    const driver = document.getElementById("driver");
    driver.addEventListener("change", function (e) {
        document.getElementById("error").innerText = "";
        const driverPhoto = document.getElementById("chosenDriverPhoto");
        const driverCarPhoto = document.getElementById("chosenDriverCarPhoto");

        for (let i = 0; i < drivers.length; i++) {
            const currentDriver = drivers[i];
            if (e.target.value == currentDriver.name) {
                driverPhoto.src = currentDriver.photo;
                driverCarPhoto.src = currentDriver.car;
                chosenDriver = drivers[i];
                break;
            }
        }
    });
}

function bet() {
    const errorSpan = document.getElementById("error");
    document.getElementById("success").innerText = "";
    const valueInput = parseInt(document.getElementById("value").value);

    if (valueInput <= balance && valueInput > 0 && Object.keys(chosenDriver).length > 0) {
        errorSpan.innerText = "";

        changeComponent(false);

        const mainContent = document.getElementById("mainContent");
        mainContent.classList.remove("mainHide");
        mainContent.classList.add("mainShow");

        const optionsContainer = document.getElementById("optionsContainer");
        optionsContainer.classList.add("optionsContainerHide");

        if (bonus2 == true) {
            let number;
            do {
                number = parseInt(Math.random() * (5 - 0) + 0);
            } while (chosenDriver.name == drivers[number].name);

            opponentBonus2 = drivers[number];
            document.getElementById("bonus2Opponent").innerText = `${opponentBonus2.name} está com a velocidade reduzida!`;
        }

        const start = setInterval(() => {
            updatePositions();
            checkForWinner();
        }, 50);

        function checkForWinner() {
            const spanBalance = document.getElementById("balance");
            spanBalance.innerText = `SALDO: R$ ${balance}`;
            for (let i = 0; i < drivers.length; i++) {
                const currentDriver = drivers[i];
                if (currentDriver.position >= 1130) { // 1130 is the end of the track
                    clearInterval(start);

                    setTimeout(() => {
                        let winner = currentDriver;

                        const winnerContainer = document.getElementById("winnerContainer");
                        winnerContainer.classList.remove("modal-show");
                        winnerContainer.classList.add("modal");

                        winnerContainer.style.backgroundColor = winner.background;

                        winnerContainer.classList.remove("modal");
                        winnerContainer.classList.add("modal-show");

                        const winnerPhoto = document.getElementById("winnerPhoto");
                        winnerPhoto.src = winner.photo;

                        const winnerName = document.getElementById("winnerName");
                        winnerName.innerText = `Vencedor: ${winner.name}`;

                        const finishMessage = document.getElementById("finishMessage");

                        if (chosenDriver.name == winner.name) {
                            balance += (valueInput * 2);
                            finishMessage.innerText = `Parabéns! Você ganhou R$ ${valueInput * 2} :)`;
                        } else {
                            balance -= valueInput;
                            finishMessage.innerText = `Você apostou em "${chosenDriver.name}" e perdeu R$ ${valueInput} :(`;
                        }

                        spanBalance.innerText = `SALDO: R$ ${balance}`;

                        const closeModalButton = document.getElementById("closeModal");

                        closeModalButton.addEventListener("click", function () {
                            const winnerContainer = document.getElementById("winnerContainer");
                            winnerContainer.classList.remove("modal-show");
                            winnerContainer.classList.add("modal");

                            changeComponent(true);

                            clearPositions();
                        });

                        document.getElementById("value").value = null;
                    }, 600);
                    break;
                }
            }
        }
    } else {
        if (Object.keys(chosenDriver).length == 0) {
            errorSpan.innerText = "Escolha um piloto!";
        } else {
            errorSpan.innerText = "Saldo inválido ou insuficiente!";
        }
    }

    function updatePositions() {
        let newPositions = [];
        for (let i = 0; i < drivers.length; i++) {
            const currentDriver = drivers[i];
            let number = randomNumber();
            if (bonus1 == true && currentDriver.name == chosenDriver.name) {
                number += 1;
            }

            if (bonus2 == true && currentDriver.name == opponentBonus2.name) {
                number -= 1;
            }

            if (bonus3 == true && currentDriver.name == opponentBonus3.name) {
                number -= 1;
                document.getElementById("bonus3Opponent").innerText = `${opponentBonus3.name} está com a velocidade reduzida!`;
            }

            currentDriver.position += number;
            currentDriver.element.style.left = `${currentDriver.position}px`;
            randomGeneratedNumbers[i] = number;
            const driverPosition = {
                driver: currentDriver.name,
                position: currentDriver.position
            }
            newPositions.push(driverPosition);
        }

        newPositions.sort((a, b) => b.position - a.position);

        positions = newPositions;

        if (bonus3 == true && Object.keys(opponentBonus3).length == 0) {
            drivers.forEach(driver => {
                if (driver.name != chosenDriver.name && driver.position >= 565) { // 565 is half of the track
                    opponentBonus3 = driver;
                }
            })
        }

        const ranking = document.getElementById("ranking");
        ranking.innerHTML = "";

        for (let i = 0; i < positions.length; i++) {
            const currentPosition = positions[i];

            const tr = document.createElement("tr");

            const th = document.createElement("th");
            th.innerHTML = `<th scope="row">${i + 1}</th>`;

            const td = document.createElement("td");
            td.innerHTML = `<td>${currentPosition.driver}</td>`;

            tr.appendChild(th);
            tr.appendChild(td);

            ranking.appendChild(tr);
        }
    }

    function clearPositions() {
        for (let i = 0; i < drivers.length; i++) {
            const currentDriver = drivers[i];
            currentDriver.position = 0;
            currentDriver.element.style.left = currentDriver.position;
        }
    }
}

function randomNumber() {
    return Math.random() * (30 - 5) + 5;
}

function changeComponent(option) {
    const mainContent = document.getElementById("mainContent");
    const optionsContainer = document.getElementById("optionsContainer");

    if (option == false) {
        mainContent.classList.remove("mainHide");
        mainContent.classList.add("mainShow");

        optionsContainer.classList.add("optionsContainerHide");
    } else {
        mainContent.classList.add("mainHide");
        mainContent.classList.remove("mainShow");

        optionsContainer.classList.remove("optionsContainerHide");

        chosenDriver = {};
        const driver = document.getElementById("driver");
        const driverPhoto = document.getElementById("chosenDriverPhoto");
        const driverCarPhoto = document.getElementById("chosenDriverCarPhoto");
        driver.options.selectedIndex = 0;
        driverPhoto.src = "../../assets/user.png";
        driverCarPhoto.src = "../../assets/car.png";

        bonus1 = false;
        bonus2 = false;
        bonus3 = false;
        opponentBonus2 = {};
        opponentBonus3 = {};
        document.getElementById("bonus1").disabled = false;
        document.getElementById("bonus2").disabled = false;
        document.getElementById("bonus3").disabled = false;
        document.getElementById("bonus2Opponent").innerText = "";
        document.getElementById("bonus3Opponent").innerText = "";
    }
}

function ativarBonus1() {
    const spanBalance = document.getElementById("balance");
    const botao = document.getElementById("bonus1");
    const errorSpan = document.getElementById("error");
    const successSpan = document.getElementById("success");

    if (balance >= 7) {
        bonus1 = true;
        balance -= 7;
        spanBalance.innerText = `SALDO: R$ ${balance}`;
        botao.disabled = true;
        successSpan.innerText = "Bônus 1 comprado!";
    } else {
        errorSpan.innerText = "Você não tem saldo suficiente!";
    }
}

function ativarBonus2() {
    const spanBalance = document.getElementById("balance");
    const botao = document.getElementById("bonus2");
    const errorSpan = document.getElementById("error");
    const successSpan = document.getElementById("success");

    if (balance >= 5) {
        bonus2 = true;
        balance -= 5;
        spanBalance.innerText = `SALDO: R$ ${balance}`;
        botao.disabled = true;
        successSpan.innerText = "Bônus 2 comprado!";
    } else {
        errorSpan.innerText = "Você não tem saldo suficiente!";
    }
}

function ativarBonus3() {
    const spanBalance = document.getElementById("balance");
    const botao = document.getElementById("bonus3");
    const errorSpan = document.getElementById("error");
    const successSpan = document.getElementById("success");

    if (balance >= 10) {
        bonus3 = true;
        balance -= 10;
        spanBalance.innerText = `SALDO: R$ ${balance}`;
        botao.disabled = true;
        successSpan.innerText = "Bônus 3 comprado!";
    } else {
        errorSpan.innerText = "Você não tem saldo suficiente!";
    }
}
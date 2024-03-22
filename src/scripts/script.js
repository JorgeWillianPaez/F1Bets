let balance;
let chosenDriver = {};

const drivers = [
    {
        name: "LeClerc",
        position: 0,
        margin: 0,
        element: document.getElementById("driver1"),
        photo: "../../assets/Drivers/leclerc.png",
        car: "../../assets/Cars/ferrari.png",
        background: "#f34238"
    },
    {
        name: "Max Verstappen",
        position: 0,
        margin: 0,
        element: document.getElementById("driver2"),
        photo: "../../assets/Drivers/max.png",
        car: "../../assets/Cars/redbull.png",
        background: "#2b2e41"
    },
    {
        name: "Lando Norris",
        position: 0,
        margin: 0,
        element: document.getElementById("driver3"),
        photo: "../../assets/Drivers/norris.png",
        car: "../../assets/Cars/mclaren.png",
        background: "#faa82c"
    },
    {
        name: "Fernando Alonso",
        position: 0,
        margin: 0,
        element: document.getElementById("driver4"),
        photo: "../../assets/Drivers/alonso.png",
        car: "../../assets/Cars/aston-martin.png",
        background: "#067e7b"
    },
    {
        name: "Lewis Hamilton",
        position: 0,
        margin: 0,
        element: document.getElementById("driver5"),
        photo: "../../assets/Drivers/hamilton.png",
        car: "../../assets/Cars/mercedes.png",
        background: "#424954"
    }
]

const randomGeneratedNumbers = [];

function init() {
    balance = 100;
    chosenDriver = {};
    const spanBalance = document.getElementById("balance");
    spanBalance.innerText = `SALDO: R$ ${balance}`;

    const driver = document.getElementById("driver");
    driver.addEventListener("change", function (e) {
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
    const valueInput = parseInt(document.getElementById("value").value);

    if (valueInput <= balance && valueInput > 0 && Object.keys(chosenDriver).length > 0) {
        errorSpan.innerText = "";

        changeComponent(false);

        const mainContent = document.getElementById("mainContent");
        mainContent.classList.remove("mainHide");
        mainContent.classList.add("mainShow");

        const optionsContainer = document.getElementById("optionsContainer");
        optionsContainer.classList.add("optionsContainerHide");

        const start = setInterval(() => {
            updatePositions();
            checkForWinner();
        }, 50);

        function checkForWinner() {
            const spanBalance = document.getElementById("balance");
            spanBalance.innerText = `SALDO: R$ ${balance}`;
            for (let i = 0; i < drivers.length; i++) {
                const currentDriver = drivers[i];
                if (currentDriver.margin >= 1130) {
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
        for (let i = 0; i < drivers.length; i++) {
            const currentDriver = drivers[i];
            const number = randomNumber();
            currentDriver.margin += number;
            currentDriver.element.style.left = `${currentDriver.margin}px`;
            randomGeneratedNumbers[i] = number;
        }
    }

    function clearPositions() {
        for (let i = 0; i < drivers.length; i++) {
            const currentDriver = drivers[i];
            currentDriver.margin = 0;
            currentDriver.element.style.left = currentDriver.margin;
        }
    }
}

function randomNumber() {
    return Math.random() * (25 - 5) + 5;
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
    }
}
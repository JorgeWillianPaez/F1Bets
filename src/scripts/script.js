let balance;
let chosenDriver;

const drivers = [
    {
        name: "LeClerc",
        position: 0,
        margin: 0,
        element: document.getElementById("driver1"),
        photo: "../../assets/Drivers/leclerc.png",
        car: "../../assets/Cars/ferrari.png"
    },
    {
        name: "Max Verstappen",
        position: 0,
        margin: 0,
        element: document.getElementById("driver2"),
        photo: "../../assets/Drivers/max.png",
        car: "../../assets/Cars/redbull.png"
    },
    {
        name: "Lando Norris",
        position: 0,
        margin: 0,
        element: document.getElementById("driver3"),
        photo: "../../assets/Drivers/norris.png",
        car: "../../assets/Cars/mclaren.png"
    },
    {
        name: "Fernando Alonso",
        position: 0,
        margin: 0,
        element: document.getElementById("driver4"),
        photo: "../../assets/Drivers/alonso.png",
        car: "../../assets/Cars/aston-martin.png"
    },
    {
        name: "Lewis Hamilton",
        position: 0,
        margin: 0,
        element: document.getElementById("driver5"),
        photo: "../../assets/Drivers/hamilton.png",
        car: "../../assets/Cars/mercedes.png"
    }
]

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

    if (valueInput <= balance && chosenDriver) {
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

                    let winner = {};

                    const winnerContainer = document.getElementById("winnerContainer");
                    winnerContainer.classList.remove("modal-show");
                    winnerContainer.classList.add("modal");

                    winner = currentDriver;

                    winnerContainer.classList.remove("modal");
                    winnerContainer.classList.add("modal-show");

                    const winnerPhoto = document.getElementById("winnerPhoto");
                    winnerPhoto.src = winner.photo;

                    if (chosenDriver.name == winner.name) {
                        balance += (valueInput * 2)
                    } else {
                        balance -= valueInput
                    }

                    spanBalance.innerText = `SALDO: R$ ${balance}`;

                    clearPositions();

                    const closeModalButton = document.getElementById("closeModal");

                    closeModalButton.addEventListener("click", function () {
                        const winnerContainer = document.getElementById("winnerContainer");
                        winnerContainer.classList.remove("modal-show");
                        winnerContainer.classList.add("modal");

                        changeComponent(true);
                    });

                    document.getElementById("value") = null;

                    break;
                }
            }
        }
    } else {
        if (!chosenDriver) {
            errorSpan.innerText = "Escolha um piloto!";
        } else {
            errorSpan.innerText = "Você não possui saldo suficiente!";
        }
    }

    function updatePositions() {
        for (let i = 0; i < drivers.length; i++) {
            const currentDriver = drivers[i];
            currentDriver.margin += randomNumber();
            currentDriver.element.style.left = `${currentDriver.margin}px`;
        }
        chosenDriver = {};
    }

    function clearPositions() {
        for (let i = 0; i < drivers.length; i++) {
            const currentDriver = drivers[i];
            currentDriver.margin = 0;
            currentDriver.element.style.left = currentDriver.margin;
        }
        chosenDriver = {};
    }
}

function randomNumber() {
    return Math.random() * (20 - 10) + 10;
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
    }
}
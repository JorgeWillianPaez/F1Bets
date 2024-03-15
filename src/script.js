let balance = 100;
let driver1Position = 0;
let driver2Position = 0;
let driver3Position = 0;
let driver4Position = 0;
let driver5Position = 0;

const positions = [driver1Position, driver2Position, driver3Position, driver4Position, driver5Position];

let winner = "";
function init() {
    const spanBalance = document.getElementById("balance");
    spanBalance.innerText = `Saldo: R$ ${balance}`;

    const driver1 = document.getElementById("driver1");
    const driver2 = document.getElementById("driver2");
    const driver3 = document.getElementById("driver3");
    const driver4 = document.getElementById("driver4");
    const driver5 = document.getElementById("driver5");

    const drivers = [driver1, driver2, driver3, driver4, driver5];

    const bet = document.getElementById("bet");
    bet.addEventListener("click", function () {
        function updatePositions() {
            for (let i = 0; i < drivers.length; i++) {
                positions[i] += randomNumber();
                drivers[i].style.left = `${positions[i]}px`;
            }
        }

        function checkForWinner() {
            for (let i = 0; i < positions.length; i++) {
                if (positions[i] >= 1130) {

                    clearInterval(start);
                    clearPositions();
                    break;
                }
            }
        }

        function clearPositions() {
            for (let i = 0; i < positions.length; i++) {
                drivers[i].style.left = "0px";
                positions[i] = 0;
            }
        }

        const start = setInterval(() => {
            updatePositions();
            checkForWinner();
        }, 250);
    })
}

function randomNumber() {
    return Math.random() * (50 - 30) + 30;
}
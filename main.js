document.addEventListener("DOMContentLoaded", function() {
    const commandForm = document.getElementById("command-form");
    const commandInput = document.getElementById("command-input");
    const gameOutput = document.getElementById("game-output");
    const statusOutput = document.getElementById("status-output");
    const player = {
        currentRoom: "buiten",
        health: 10000,
        maxHealth: 100,
        maxWeight: 25,
        inventory: [],
        rooms: {
            buiten: {
                description: "Je staat buiten het verzorgingtehuis.",
                exits: {
                    gang: "gang",
                    tijdmachine: "tijdmachine"
                },
                items: [
                    { name: "medikit", weight: 5, action: "heal" },
                    { name: "flashlight", weight: 2, action: "illuminate" },
                    { name: "key", weight: 1, action: "unlock" }
                ]
            },
            gang: {
                description: "dit is de gang",
                exits: {
                    buiten: "buiten",
                    kamer1: "kamer1",
                    kamer2: "kamer2",
                    kamer3: "kamer3",
                    kamer4: "kamer4",
                    medicijnenkamer: "medicijnenkamer",
                    kantine: "kantine"
                },
                items: []
            },

            kamer1: {
                description: " Kamer 1 met een oude man. Hij vraagt jou om water te halen.",
                exits: {
                    gang: "gang",
                },
                items: []
            },

            kamer2: {
                description: "Je loopt naar kamer 2 in deze kamer ligt een pasiënt die ziek is en medicijnen nodig heeft.",
                exits: {
                    gang: "gang",
                },
                items: []
            },

            kamer3: {
                description: "Je komt in kamer 3 de oude man vraagt of je hem wat eten kan halen",
                exits: {
                    gang: "gang",
                },
                items: []
            },

            kamer4: {
                description: "Je komt in kamer 4 de vrouw herkent je. Het is de docent die de voorlichting gaf. De vrouw vraagt of je haar bril kan vinden ze is hem namelijk kwijtgeraakt.",
                exits: {
                    gang: "gang",
                },
                items: []
            },

            medicijnenkamer: {
                description: "Aan het einde van de gang kom je in de medicijnen kamer.",
                exits: {
                    gang: "gang",
                },
                items: [
                    { name: "medicijnen", weight: 5, action: "energie" },
                ]
            },

            kantine: {
                description: "Je bent nu in de kantine, er liggen allemaal spullen.",
                exits: {
                    gang: "gang",
                },
                items: [
                    { name: "banaan", weight: 5, action: "energie" },
                    { name: "appel", weight: 5, action: "energie" },

                    { name: "glas water", weight: 5, action: "heal" },
                ]
            },

            tijdmachine: {
                description: " je gaat weer terug naar 2024",
                exits: {
                    buiten: "buiten",
                    lokaal: "lokaal"
                },
                items: []
            },

            lokaal: {
                description: "Je bent weer terug in het lokaal iedereen in inmiddels al weg. je ziet wel de bril van de vrouw liggen.",
                exits: {
                    buiten: "buiten",
                    lokaal: "lokaal"
                },
                items: [
                    { name: "bril", weight: 5, action: "heal" },
                ]
            },
        }
    };

    displayStartingMessage();
    function displayStartingMessage() {
        clearOutput();
        // appendOutput("You find yourself outside the main entrance of the university.");
        disableInput();
        appendOutput("Je bent een student op het alfacollege en krijgt een voorlichting over hoe 2040 er uitziet in de zorg. De docent legt uit dat er veel vergrijzing is en je op steeds meer mensen moet gaan zorgen. ");
        appendOutput(".................");
        appendOutput("Je loopt uit het lokaal om naar de wc te gaan maar dan zie je ineens een machine dat lijkt op een tijdmachine. Je besluit om naar binnen te stappen. Als je er uit stap sta je voor een zorgtehuis.");
        appendOutput("Je kijkt op je telefoon en ziet dat  je in het jaar 2040 bent.")
        appendOutput("...............");
        appendOutput("ㅤ");
        appendOutput("Druk 'Enter' om verder te gaan.");
        document.addEventListener("keydown", introText);
    }

    function introText(event) {
        if (event.key === "Enter") {
            clearOutput();
            appendOutput("Typ 'help' om de beschikbare commando's te zien.");
            enableInput();
            
        }
    }

    commandForm.addEventListener("submit", function (event) {
        event.preventDefault();
    
        const command = commandInput.value.trim().toLowerCase();
        if (player.health > 0) {
            if (command === "kijk") {
                look();
            } else if (command.startsWith("ga ")) {
                const destination = command.slice(3).trim();
                go(destination);
            } else if (command.startsWith("pak op ")) {
                const itemName = command.slice(7).trim();
                take(itemName);
            } else if (command.startsWith("gebruik ")) {
                const itemName = command.slice(8).trim();
                use(itemName);
            } else if (command.startsWith("laat vallen ")) {
                const itemName = command.slice(12).trim();
                drop(itemName);
            } else if (command === "status") {
                showStatus();
            } else if (command === "help") {
                showHelp();
            } else {
                appendOutput("> Onbekend commando: " + command);
            }
        }
    
        commandInput.value = "";
    });    

    function look() {
        const currentRoom = player.rooms[player.currentRoom];
        clearOutput();
        appendOutput(">" + currentRoom.description);
        appendOutput("> Je kan naar de volgende kamers: " + Object.keys(currentRoom.exits).join(", "));
        const itemsInRoom = currentRoom.items.map(item => {
            return (item.name.charAt(0).toUpperCase() + item.name.slice(1)) + " (" + item.weight + "KG)";
        });
        appendOutput("ㅤ");
        if (itemsInRoom.length > 0) {
            appendOutput("> Voorwerpen in deze kamer:");
            itemsInRoom.forEach(item => {
                appendOutput("- " + item);
            });
        }
    }



    function go(destinationCommand) {
        const currentRoom = player.rooms[player.currentRoom];
        const destinationWords = destinationCommand.split(" ").slice(1).join(" ");
        if (currentRoom.exits.hasOwnProperty(destinationWords)) {
            player.currentRoom = currentRoom.exits[destinationWords];
            look();
            takeDamage(50);
        } else {
            appendOutput("> Er is geen uitgang naar deze locatie.");
        }
    }
    
    
    function take(itemName) {
        const currentRoom = player.rooms[player.currentRoom];
        const item = currentRoom.items.find(item => item.name === itemName);
        if (item) {
            if (player.inventoryWeight() + item.weight <= player.maxWeight) {
                player.inventory.push(item);
                currentRoom.items = currentRoom.items.filter(roomItem => roomItem !== item);
                clearOutput();
                appendOutput("> Je hebt een voorwerp opgepakt: " + item.name);
            } else {
                appendOutput("> Je kan dit niet bij je dragen.");
            }
        } else {
            appendOutput("> Het voorwerp is niet te vinden in de kamer.");
        }
    }

    function drop(itemName) {
        const item = player.inventory.find(item => item.name === itemName);
        if (item) {
            player.inventory = player.inventory.filter(invItem => invItem !== item);
            const currentRoom = player.rooms[player.currentRoom];
            currentRoom.items.push(item);
            appendOutput("> You dropped: " + item.name);
        } else {
            appendOutput("> Je hebt het voorwerp niet bij je.");
        }
    }

    function use(itemName) {
        const item = player.inventory.find(item => item.name === itemName);
        if (item) {
            if (item.action === "heal") {
                if (player.health < player.maxHealth) {
                    player.health = Math.min(player.health + 50, player.maxHealth);
                    appendOutput("> You used the medikit and restored 50 health.");
                    removeItemFromInventory(item);
                    clearOutput();
                } else {
                    clearOutput();
                    appendOutput("> Je vermoeidheid is te laag hiervoor.");
                }
            } else {
                clearOutput();
                appendOutput("> Dit voorwerp kan je niet gebruiken.");
            }
        } else {
            appendOutput("> Je hebt het voorwerp niet bij je.");
        }
    }

    function showStatus() {
        clearOutput();
        appendOutput("> Vermoeidheid: " + player.health);
        appendOutput("> Inventory:");
        player.inventory.forEach(item => {
            const itemNameCapitalized = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            appendOutput("- " + itemNameCapitalized + " (" + item.weight + "KG)");
        });
    }

    function showHelp() {
        clearOutput();
        appendOutput("> Beschikbare commando's:");
        appendOutput("ㅤ");
        appendOutput("- kijk: Kijk om je heen");
        appendOutput("- ga naar [locatie]: Ga naar de gekozen locatie");
        appendOutput("- pak op [voorwerp]: Pak een item op");
        appendOutput("- laat vallen [voorwerp]: Laat de gekozen voorwerp vallen");
        appendOutput("- gebruik [voorwerp]: Gebruik een voorwerp uit je inventory");
        appendOutput("- status: Bekijk algemene informatie over je karakter");
    }

    function appendOutput(text) {
        const outputParagraph = document.createElement("p");
        outputParagraph.textContent = text;
        gameOutput.appendChild(outputParagraph);
    }

    function clearOutput() {
        gameOutput.innerHTML = "";
    }

    function takeDamage(amount) {
        player.health -= amount;
        if (player.health <= 0) {
            disableInput();
            clearOutput();
            appendOutput("> You died.");
            document.addEventListener("keydown", handleRestart);
            appendOutput("> Press 'Enter' to restart.");
        }
    }

    function disableInput() {
        commandInput.disabled = true;
        document.querySelector("button[type='submit']").disabled = true;
    }
    
    function enableInput() {
        commandInput.disabled = false;
        document.querySelector("button[type='submit']").disabled = false;
        setTimeout(function() {
            commandInput.focus(); 
        }, 100); 
    }
    
    


    function handleRestart(event) {
        if (event.key === "Enter") {
            document.removeEventListener("keydown", handleRestart);
            introText('enter')
            player.currentRoom = 'outside'; 
            player.health = 100
            enableInput();
        }
    }

    function removeItemFromInventory(item) {
        player.inventory = player.inventory.filter(invItem => invItem !== item);
    }

    player.inventoryWeight = function() {
        return player.inventory.reduce((total, item) => total + item.weight, 0);
    };
});

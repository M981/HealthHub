document.addEventListener("DOMContentLoaded", function() {
    const commandForm = document.getElementById("command-form");
    const commandInput = document.getElementById("command-input");
    const gameOutput = document.getElementById("game-output");
    const statusOutput = document.getElementById("status-output");
    const player = {
        currentRoom: "outside",
        health: 100,
        maxHealth: 100,
        maxWeight: 25,
        inventory: [],
        rooms: {
            outside: {
                description: "outside the main entrance of the university",
                exits: {
                    east: "theatre",
                    south: "lab",
                    west: "pub"
                },
                items: [
                    { name: "medikit", weight: 5, action: "heal" },
                    { name: "flashlight", weight: 2, action: "illuminate" },
                    { name: "key", weight: 1, action: "unlock" }
                ]
            },
            theatre: {
                description: "in a lecture theatre",
                exits: {
                    west: "outside",
                    door: "hallway"
                },
                items: []
            },
            pub: {
                description: "in the campus pub",
                exits: {
                    east: "outside"
                },
                items: []
            },
            lab: {
                description: "in a computing lab",
                exits: {
                    north: "outside",
                    east: "office"
                },
                items: []
            },
            office: {
                description: "in the computing admin office",
                exits: {
                    west: "lab"
                },
                items: []
            },
            hallway: {
                description: "in the university hallway",
                exits: {
                    theatre: "theatre",
                    stairs: "up"
                },
                items: []
            },
            up: {
                description: "on the second floor of the university",
                exits: {
                    down: "hallway",
                    storageroom: "storage"
                },
                items: []
            },
            storage: {
                description: "in the storage room",
                exits: {
                    hallway: "hallway"
                },
                items: []
            }
        }
    };

    displayStartingMessage();
    function displayStartingMessage() {
        clearOutput(); 
        appendOutput("Hier kan je lines toevoegen voor wanneer iemand op de site komt");
        // appendOutput("You find yourself outside the main entrance of the university.");
        appendOutput("Druk 'Enter' om verder te gaan.");
        document.addEventListener("keydown", introText);
    }

    function introText(event) {
        if (event.key === "Enter") {
            clearOutput(); 
            appendOutput("Typ 'help' om de beschikbare commando's te zien.");
            appendOutput("Typ 'help' om de beschikbare commando's te zien.");
            appendOutput("Typ 'help' om de beschikbare commando's te zien.");
            appendOutput("Typ 'help' om de beschikbare commando's te zien.");
        }
    }

    commandForm.addEventListener("submit", function(event) {
        event.preventDefault(); 

        const command = commandInput.value.trim().toLowerCase();
        if (player.health > 0) {
            if (command === "look") {
                look();
            } else if (command.startsWith("go")) {
                const destination = command.slice(3); 
                go(destination);
            } else if (command.startsWith("take ")) {
                const itemName = command.slice(5); 
                take(itemName);
            } else if (command.startsWith("use ")) {
                const itemName = command.slice(4); 
                use(itemName);
            } else if (command.startsWith("drop ")) {
                const itemName = command.slice(5); 
                drop(itemName);
            } else if (command === "status") {
                showStatus();
            } else if (command === "help") {
                showHelp();
            } else {
                appendOutput("> Unknown command: " + command); 
            }
        }

        commandInput.value = ""; 
    });

    function look() {
        const currentRoom = player.rooms[player.currentRoom];
        clearOutput(); 
        appendOutput("> You are " + currentRoom.description);
        appendOutput("> Available exits: " + Object.keys(currentRoom.exits).join(", "));
        const itemsInRoom = currentRoom.items.map(item => {
            return (item.name.charAt(0).toUpperCase() + item.name.slice(1)) + " (" + item.weight + "KG)";
        });
        if (itemsInRoom.length > 0) { 
            appendOutput("> Items in the room:");
            itemsInRoom.forEach(item => {
                appendOutput("- " + item);
            });
        }
    }
    
    
    
    function go(destination) {
        const currentRoom = player.rooms[player.currentRoom];
        if (currentRoom.exits.hasOwnProperty(destination)) {
            player.currentRoom = currentRoom.exits[destination];
            look();
            takeDamage(50); 
        } else {
            appendOutput("> There is no exit in that direction.");
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
                appendOutput("> You picked up: " + item.name);
            } else {
                appendOutput("> You can't carry that much weight.");
            }
        } else {
            appendOutput("> There is no such item in the room.");
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
            appendOutput("> You don't have that item in your inventory.");
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
                    appendOutput("> You are already at full health.");
                }
            } else {
                clearOutput(); 
                appendOutput("> This item cannot be used.");
            }
        } else {
            appendOutput("> You don't have that item in your inventory.");
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
        appendOutput("> Available commands:");
        appendOutput("- look: Look around the current location");
        appendOutput("- go [direction]: Move to the specified direction");
        appendOutput("- take [item]: Pick up an item from the room");
        appendOutput("- drop [item]: Drop an item from your inventory");
        appendOutput("- use [item]: Use an item from your inventory");
        appendOutput("- status: Display player's current health and inventory");
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
    }
    
    function handleRestart(event) {
        if (event.key === "Enter") {
            document.removeEventListener("keydown", handleRestart);
            introText('enter')
            player.currentRoom = 'outside'; 
            player.health = 100
            commandInput.disabled = false;
        }
    }

    function removeItemFromInventory(item) {
        player.inventory = player.inventory.filter(invItem => invItem !== item);
    }

    player.inventoryWeight = function() {
        return player.inventory.reduce((total, item) => total + item.weight, 0);
    };
});

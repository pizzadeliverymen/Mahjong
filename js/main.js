import {  BUTTONLIST, PLAYERACTION, TILEBACK, TileSet } from "./utils.js";
import { MahjongGame, StartGame } from "./game.js";
import { MeldType } from "./melds.js";


let game;




const snap = new Audio('https://cdn.freesound.org/previews/265/265291_5003039-lq.ogg');

// // show the tiles to the players
// function showTiles(player = "playerYou", hand) {
//     let playersHand;
//     let isYou = false
//     // get the player we are dealing with
//     switch (player) {
//         case ("playerYou"):
//             playersHand = document.getElementById("players-hand")
//             isYou = true
//             break;
//         case ("playerOpposite"):
//             playersHand = document.getElementById("opposite-hand")
//             break;
//         case ("playerLeft"):
//             playersHand = document.getElementById("left-hand")
//             break;
//         case ("playerRight"):
//             playersHand = document.getElementById("right-hand")
//             break;
//         default:
//             console.log("somethine terrible has occurred")
//             playersHand = document.getElementById("players-hand")
//             break;
//     }
//     // clear that players hand for now
//     while (playersHand.firstChild) {
//         playersHand.removeChild(playersHand.firstChild)
//     }
    
//     for (let index = 0; index < hand.length; index++) {
//         let tile = hand[index]
//         console.log(tile)
//         const node = createTile(tile, isYou)
//         playersHand.appendChild(node)
//         if (player === "playerYou") {
//             node.onclick = function() {
//                 console.log(`It is ${currentPlayer[turn%4]}'s turn, we are clicking ${tile}, which is in ${playersHand.textContent}, ` + 
//                     `\n\twhich contains ${hand}, and the specific element clicked was ${node}`
//                 )
                
//                 playerDiscard(index, hand, node, playersHand, tile, drawnTile)
//             }
//         }
//     }
        
// }


export function updateUI() {
    let playerList = game.getPlayers();
    for (let index in playerList) {
        let thisPlayer = playerList[index];
        let direction = thisPlayer.getName().toLowerCase()
        let handDiv = document.getElementById(`${direction}-hand`)
        // clear old hand
        while (handDiv.firstChild) {
            handDiv.removeChild(handDiv.firstChild)
        }
        let playersHand = thisPlayer.getHand()
        for (let tile in playersHand) {
            let tileNode = createTile(playersHand[tile], direction=="you", direction=="you")
            handDiv.appendChild(tileNode)
        }

        let drawnDiv = document.getElementById(`${direction}-drawn`)
        // clear old drawn tile
        while (drawnDiv.firstChild) {
            drawnDiv.removeChild(drawnDiv.firstChild)
        }
        let playersDrawn = thisPlayer.getDrawn()
        if (playersDrawn != null) {
            let tileNode = createTile(playersDrawn, direction=="you")
            drawnDiv.appendChild(tileNode)
        }

        let playersDiscard = thisPlayer.getDiscard()
        let discardDiv = document.getElementById(`${direction}-discard`)
        // clear old discard
        while (discardDiv.firstChild) {
            discardDiv.removeChild(discardDiv.firstChild)
        }
        for (let tile in playersDiscard) {
            let tileNode = createTile(playersDiscard[tile], direction=="you")
            discardDiv.appendChild(tileNode)
        }

        // now the same for the open hands
        let playerShown = thisPlayer.getShown()
        let shownDiv = document.getElementById(`${direction}-shown`)
        // clear melds
        while (shownDiv.firstChild) {
            shownDiv.removeChild(shownDiv.firstChild)
        }
        for (let i in playerShown) {
            let meld = playerShown[i]
            console.log(meld)
            let meldNode = createMeld(meld)
            console.log(meldNode)
            shownDiv.appendChild(meldNode)
        }
    }
    const count = document.getElementById("remaining-count")
    count.textContent = `Remaining Tiles: ${game.getDeck().length}`
}

function createMeld(meld) {
    let type = meld.getType();
    let tileList = meld.getInHand().slice(0);
    let stolen = meld.getStolen()
    let direction = meld.getDirection()
    let meldDirection;
    switch(direction) {
        case "left":
            meldDirection = "kamicha"
            break;
        case "opposite":
            meldDirection = "toimen"
            break;
        case "right":
            meldDirection = "shimocha"
            break;
        case "you":
            meldDirection = "closed"
            break;
        default:
            break;
    }
    tileList.push(stolen)
    let meldDiv = document.createElement("div");

    meldDiv.classList.add("mahjong-set")
    meldDiv.classList.add(type)
    if (meld.getType() == MeldType.Kan && meld.isUpgraded()) {
        let middleDiv = document.createElement("div")
        meldDiv.classList.add("upgraded")
        middleDiv.style.transform = 'rotate(90deg)'
        middleDiv.style.display = 'flex'
        middleDiv.style.flexDirection = 'row'
        middleDiv.style.width = "1em"
        middleDiv.style.height = "1em"
        middleDiv.appendChild(createTile(tileList[0]))
        middleDiv.appendChild(createTile(tileList[0]))
        meldDiv.appendChild(createTile(tileList[0]))
        meldDiv.appendChild(middleDiv)
        meldDiv.appendChild(createTile(tileList[0]))
    } else {
        meldDiv.classList.add(meldDirection)
        for (let i in tileList) {
            let tile = tileList[i]
            let tileNode = createTile(tile)
            meldDiv.appendChild(tileNode)
        }
    }
    if (meld.getType() == MeldType.Kan && direction == "you") {
        // meldDiv.childNodes.entries.firstChild.color = "#F0EAD6"
        // meldDiv.style.lastChild.color = "#F0EAD6"
        meldDiv.firstChild.style.color = "#F0EAD6"
        meldDiv.lastChild.style.color = "#F0EAD6"
    }
    return meldDiv
}

// This creates a new div for the tile.
function createTile(tile, isYou=false, show=true) {
    const tileString = TileSet[tile];
    const node = document.createElement("div");
    if (!show) {
        const textnode = document.createTextNode(TILEBACK);
        node.appendChild(textnode);
        return node
    }
    node.classList.add("single-piece", tile);
    if (tile == "REDDRAGON") {
        // console.log(tile);
        node.classList.add("red", "dragon");
    } else if (tile == "GREENDRAGON") {
        // console.log(tile);
        node.classList.add("green", "dragon");
    } else if (tile == "WHITEDRAGON") {
        // console.log(tile);
        node.classList.add("white", "dragon");
    }
    const textnode = document.createTextNode(tileString);
    node.appendChild(textnode);
    if (isYou) {
        node.classList.add("clickable")
        node.onclick = function() {
            if (node.classList.contains("chosen")) {node.classList.remove("chosen")}
            else {node.classList.add("chosen")}
        }
    }
    return node;
}

/**
 * Setup control buttons
 *  start button -> view:none, run PlayRound()
 *                  show other controls
 *
 *  call chii ->    check youDeck for sequences of 2 and create set of wanted tiles
 *                  if last discarded tile is in set add sequence tiles to open
 *               
 */
function setupControls() {
    const startButton = document.getElementById("start-game")
    const richiiButton = document.getElementById("call-riichi")
    const chiiButton = document.getElementById("call-chii")
    const ponButton = document.getElementById("call-pon")
    const kanButton = document.getElementById("call-kan")
    const cancelButton = document.getElementById("call-cancel")
    const discardButton = document.getElementById("call-discard")


    startButton.onclick = function() {
        // get list of chosen elements
        let chosen = document.getElementsByClassName("chosen")
        let tiles = []
        for (let i in chosen) {
            console.log(i)
        }
        startButton.hidden = true
        StartGame()
        populateBoard()
    }
    chiiButton.onclick = function() {
        // get list of chosen elements
        let chosen = document.getElementsByClassName("chosen")
        let tiles = []
        for (let i in chosen) {
            console.log(i)
        }
        game.forceChii()
        updateUI()
    }
    ponButton.onclick = function() {
        // get list of chosen elements
        let chosen = document.getElementsByClassName("chosen")
        let tiles = []
        for (let i in chosen) {
            console.log(i)
        }
        game.forcePon()
        updateUI()
    }
    kanButton.onclick = function() {
        // get list of chosen elements
        let chosen = document.getElementsByClassName("chosen")
        let tiles = []
        for (let i in chosen) {
            console.log(i)
        }
        game.forceKan()
        updateUI()
    }

    discardButton.onclick = function() {
        // get list of chosen elements
        let chosen = document.getElementsByClassName("chosen")
        console.log(chosen)
        let tiles = []
        for (let i in chosen) {
            console.log(chosen[i].textContent)
            let vals = Object.values(TileSet);
            let index = vals.indexOf(chosen[i].textContent)
            let tileName = Object.keys(TileSet)[index]
            console.log(tileName)
            tiles.push(tileName)
        }
        
        game.playerAction(tiles.slice(0,-3),PLAYERACTION.DISCARD)
    }

    const devButton = document.getElementById('test-call');
    devButton.onclick = function() {
        game.forceDiscard()
        updateUI()
        snap.play()
    }
}

function populateBoard(count = 0) {
    snap.play()
    let player = game.getPlayers()[count%4]
    let direction = player.getName().toLowerCase()
    let handDiv = document.getElementById(`${direction}-hand`)
    // console.log(handDiv)
    // console.log(`${direction}-hand`)
    
    let playersHand = player.getHand()
    let tileNode = createTile(playersHand[Math.floor(count/4)],direction=="you",direction=="you")
    handDiv.appendChild(tileNode)
    if (count >= (13*4)-1) {
        initiateGame()
        return
    }
    setTimeout(populateBoard,5,count+1)
}

function setEastPlayer() {
    let eastPlayer = game.getEast()
    let eastPlayerNode = document.getElementsByClassName("east-player").item(0)
    eastPlayerNode.classList.remove("hidden")
    switch (eastPlayer) {
        case 0:
            // you
            eastPlayerNode.id = "east-you"
            break;
        case 1:
            // left
            eastPlayerNode.id = "east-left"
            break;
        case 2:
            // opposite
            eastPlayerNode.id = "east-opposite"
            break;
        case 3:
            // right
            eastPlayerNode.id = "east-right"
            break;
    }
}

function initiateGame() {
    game.randomizeTurn()
    setEastPlayer()
    timer()
}

let timerID;

export function timer() {
    game.NextRound()
    updateUI()
    snap.play()
    if (game.getTurn()%4 != 0) {
        timerID = setTimeout(timer,500)
    } else {
        // playerTime()
        game.NextRound()
        updateUI()
        snap.play()
    }
}

export function interrupt() {
    clearTimeout(timerID)
}

export function resume() {
    timerID = setTimeout(timer, 500)
}


export function playDiscardSound() {
    snap.play()
}

export function showButtons(button) {
    const richiiButton = document.getElementById("call-riichi")
    const chiiButton = document.getElementById("call-chii")
    const ponButton = document.getElementById("call-pon")
    const kanButton = document.getElementById("call-kan")
    const cancelButton = document.getElementById("call-cancel")
    const discardButton = document.getElementById("call-discard")
    switch (button) {
        case BUTTONLIST.DISCARD:
            discardButton.classList.remove("hidden")
            break;
        case BUTTONLIST.RIICHI:
            richiiButton.classList.remove("hidden")
            break;
        case BUTTONLIST.CHII:
            chiiButton.classList.remove("hidden")
            break;
        case BUTTONLIST.PON:
            ponButton.classList.remove("hidden")
            break;
        case BUTTONLIST.KAN:
            kanButton.classList.remove("hidden")
            break;
        case BUTTONLIST.CANCEL:
            cancelButton.classList.remove("hidden")
            break;


    }
}


document.addEventListener('DOMContentLoaded', setupControls(), false)


export function connectGame(gameObject) {
    game = gameObject
}
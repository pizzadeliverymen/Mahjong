import { MeldType, TileSet, sortTiles, Meld } from "./utils.js";

let playerYou = [];
let playerOpposite = [];
let playerLeft = [];
let playerRight = [];
let deck = []
let order = [playerLeft, playerOpposite, playerRight, playerYou];
let currentPlayer = ["playerLeft", 'playerOpposite', "playerRight", "playerYou"]
let drawnTile = undefined

let turn = 0
let prevTurn = 0;
const playersTurn = () => turn%4==3

let discardYou = []
let discardOpposite = []
let discardLeft = []
let discardRight = []
let discardPiles = [discardLeft, discardOpposite, discardRight, discardYou]
let allDiscards = []

let openYou = []
let openOpposite = []
let openLeft = []
let openRight = []
let openList = [openLeft, openOpposite, openRight, openYou]


let playID;             // This is the id for the ai to play, can stop and resume any time

/**
 * Simulate mahjong round
 * Setup mahjong "deck"
 *  simulate plays
 *  repeat until winner or no more tiles
 */
function PlayRound() {
    // reset everything to its default for now
    playerYou = [];
    playerOpposite = [];
    playerLeft = [];
    playerRight = [];
    deck = []
    order = [playerLeft, playerOpposite, playerRight, playerYou];
    discardYou = []
    discardOpposite = []
    discardLeft = []
    discardRight = []
    allDiscards = []
    discardPiles = [discardLeft, discardOpposite, discardRight, discardYou];
    console.log(discardPiles)
    cleanDiscards()
    ManageDeck()
    
    ContinuePlay(interval)
}

let interval = 1000;
function ContinuePlay(inter = 1000) {
    playID = setInterval(playTurn, inter)
    playTurn()
}

function StopPlay() {
    clearInterval(playID)
}


function slowEach( delay = 100, array, callback ) {
    if( ! array.length ) return;
    next();
    function next() {
        if( callback() !== false ) {
            if( array.length > 0 ) {
                setTimeout( next, delay );
            }
        }
    }
}

function playTurn() {
    if (deck.length < 1) {
        StopPlay()
        return
    }
    var tile = deck.pop()
    // console.log(`Drawing tile: ${tile}`)
    let turnString = document.getElementById("current-turn")
    turnString.textContent = `It is player [${currentPlayer[(turn)%4]}]'s turn`
    console.log(`IT IS TURN ${turn}`)
    if (currentPlayer[turn % 4] === "playerYou") {
        StopPlay();
        // if its players turn
        // player can draw a tile~
        // so create tile and place in player-drawn
        let playerDrawn = document.getElementById("drawn-you")
        drawnTile = tile
        const node = createTile(tile, true);
        playerDrawn.appendChild(node)
        node.onclick = function() {
            addDiscard(drawnTile, turn)
            // player can also discard a tile
            // clear the drawn section
            while (playerDrawn.firstChild){
                playerDrawn.removeChild(playerDrawn.firstChild)
            }
            drawnTile = undefined
            ContinuePlay(interval)
            turn += 1
            prevTurn += 1
            playTurn()
        };
    } else {
        // we need to be able to sleep for a bit to pretend
        UpdateCount()
        addDiscard(tile,turn)
        turn += 1
        prevTurn += 1
    }
}


// This creates a new div for the tile.
function createTile(tile, isYou=false) {
    const tileString = TileSet[tile];
    const node = document.createElement("div");
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
    if (isYou) node.classList.add("clickable")
    return node;
}

function cleanDiscards() {

    let youDiscard = document.getElementById("discard-you")
    let oppositeDiscard = document.getElementById("discard-opposite")
    let leftDiscard = document.getElementById("discard-left")
    let rightDiscard = document.getElementById("discard-right")

    while (youDiscard.firstChild) {
        youDiscard.removeChild(youDiscard.firstChild)
    }
    while (oppositeDiscard.firstChild) {
        oppositeDiscard.removeChild(oppositeDiscard.firstChild)
    }
    while (leftDiscard.firstChild) {
        leftDiscard.removeChild(leftDiscard.firstChild)
    }
    while (rightDiscard.firstChild) {
        rightDiscard.removeChild(rightDiscard.firstChild)
    }
}

const snap = new Audio('https://cdn.freesound.org/previews/265/265291_5003039-lq.ogg');
function addDiscard(tile, turn) {
    snap.play()
    let player = currentPlayer[turn % 4]
    let playersDiscard;
    let isYou = false;
    // get the player we are dealing with
    switch (player) {
        case ("playerYou"):
            playersDiscard = document.getElementById("discard-you")
            isYou = true
            break;
        case ("playerOpposite"):
            playersDiscard = document.getElementById("discard-opposite")
            break;
        case ("playerLeft"):
            playersDiscard = document.getElementById("discard-left")
            break;
        case ("playerRight"):
            playersDiscard = document.getElementById("discard-right")
            break;
        default:
            console.log("something terrible has occurred")
            playersDiscard = document.getElementById("discard-you")
            break;
    }
    // add tile to discard
    const node = createTile(tile)
    playersDiscard.appendChild(node)
    let length = allDiscards.push(tile)
    console.log(`pushed ${tile} onto discard ${allDiscards} which makes it ${length}`)
    discardPiles[turn % 4].push(tile)
    let chiiAvailable = checkChii(tile, playerYou)
    if (!isYou && chiiAvailable != null ) {
        StopPlay()
        console.log(chiiAvailable)
    } else {
        UpdateCount()
    }
}


/**
 * Setup Mahjong Deck
 * create deck with 4 of each mahjong tile
 * shuffle deck
 * give player 13 tiles
 *  do that for each player
 * show players their tiles
 */
function ManageDeck() {
    // create and shuffle deck
    deck = CreateDeck();
    // hand out tiles to players
    let index = turn
    let end = (index + 3)% 4
    while ( order[end].length < 13 ) {
        let tile = deck.pop()
        order[index % 4].push(tile)
        index += 1
    }
    playerYou = playerYou.sort(sortTiles)
    playerOpposite = playerOpposite.sort(sortTiles)
    playerLeft = playerLeft.sort(sortTiles)
    playerRight = playerRight.sort(sortTiles)
    console.log(playerYou)
    // sort tiles in players inventory as well
    // show tiles to players
    showTiles("playerYou", playerYou)
    showTiles("playerOpposite", playerOpposite)
    showTiles("playerLeft", playerLeft)
    showTiles("playerRight", playerRight)
    UpdateCount()
    let turnString = document.getElementById("current-turn")
    turnString.textContent = `No Current Game`
    // also should remove all discarded tiles
}

function UpdateCount() {
    // update tile count
    const count = document.getElementById("remaining-count")
    count.textContent = `Remaining Tiles: ${deck.length}`
}

// show the tiles to the players
function showTiles(player = "playerYou", hand) {
    let playersHand;
    let isYou = false
    // get the player we are dealing with
    switch (player) {
        case ("playerYou"):
            playersHand = document.getElementById("players-hand")
            isYou = true
            break;
        case ("playerOpposite"):
            playersHand = document.getElementById("opposite-hand")
            break;
        case ("playerLeft"):
            playersHand = document.getElementById("left-hand")
            break;
        case ("playerRight"):
            playersHand = document.getElementById("right-hand")
            break;
        default:
            console.log("somethine terrible has occurred")
            playersHand = document.getElementById("players-hand")
            break;
    }
    // clear that players hand for now
    while (playersHand.firstChild) {
        playersHand.removeChild(playersHand.firstChild)
    }
    
    for (let index = 0; index < hand.length; index++) {
        let tile = hand[index]
        console.log(tile)
        const node = createTile(tile, isYou)
        playersHand.appendChild(node)
        if (player === "playerYou") {
            node.onclick = function() {
                console.log(`It is ${currentPlayer[turn%4]}'s turn, we are clicking ${tile}, which is in ${playersHand.textContent}, ` + 
                    `\n\twhich contains ${hand}, and the specific element clicked was ${node}`
                )
                
                playerDiscard(index, hand, node, playersHand, tile, drawnTile)
            }
        }
    }
        
}

const playerDiscard = (index, hand, node, playersHand, tile, drawnTile) => {
    if (tile === undefined || hand === undefined || node === undefined || playersHand === undefined || drawnTile === undefined)
    {
        console.log("Undefined Tile Clicked")
        return
    }
    tile = hand[index]
    console.log(index, tile)
    if (currentPlayer[turn%4] === "playerYou" ) {
        // when a player discards a random tile
        console.log(`We want to discard ${tile} which is at ${index}`)
        addDiscard(tile, turn)
        // add it to the discard pile
        // remove from players hand
        playerYou.splice(index, 1)
        // the drawn tile is add into the players hand
        tile = drawnTile
        playerYou.push(tile)
        // and the drawn tile is removed from the drawn section
        let playerDrawn = document.getElementById("drawn-you")
        while (playerDrawn.firstChild){
            playerDrawn.removeChild(playerDrawn.firstChild)
        }
        drawnTile = undefined
        // the players hand gets re-sorted
        playerYou = playerYou.sort(sortTiles)

        // the turn increases and it goes to the next person
        // the tile is removed from the players hand visuallu
        playersHand.removeChild(node)
        // and the hand is updated
        showTiles("playerYou",playerYou)
        // its the next players turn
        let turnString = document.getElementById("current-turn")
        turnString.textContent = `It is player [${currentPlayer[(turn)%4]}]'s turn`
        turn  += 1
        playID = setInterval(playTurn, interval)
    }
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
    const chiiButton = document.getElementById("call-chii")
    startButton.onclick = function() {
        startButton.hidden = true
        // remove hiden from other buttons
        PlayRound()
    }
    chiiButton.onclick = function() {
        solveChii()
    }
    turn = Math.floor((Math.random() * 4))
    prevTurn = turn-1
    const devTest = document.getElementById("test-call")
    devTest.onclick = function() {
        console.log(turn)
        ContinuePlay(interval)
    }
    console.log(TileSet)
}

function solveChii() {
    // we know our last discard is good, so lets go back through the hand and look for where it goes (for now its first come first serve)
    let discarded = allDiscards.splice(-1)[0];
    let sequence = [discarded]
    let keys = Object.keys(TileSet)
    // we dont count the honor suits so stop at the end of bamboo
    let limit = keys.indexOf("NINEBAMBOO")
    let i = 1
    let notDone = true
    while (notDone) {
        let previous = keys.indexOf(playerYou[i-1])
        let current = keys.indexOf(playerYou[i])
        let differenceCurr = Math.abs(current-keys.indexOf(discarded))
        let differencePrev = Math.abs(previous-keys.indexOf(discarded))
        let differenceDiff = Math.abs(differenceCurr - differencePrev)
        if (differenceCurr<=2 && (differenceCurr < 2 || differencePrev < 2) ) {
            // console.log(playerYou[i-1], playerYou[i])
            // this means that they are next to each other
            // that means we want the tile after current
            // or before previous
            // but that only works as long as the tiles arent terminals (1 or 9)
            // each "suit" has 9 tiles, so we can do index%9 to check
            if (previous%9 != 0 && current%9 != 8) {
                // so if the first tile is not a 1
                // and if the second tile is not a 9 (its off by 1 because tiles start at 1 but arrays start at 0)
                sequence.push(keys[previous], keys[current])
                notDone = false
            }
        }
        // we also need to check if there is a gap of 1 between, (and that neither are terminals again but the opposite direction)
        // this covers situations like having 1Bamboo, 3Bamboo and you see a 2Bamboo
        // else if (differenceCurr === 1 && differencePrev === 1  && current%9 != 0 && previous%9 != 8) {
        //     sequence.push(keys[previous], keys[current])
        //     notDone = false
        // }

        i++
        if (i >= playerYou.length || current >= limit) {
            notDone = false
        }
    }
    // now we have our sequence
    console.log(sequence)
    
    // so remove it from last players discard
    allDiscards.pop()
    discardPiles[turn % 4].pop()

    //  and add to own open
    let meld = new Meld(MeldType.Chii, sequence)
    openYou.push(meld)
    // also do it visually
    createChiiTiles(sequence)

    let playerWall = document.getElementById("players-hand")
    // and remove from wall as well
    
    // and visually again
    console.log(playerWall.children)
    // go through the children and check their classes for the correct tile to delete
    for (let i = 1; i < sequence.length; i++) {
        let toRemove = sequence[i]
        let currentChild = playerWall.getElementsByClassName(sequence[i])[0]
        let tileIndex = playerYou.indexOf(toRemove)
        playerYou.splice(tileIndex)
        playerWall.removeChild(currentChild)
    }
}

function createChiiTiles(sequence) {
    const parentNode = document.getElementById("you-shown")
    const node = document.createElement("div");
    node.classList.add("mahjong-set", "chii")
    for (let i = 0; i < sequence.length; i++) {
        let newTile = createTile(sequence[i])
        node.appendChild(newTile)
    }
    parentNode.appendChild(node)
}

function checkChii(tile, playerHand) {
    let sequences = new Set();
    let keys = Object.keys(TileSet)
    // we dont count the honor suits so stop at the end of bamboo
    let limit = keys.indexOf("NINEBAMBOO")
    let i = 1
    let notDone = true
    while (notDone) {
        let previous = keys.indexOf(playerHand[i-1])
        let current = keys.indexOf(playerHand[i])
        let difference = current-previous
        if (difference === 1) {
            // console.log(playerHand[i-1], playerHand[i])
            // this means that they are next to each other
            // that means we want the tile after current
            // or before previous
            // but that only works as long as the tiles arent terminals (1 or 9)
            // each "suit" has 9 tiles, so we can do index%9 to check
            if (previous%9 != 0) {
                // so if the first tile is not a 1
                sequences.add(keys[previous-1])
            }
            if (current%9 != 8) {
                // or if the second tile is not a 9 (its off by 1 because tiles start at 1 but arrays start at 0)
                sequences.add(keys[current + 1])
            }
        }
        // we also need to check if there is a gap of 1 between, (and that neither are terminals again but the opposite direction)
        // this covers situations like having 1Bamboo, 3Bamboo and you see a 2Bamboo
        else if (difference === 2 && current%9 != 0 && previous%9 != 8) {
            sequences.add(keys[current-1])
        }

        i++
        if (i >= playerHand.length || current >= limit) {
            notDone = false
        }
    }
    // now that we have the wanted tiles, we want to check the last discard to see if it fits
    let toCheck = tile
    console.log(toCheck)
    if (sequences.has(toCheck)) {
        console.log(`WE FOUND ONE: ${toCheck}`)
        showControl("chii")
        return toCheck
    }
    return null
}

function showControl(callName) {
    let controlButton;
    switch(callName) {
        case "chii":
            controlButton = document.getElementById("call-chii")
            break;
        default:
            console.log("no button found killing self")
            return
    }
    controlButton.classList.remove("hidden")
    document.getElementById("call-cancel").classList.remove("hidden")

}

/**
 * Create variable mahjongDeck of repeating ordered mahjong tiles
 */
function CreateDeck() {
    // for each mahjong tile type
    // add to deck four times
    // shuffle deck
    // return deck
    let deck = []
    const keys = Object.keys(TileSet)
    for (let i = 0; i < keys.length; i++) {
        let tile = keys[i]
        console.log(tile)
        for (let i = 0; i < 4; i++){
            deck.push(tile)
        }
    }
    console.log(deck)
    let shuffled = deck.map (value => ({value, sort: Math.random()}))
                        .sort( (a,b) => a.sort - b.sort)
                        .map(({ value }) => value);
    return shuffled
}

//  	 	🀢 	🀣 	🀤 	🀥 	🀦 	🀧 	🀨 	🀩 	🀪 	
document.addEventListener('DOMContentLoaded', setupControls(), false)
/**
 * Simulate Play:
 *  
 */

try {
    const tileKeys = Object.keys(TileSet); // <<-- 'tileKeys' is declared with 'const'
    console.log("TileSet keys:", tileKeys);

    if (tileKeys.length > 0) {
        console.log("First key:", tileKeys[0]);
    } else {
        console.log("No keys found in TileSet.");
    }

    const unsortedTiles = ["🀈", "🀇", "🀉"];
    const sorted = sortTiles(unsortedTiles);
    console.log("Sorted tiles:", sorted);

} catch (error) {
    console.error("Error accessing TileSet:", error);
}
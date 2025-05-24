
let playerYou = [];
let playerOpposite = [];
let playerLeft = [];
let playerRight = [];
let deck = []
let order = [playerLeft, playerOpposite, playerRight, playerYou];
let currentPlayer = ["playerLeft", 'playerOpposite', "playerRight", "playerYou"]
let drawnTile = undefined
let turn = 0
let discardYou = []
let discardOpposite = []
let discardLeft = []
let discardRight = []

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
    discardOrder = [discardLeft, discardOpposite, discardRight, discardYou];
    turn = 0
    let youDiscard = document.getElementById("discard-you")
    let oppositeDiscard = document.getElementById("discard-opposite")
    let leftDiscard = document.getElementById("discard-left")
    let rightDiscard = document.getElementById("discard-right")
    loadDiscards(discardYou, youDiscard)
    loadDiscards(discardOpposite, oppositeDiscard)
    loadDiscards(discardLeft, leftDiscard)
    loadDiscards(discardRight, rightDiscard)
    ManageDeck()
    // deck has been prepared
    // set turn to player
    // add tile to draw
    // tile clicked adds to discard
    
    ForcePlay()
}

let playID;
let interval = 100
function ForcePlay(inter = 100) {
    interval = inter
    playID = setInterval(playTurn, interval)
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
        clearInterval(playID);
        return
    }
    var tile = deck.pop()
    console.log(`Drawing tile: ${tile}`)
    let turnString = document.getElementById("current-turn")
    turnString.textContent = `It is player [${currentPlayer[turn%4]}]'s turn`
    if (currentPlayer[turn % 4] === "playerYou") {
        clearInterval(playID);
        // if its players turn
        // player can draw a tile~
        // so create tile and place in player-drawn
        playerDrawn = document.getElementById("drawn-you")
        drawnTile = tile
        const tileString = TileSet[tile];
        const node = document.createElement("div");
        node.classList.add("single-piece");
        if (tile == "REDDRAGON") {
            console.log(tile)
            node.classList.add("red", "dragon");
        } else if (tile == "GREENDRAGON") {
            console.log(tile)
            node.classList.add("green", "dragon");
        } else if (tile == "WHITEDRAGON") {
            console.log(tile)
            node.classList.add("white", "dragon");
        }
        const textnode = document.createTextNode(tileString);
        node.appendChild(textnode);
        playerDrawn.appendChild(node)
        node.onclick = function() {
            addDiscard(drawnTile, turn)
            // player can also discard a tile
            turn  += 1
            turnString.textContent = `It is player [${currentPlayer[(turn)%4]}]'s turn`
            // clear the drawn section
            while (playerDrawn.firstChild){
                playerDrawn.removeChild(playerDrawn.firstChild)
            }
            drawnTile = undefined
            playID = setInterval(playTurn, interval)
        };
    } else {
        // we need to be able to sleep for a bit to pretend
        turnString.textContent = `It is player [${currentPlayer[(turn+1)%4]}]'s turn`
        UpdateCount()
        addDiscard(tile,turn)
        turn  += 1
    }

}

const snap = new Audio('https://cdn.freesound.org/previews/265/265291_5003039-lq.ogg');

function loadDiscards(discardList, discardElement) {

    while (discardElement.firstChild) {
        discardElement.removeChild(discardElement.firstChild)
    }
    for (let index = 0; index < discardList.length; index++) {
        let tile = discardList[index]
        console.log(tile)
        const tileString = TileSet[tile];
        const node = document.createElement("div");
        node.classList.add("single-piece");
        if (tile == "REDDRAGON") {
            console.log(tile)
            node.classList.add("red", "dragon");
        } else if (tile == "GREENDRAGON") {
            console.log(tile)
            node.classList.add("green", "dragon");
        } else if (tile == "WHITEDRAGON") {
            console.log(tile)
            node.classList.add("white", "dragon");
        }
        const textnode = document.createTextNode(tileString);
        node.appendChild(textnode);
        discardElement.appendChild(node)
    }
}

function addDiscard(tile, turn) {
    snap.play()
    let player = currentPlayer[turn % 4]
    let playersDiscard;
    // get the player we are dealing with
    switch (player) {
        case ("playerYou"):
            playersDiscard = document.getElementById("discard-you")
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
    const tileString = TileSet[tile];
    const node = document.createElement("div");
    node.classList.add("single-piece");
    if (tile == "REDDRAGON") {
        console.log(tile)
        node.classList.add("red", "dragon");
    } else if (tile == "GREENDRAGON") {
        console.log(tile)
        node.classList.add("green", "dragon");
    } else if (tile == "WHITEDRAGON") {
        console.log(tile)
        node.classList.add("white", "dragon");
    }
    if (turn % 3 == 0) {
        node.classList.add("riichi");
    }
    const textnode = document.createTextNode(tileString);
    node.appendChild(textnode);
    playersDiscard.appendChild(node)
    UpdateCount()
}

function winCondition() {

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
        tile = deck.pop()
        order[index % 4].push(tile)
        index += 1
    }
    for (hand in order) {
        order[hand] = order[hand].sort(sortTiles)
    }
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

function cleanDiscards() {

}

function UpdateCount() {
    // update tile count
    const count = document.getElementById("remaining-count")
    count.textContent = `Remaining Tiles: ${deck.length}`
}

// show the tiles to the players
function showTiles(player = "playerYou", hand) {
    let playersHand;
    // get the player we are dealing with
    switch (player) {
        case ("playerYou"):
            playersHand = document.getElementById("players-hand")
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
        const tileString = TileSet[tile];
        const node = document.createElement("div");
        node.classList.add("single-piece");
        if (tile == "REDDRAGON") {
            console.log(tile)
            node.classList.add("red", "dragon");
        } else if (tile == "GREENDRAGON") {
            console.log(tile)
            node.classList.add("green", "dragon");
        } else if (tile == "WHITEDRAGON") {
            console.log(tile)
            node.classList.add("white", "dragon");
        }
        const textnode = document.createTextNode(tileString);
        node.appendChild(textnode);
        playersHand.appendChild(node)
        if (player === "playerYou") {
            node.onclick = function() {
                // console.log(`It is ${currentPlayer[turn%4]}'s turn, we are clicking ${tile}, which is in ${playersHand.textContent}, ` + 
                //     `\n\twhich contains ${hand}, and the specific element clicked was ${node}`
                // )
                playerDiscard(index, hand, node, playersHand)
            }
        }
    }
        
}

const playerDiscard = (index, hand, node, playersHand) => {
    if (tile === undefined || hand === undefined || node === undefined || playersHand === undefined || drawnTile === undefined)
    {
        console.log("AHHHHHHHHHHHHHHHHHH!")
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
        playerDrawn = document.getElementById("drawn-you")
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
 * Create variable mahjongDeck of repeating ordered mahjong tiles
 */
function CreateDeck() {
    // for each mahjong tile type
    // add to deck four times
    // shuffle deck
    // return deck
    let deck = []
    for (tile in TileSet) {
        // console.log(tile)
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

function sortTiles(a, b) { 
    keys = Object.keys(TileSet)
    if (keys.indexOf(a) > keys.indexOf(b)) {
        return 1
    } else {
        return -1
    } 
} 
const TileSet = {
    ONECHARACTER: "🀇",
    TWOCHARACTER: "🀈",
    THREECHARACTER: "🀉",
    FOURCHARACTER: "🀊",
    FIVECHARACTER: "🀋",
    SIXCHARACTER: "🀌",
    SEVENCHARACTER: "🀍",
    EIGHTCHARACTER: "🀎",
    NINECHARACTER: "🀏",
    ONEPIN: "🀙",
    TWOPIN: "🀚",
    THREEPIN: "🀛",
    FOURPIN: "🀜",
    FIVEPIN: "🀝",
    SIXPIN: "🀞",
    SEVENPIN: "🀟",
    EIGHTPIN: "🀠",
    NINEPIN: "🀡",
    ONEBAMBOO: "🀐",
    TWOBAMBOO: "🀑",
    THREEBAMBOO: "🀒",
    FOURBAMBOO: "🀓",
    FIVEBAMBOO: "🀔",
    SIXBAMBOO: "🀕",
    SEVENBAMBOO: "🀖",
    EIGHTBAMBOO: "🀗",
    NINEBAMBOO: "🀘",
    EASTWIND: "🀀",
    SOUTHWIND: "🀁",
    WESTWIND: "🀂",
    NORTHWIND: "🀃",
    WHITEDRAGON: "🀆",
    GREENDRAGON: "🀅",
    REDDRAGON: "🀄︎"
}
const TILEBACK = "🀫"

function test() {
    console.log(typeof TileSet)
    CreateDeck()
}
//  	 	🀢 	🀣 	🀤 	🀥 	🀦 	🀧 	🀨 	🀩 	🀪 	
document.addEventListener('DOMContentLoaded', ManageDeck(), false)
/**
 * Simulate Play:
 *  
 */
import { connectGame, interrupt, playDiscardSound, resume, showButtons, timer, updateUI } from "./main.js";
import { Meld, MeldType } from "./melds.js";
import { Player } from "./player.js";
import { BUTTONLIST, PLAYERACTION, TileSet } from "./utils.js"

export class MahjongGame {
    players = [];
    turn = 0;
    deck = [];
    human;
    waitingTiles;
    waitingCommand;
    wantedCommand;
    waitingData;

    constructor(turn=0) {
        this.deck = this.CreateDeck()
        let humanDeck = [];
        let leftDeck = [];
        let oppositeDeck = [];
        let rightDeck = [];
        for (let i = 0; i < 13*4; i++) {
            switch (i%4) {
                case 0:
                    humanDeck.push(this.deck.pop())
                    break;
                case 1:
                    leftDeck.push(this.deck.pop())
                    break;
                case 2:
                    oppositeDeck.push(this.deck.pop())
                    break;
                case 3:
                    rightDeck.push(this.deck.pop())
                    break;
                default:
                    break;
            }
        }
        this.human = new Player("You",humanDeck);
        let player2 = new Player("Left",leftDeck);
        let player3 = new Player("Opposite",oppositeDeck);
        let player4 = new Player("Right",rightDeck);
        this.players.push(this.human, player2, player3, player4);
        
    }

    randomizeTurn() {this.turn = Math.floor(Math.random()*4)}

    currentPlayer() {return this.players[this.turn%4]}
    getTurn() {return this.turn}
    getPlayers() {return this.players}
    getDeck() {return this.deck}

    NextRound() {
        let currentPlayer = this.players[this.turn % 4]
        let nextTile = this.deck.pop()
        currentPlayer.drawTile(nextTile)
        let direction;
        switch(this.turn) {
            case 0:
                direction ="self";
                break;
            case 1:
                direction ="left";
                break;
            case 2:
                direction ="opposite";
                break;
            case 3:
                direction ="right";
                break;
            default:
                break;
        }
        updateUI()
        if (this.turn % 4 == 0) {
            // interrupt()
            console.log(`Your deck:\n${currentPlayer.toString()}`);
            this.wantedCommand = PLAYERACTION.DISCARD
            showButtons(BUTTONLIST.DISCARD)
            // let discard = prompt("What tile do you want to discard?");
            // let success = currentPlayer.discardTile(discard);
        // this.turn++
        } else {
            currentPlayer.discardTile(nextTile);
            updateUI()

            let chiiCalls = Array.from(this.human.checkChii(nextTile));
            let kanAble = this.human.kanCalls(nextTile);
            let ponAble = kanAble != null? kanAble.slice(0,3) :  this.human.ponCalls(nextTile)
            let callCheck = (chiiCalls.length > 0) || (ponAble != null)
            if (callCheck) {
                interrupt()
                let output = `You can call on ${nextTile}!`
                chiiCalls.forEach( (chii, index) => {
                    console.log(index)
                    output += `\nchii${index}: [${chii}]`
                })
                if (ponAble != null) {
                    output += `\npon: [${ponAble}]`
                    if (kanAble != null) {
                        output += `\nkan: [${kanAble}]`
                    }
                }
                let stolen = this.callPrompt(output, currentPlayer, chiiCalls, nextTile, direction, ponAble, kanAble);
                // console.log(this.human.toString())
            }
            this.turn++
        }
        if (this.deck.length == 0) return false
        return true
    }


    callPrompt(output, currentPlayer, chiiCalls, nextTile, direction, ponAble, kanAble) {
        let answer = prompt(output);
        if (answer == null) {return}
        if (answer.startsWith("chii")) {
            currentPlayer.stealDiscard();
            let chosenIndex = parseInt(answer[4]);
            console.log(chosenIndex);
            let chosen = chiiCalls[chosenIndex];
            console.log(chosen);
            let meld = new Meld(MeldType.Chii, chosen, nextTile, direction);
            this.human.addMeld(meld);
            return true;
        } else if (answer.startsWith("pon")) {
            currentPlayer.stealDiscard();
            let meld = new Meld(MeldType.Pon, ponAble, nextTile, direction);
            this.human.addMeld(meld);
            return true;
        } else if (answer.startsWith("kan")) {
            currentPlayer.stealDiscard();
            let meld = new Meld(MeldType.Kan, kanAble, nextTile, direction);
            this.human.addMeld(meld);
            return true;
        } else if (answer != null) {
            this.callPrompt(output, currentPlayer, chiiCalls, nextTile, direction, ponAble, kanAble)
        } else {
            return false
        }
    }

    forceChii() {
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        let meldList = ["ONEBAMBOO","TWOBAMBOO"]
        let stolen = "THREEBAMBOO"
        this.human.addTile("ONEBAMBOO")
        this.human.addTile("TWOBAMBOO")
        let meld = new Meld(MeldType.Chii, meldList, stolen, "left")
        this.human.addMeld(meld)
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        meldList = ["ONEBAMBOO","TWOBAMBOO"]
        stolen = "THREEBAMBOO"
        this.human.addTile("ONEBAMBOO")
        this.human.addTile("TWOBAMBOO")
        meld = new Meld(MeldType.Chii, meldList, stolen, "right")
        this.human.addMeld(meld)
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        meldList = ["ONEBAMBOO","TWOBAMBOO"]
        stolen = "THREEBAMBOO"
        this.human.addTile("ONEBAMBOO")
        this.human.addTile("TWOBAMBOO")
        meld = new Meld(MeldType.Chii, meldList, stolen, "opposite")
        this.human.addMeld(meld)
    }

    forcePon() {
        let meldList = ["REDDRAGON","REDDRAGON"]
        let stolen = "REDDRAGON"
        this.human.addTile("REDDRAGON")
        this.human.addTile("REDDRAGON")
        let meld = new Meld(MeldType.Pon, meldList, stolen, "left")
        this.human.addMeld(meld)
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        meldList = ["WHITEDRAGON","WHITEDRAGON"]
        stolen = "WHITEDRAGON"
        this.human.addTile("WHITEDRAGON")
        this.human.addTile("WHITEDRAGON")
        meld = new Meld(MeldType.Pon, meldList, stolen, "right")
        this.human.addMeld(meld)
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        this.human.moveToDiscard(this.human.getHand()[0])
        meldList = ["GREENDRAGON","GREENDRAGON"]
        stolen = "GREENDRAGON"
        this.human.addTile("GREENDRAGON")
        this.human.addTile("GREENDRAGON")
        meld = new Meld(MeldType.Pon, meldList, stolen, "opposite")
        this.human.addMeld(meld)
    }


    CreateDeck() {
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
        // console.log(deck)
        let shuffled = deck.map (value => ({value, sort: Math.random()}))
                            .sort( (a,b) => a.sort - b.sort)
                            .map(({ value }) => value);
        return shuffled
    }

    forceDiscard() {
        let currentPlayer = this.players[this.turn%4];

        let nextTile = this.deck.pop();
        currentPlayer.drawTile(nextTile)
        currentPlayer.discardTile(nextTile)

        this.turn++;
    }

    discardManagement(chosenTiles, action) {
        console.log(chosenTiles)
        console.log(action)
        if (action != PLAYERACTION.DISCARD) {return}
        if (chosenTiles.length > 1) {return}
        let success = this.human.discardTile(chosenTiles[0])
        if (!success) {return}
        this.turn++
        updateUI()
        playDiscardSound()
        resume()
    }

    playerAction(chosenTiles, action) {
        switch (this.wantedCommand) {
            case PLAYERACTION.DISCARD:
                this.discardManagement(chosenTiles, action)
                break;
            default:
                break;
        }
    }
}
export function StartGame() {
    let game = new MahjongGame()
    connectGame(game)
}
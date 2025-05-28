import { Meld, MeldType } from "./melds.js";
import { sortTiles, TileSet, tileSearch } from "./utils.js";

export class Player {
    hand = [];
    name;
    discard = []
    shownTiles = []
    drawn = null;
    /**
     * 
     * @param {string} name name of player
     * @param {string[]} hand: sorted list of string TileSet elements
     */
    constructor(name, hand) {
        this.name = name;
        this.hand = hand.sort(sortTiles);
    }

    getName() {return this.name}
    getHand() {return this.hand}
    tileCount() {return this.drawTile == null ? this.hand.length + 1 : this.hand.length}
    handCount() {return this.hand.length}
    getDiscard() {return this.discard}
    getShown() {return this.shownTiles}
    getDrawn() {return this.drawn}

    toString() {
        let result = `${this.name} has ${this.handCount()} tiles in hand\nTheir hand consists of ${this.hand.join(', ')}`
        if (this.drawn != null) result += `\nThey drew a ${this.drawn}`
        let shown = ``
        result += `\nWith The Following Shown Tiles:`
        for (let meld in this.shownTiles) {
            shown += this.shownTiles[meld].toString()
        }
        result += shown
        result += `\nTheir Discard Has ${this.discard.length} tiles:\n\t${this.discard.join()}`
        return result
    }

    addTile(tile) {
        this.hand.push(tile)
        this.hand.sort(sortTiles)
    }
    
    drawTile(tile) {
        this.drawn = tile;
    }

    stealDiscard() {
        return this.discard.pop()
    }

    moveToDiscard(tile) {
        let tileIndex = tileSearch(this.hand, tile, 0, this.hand.length)
        if (tile === this.hand[tileIndex]) {
            this.hand.splice(tileIndex,1)
            this.discard.push(tile)
            return true
        } else {
            return false
        }
    }

    discardTile(tile) {
        // console.log(`Trying to discard: ${tile}`)
        if (this.drawn === tile) {
            this.drawn = null;
            console.log(`${this.name} is discarding ${tile}`)
            this.discard.push(tile)
            return true
        }

        let tileIndex = tileSearch(this.hand, tile, 0, this.hand.length)
        if (this.moveToDiscard(tile)) {
            console.log(`${this.name} is discarding ${tile}`)
            this.addTile(this.drawn)
            this.drawn = null;
            return true
        }
    }
    
    replaceFirst(tile) {
        this.hand.shift()
        this.addTile(tile)
    }

    upgradeMeld(meld) {
        console.log(this.shownTiles)
        this.shownTiles = this.shownTiles.filter( (replaceMeld) => {
            return replaceMeld.getType() != "pon" && replaceMeld.getStolen() != meld.getStolen()
        })
        this.shownTiles.push(meld)
    }

    addMeld(meld) {

        if (meld.getType() == "kan" && meld.isUpgraded()) {
            // upgraded pon to kan
            this.upgradeMeld(meld)
            return
        }
        // remove the tiles from hand
        console.log(this.shownTiles)
        let removable = meld.getInHand()
        for (let index in removable) {
            let tile = removable[index]
            this.hand.splice(this.hand.indexOf(tile),1)
        }
        console.log(this.shownTiles)

        this.shownTiles.push(meld)
        console.log(this.shownTiles)
    }

    /**
     * Checks for all possible chii calls given a tile
     * @param {*} tile 
     * @returns 
     */
    checkChii(tile) {
        let sequences = new Set();
        let keys = Object.keys(TileSet)
        let tileIndex = keys.indexOf(tile)
        let start = tileIndex - 2 > 0? tileIndex-2 : 0
        let end = tileIndex + 2 <= keys.indexOf("NINEBAMBOO")? tileIndex+2 : keys.indexOf("NINEBAMBOO")
        // now deal with crossing suits
        while (start%9 >= 7) {
            // worst case: tileIndex is a 1 of something (index%9=0),
            // if thats the case start would be an 8 of something (index%9=7)
            // this means start is in previous suit, so move it up
            start++
        }
        // do the same with end
        while (end%9 < 2) {
            end--
        }
        let necessary = keys.slice(start, end)
        for (let i = 1; i < 4; i++) {
            let first = necessary[i-1]
            let second = necessary[i]
            let third = necessary[i+1]
            if (third == tile) {
                // first and second need to be in hand for a call
                if (this.hand.includes(first) && this.hand.includes(second)) {
                    // console.log(first, second, third)
                    sequences.add( [first, second] )
                }
            } else if (second == tile) {
                // first and third
                if (this.hand.includes(first) && this.hand.includes(third)) {
                    sequences.add( [first, third] )
                }
            } else {
                // second and third
                if (this.hand.includes(second) && this.hand.includes(third)) {
                    sequences.add( [second, third] )
                }
            }
        }
        return sequences
    }

    ponCalls(tile) {
        let count = this.hand.filter(x => x == tile).length
        if (count >= 2) {
            return this.hand.filter(x => x == tile)
        } else {
            return null
        }
    }

    kanCalls(tile) {
        let count = this.hand.filter(x => x == tile).length
        if (count >= 3) {
            return this.hand.filter(x => x == tile)
        } else {
            return null
        }
    }
}
export class Meld {

    meldType;
    tileList = []
    direction;
    stolen;
    upgraded;

    constructor(meldType, tileList, stolen, direction="opposite", upgraded=false) {
        this.meldType = meldType
        this.tileList = tileList
        this.direction = direction
        this.stolen = stolen
        this.upgraded = upgraded;
    }

    getInHand() {return this.tileList}
    getStolen() {return this.stolen}
    getDirection() {return this.direction}
    getType() {return this.meldType}
    isUpgraded() {return this.upgraded}

    toString() {
        return `\n\t${this.meldType} of ${this.tileList.join(', ')} : ${this.stolen}}`
    }
}

export const MeldType = {
    Chii: "chii",
    Pon: "pon",
    Kan: "kan"
}
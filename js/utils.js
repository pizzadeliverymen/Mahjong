export function Meld(meldType, tileList) {
    this.meldType = meldType
    this.tileList = tileList
}

export const MeldType = {
    Chii: "chii",
    Pon: "pon",
    Kan: "kan"
}

export function sortTiles(a, b) {
    let keys = Object.keys(TileSet);
    if (keys.indexOf(a) > keys.indexOf(b)) {
        return 1;
    } else {
        return -1;
    }
}
export const TileSet = {
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
};
const TILEBACK = "🀫";


console.log(`utils.js loaded. TileSet: ${TileSet}\n${Object.keys(TileSet)}`)
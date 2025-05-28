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
export const TILEBACK = "🀫";

export const tileSearch = function (hand, tile, start, end) {

    // Base Condition
    if (start >= end) return start;

    // Find the middle index
    let mid = Math.floor((start + end) / 2);
    // console.log(`\tthe middle tile between ${start} and ${end} is ${hand[mid]} at ${mid}, checking against ${tile}`)
    // Compare mid with given key x
    if (hand[mid] === tile) return mid;

    // If element at mid is greater than x,
    // search in the left half of mid
    if (sortTiles(hand[mid], tile) == 1)
        return tileSearch(hand, tile, start, mid - 1);
    else
        // If element at mid is smaller than x,
        // search in the right half of mid
        return tileSearch(hand, tile, mid + 1, end);
}


export const PLAYERACTION = {
    DISCARD: "discard",
    CHII: "chii",
    PON: "pon",
    KAN: "kan",
    RIICHI: "riichi",
    CANCEL: "cancel"
}

export const BUTTONLIST = PLAYERACTION
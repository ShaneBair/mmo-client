export interface TilesetInfo {
    key: string;
    path: string;
}

const tilesetDB: Record<string, TilesetInfo> = {
    terrain: {
        key: "terrain",
        path: "assets/map/tiles/terrain.png"
    },
    castle: {
        key: "castle",
        path: "assets/map/tiles/castle.png"
    },
    outside: {
        key: "outside",
        path: "assets/map/tiles/outside.png"
    },
    house: {
        key: "house",
        path: "assets/map/tiles/house.png"
    },
    doors: {
        key: "doors",
        path: "assets/map/tiles/animated/doors.png"
    },
    water: {
        key: "water",
        path: "assets/map/tiles/water.png"
    },
    inside: {
        key: "inside",
        path: "assets/map/tiles/inside.png"
    }
};

export default tilesetDB;
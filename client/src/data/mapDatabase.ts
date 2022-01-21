export interface MapInfo {
    key: string;
    path: string;
}

const mapDB: Record<string, MapInfo> = {
    DemoScene: {
        key: "DemoScene",
        path: "assets/map/DemoScene.json"
    },
    DemoInn: {
        key: "DemoInn",
        path: "assets/map/DemoInn.json"
    }
};

export default mapDB;
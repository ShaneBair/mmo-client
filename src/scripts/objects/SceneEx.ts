import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import { TiledProperty } from "./TiledHelpers";

export interface SceneHandoffData {
    transitionProperties?: TiledProperty[];
}

export default class SceneEx extends Phaser.Scene {
    matterCollision: PhaserMatterCollisionPlugin;
}
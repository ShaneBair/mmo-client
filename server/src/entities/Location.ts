export class Location {
  mapName?: string;
  x?: number;
  y?: number;
  z?: number;

  public constructor(data?: Location) {
    if (data) {
      this.mapName = data.mapName;
      this.x = data.x;
      this.y = data.y;
      this.z = data.z;
    }
  }
}

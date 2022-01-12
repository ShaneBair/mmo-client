export interface TiledProperty {
    name: string;
    type: string;
    value: any;
}


export function findPropertyByName(properties: TiledProperty[] | object[] | undefined, name: string): TiledProperty | undefined {
    if(!properties) return undefined;

    return (properties as TiledProperty[])?.find(prop => {
        if(prop.name === name) {
            return prop;
        }
        else {
            return undefined;
        }
    });
}
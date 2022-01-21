export interface TiledProperty {
    name: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
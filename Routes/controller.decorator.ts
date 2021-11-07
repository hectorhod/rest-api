import 'reflect-metadata'

export enum MetadataKeys {
    BASE_PATH = 'base_path',
    ROUTERS = 'routers',
}

export const controller = function(path:string):ClassDecorator{
    return(target =>{
        Reflect.defineMetadata(MetadataKeys.BASE_PATH, path, target)
    })
        
}
export function validateRelativePath(path:string){
    if(path.match(/^\.\//)){
        return path;
    }
    return `./${path}`
}

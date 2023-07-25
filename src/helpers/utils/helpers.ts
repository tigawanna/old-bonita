import {strings} from "gluegun-toolbox"

export function validStr(word:string){
if(word){
    return strings.isBlank(word) ? undefined : word
}
}

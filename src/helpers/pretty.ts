import kleur from 'kleur';

export function logError(message:string,...content:any) {
    console.error(kleur.red(message),content);
    console.log("===============================")
}

export function logSuccess(message:string,...content:any) {
    console.log(kleur.green(message),content);
        console.log("===============================");
}

export function logWarning(message:string,...content:any) {
    console.log(kleur.yellow(message),content);
        console.log("===============================");
}

export function logNormal(message:string,...content:any) {
    console.log(kleur.blue(message),content);
        console.log("===============================");
}

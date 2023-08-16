import { allDepsArray,filterAndIgnoreDeps,filterAndIncludeDeps } from "@/utils/helpers/pkg-json";
import { addTanstackViteReactDeps } from "@/utils/installers/tanstack/vite/vite-spa";


// filterAndIgnoreDeps("tailwind",{tailwind:{

//     dev:{
//         "tailwind-scrollbar": "latest",
//         "tailwindcss": "latest",
//         "autoprefixer": "latest",
//     }
// }})
// .then((deps) => {
//     console.log("all deps response",deps);
// }).catch((error) => {
//     console.log(error);
// })

addTanstackViteReactDeps().then((deps) => {
    console.log("tw deps",deps);
})
.catch((error) => {
    console.log(error);
})

import { allDepsArray,filterAndIgnoreDeps,filterAndIncludeDeps } from "@/utils/helpers/pkg-json";


filterAndIgnoreDeps("tailwind",{tailwind:{

    dev:{
        "tailwind-scrollbar": "latest",
        "tailwindcss": "latest",
        "autoprefixer": "latest",
    }
}})
.then((deps) => {
    console.log("all deps response",deps);
}).catch((error) => {
    console.log(error);
})

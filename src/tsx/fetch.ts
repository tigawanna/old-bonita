import { addDepsToPackageJsons } from "@/utils/helpers/pkg-json";
addDepsToPackageJsons(["react", "react-dom"],false).then((data) => {
    console.log(data);
}).catch((error) => {
    console.log("error getting package.json",error);
})



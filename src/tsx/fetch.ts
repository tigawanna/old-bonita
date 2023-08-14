import { getNpmPackageVersion } from "@/utils/helpers/pkg-manager/npm";


getNpmPackageVersion("tailwindcss").then((data) => {
    console.log(data);
}).catch((error) => {
    console.log("error getting package.json", error);
})

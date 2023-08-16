import { getNpmPackageVersion } from "@/utils/helpers/pkg-manager/npm";


getNpmPackageVersion("tailwindcss","latest").then((data) => {
    console.log(data);
}).catch((error) => {
    console.log("error getting package.json", error);
})

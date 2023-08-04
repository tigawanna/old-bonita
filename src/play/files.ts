import { writeOrOverWriteFile } from "@/utils/helpers/fs/files";

writeOrOverWriteFile("huura/test.ts", "test").then(() => {
    console.log("done");
}).catch((error) => {
    console.log(error);
})

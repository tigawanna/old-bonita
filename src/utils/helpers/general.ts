import { strings } from "gluegun-toolbox";

export function validStr(word: string) {
  if (word) {
    return strings.isBlank(word) ? undefined : word;
  }
}

export function validateRelativePath(path: string) {
  if (path.match(/^\.\//)) {
    return path;
  }
  return `./${path}`;
}

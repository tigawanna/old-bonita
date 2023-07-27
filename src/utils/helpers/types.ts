export type KeyStringObject = { [key: string]: string };

export interface IPackageJson {
  name: string;
  private?: boolean;
  version: string;
  type?: string;
  scripts: KeyStringObject;
  dependencies: KeyStringObject;
  devDependencies: KeyStringObject;
  [key: string]: any | undefined;
}

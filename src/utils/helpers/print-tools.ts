import kleur from "kleur";

/**
 * Print a blank line.
 */
function newline() {
  console.log("");
}

/**
 * Prints a divider line
 */
function divider() {
  console.log(
    kleur.yellow(
      "---------------------------------------------------------------",
    ),
  );
}

export function error(message: any, content?: any) {
  console.log(kleur.red(message) + "\n", content);
}

export function success(message: any, content?: any) {
  console.log(kleur.green(message) + "\n", content);
}

export function warning(message: any, content?: any) {
  console.log(kleur.yellow(message) + "\n", content);
}

export function info(message: any, content?: any) {
  console.log(kleur.blue(message) + "\n", content);
}

function fancy(message: any): void {
  console.log(kleur.italic(message));
}

function debug(message: string, title = "DEBUG"): void {
  const topLine = `vvv -----[ ${title} ]----- vvv`;
  const botLine = `^^^ -----[ ${title} ]----- ^^^`;

  console.log(kleur.magenta(topLine));
  console.log(message);
  console.log(kleur.magenta(botLine));
}

function highlight(message: string): void {
  console.log(kleur.bold(message));
}

function muted(message: string): void {
  console.log(kleur.bgCyan(message));
}

const checkmark = kleur.green("✔︎");
const xmark = kleur.red("ⅹ");

const printHelpers = {
  newline,
  divider,
  fancy,
  info,
  error,
  warning,
  debug,
  success,
  highlight,
  muted,
  checkmark,
  xmark,
};

export { printHelpers };

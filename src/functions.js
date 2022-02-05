import chalk from "chalk";

export function print(args) {
    console.log(args);
   }

export function usage(){
    console.log(chalk.dim("\nGenerate graphs images by parsing a folder containing their JSON config files.\n"));
    console.log(chalk.red(" Use:"));
    console.log("       generate-images <folder-name>\n")
}

export function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
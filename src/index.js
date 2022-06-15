#!/usr/bin/env node

import {generateImages} from "./generate-images.js";
import {usage} from "./functions.js";
import chalk from "chalk";

const args = process.argv;

let image_size = 1000;

if ((args.length < 3) || (args.length > 6)) {
    spinner.stop();
    usage();
    process.exit(1);
} else {
    if (args[4]) {
        image_size = args[4];
    }

    //check given folder of JSONs
    var folder_path = args[2];
    var format = args[3];
    var options = "";
    if (args[5]) {
        options = args[5];
    }

    if (!format || (format !== 'png' && format !== 'jpeg' && format !== 'jpg')) {
        spinner.fail(chalk.red(`${format} is not a valid format. Please insert a valid format from: png|jpeg|jpg`))
        process.exit(1)
    }
}

generateImages(folder_path, format, image_size)
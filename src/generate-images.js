import {print} from "./functions.js";
import fs from 'fs';
import chalk from 'chalk';
import * as echarts from 'echarts';
import {JSDOM} from 'jsdom';
import ora from "ora";
import * as svgExport from 'svgexport'
import * as path from "path";

export async function generateImages(folder_path, format, image_size, options) {

    // just a lil animation in the terminal
    const spinner = ora('working');
    print('\n');
    spinner.start();

    // variables
    var counter = 0;

    if (!fs.existsSync(folder_path)) {
        if (err) {
            spinner.fail(chalk.red(`Could not find folder path ${folder_path}\n`));
            process.exit(1);
        }
    }

    let items = fs.readdirSync(folder_path)


    if (!items) {
        spinner.fail(chalk.red("Error on folder path\n"));
        process.exit(1);
    }

    //create new directory for generated charts
    const new_folder_name = path.relative(folder_path, 'GeneratedImages')
    if (!fs.existsSync(new_folder_name)) {
        fs.mkdirSync(new_folder_name)
    }


    //read each folder entry
    for (var i = 0; i < items.length; i++) {
        if (!items[i].endsWith(".json")) {
            spinner.warn(chalk.yellow(`Wrong file type at ${items[i]}\n`));
            continue;
        }

        var filepath = folder_path + '/' + items[i];
        var data = fs.readFileSync(filepath);

        //config object
        var option;
        try {
            option = JSON.parse(data);
        } catch (e) {
            option = "error";
        }

        if (option == "error") {
            spinner.warn(chalk.yellow(`Wrong JSON format on file ${items[i]}\n`));
            continue;
        }

        //generate chart
        echarts.setPlatformAPI(() => {
            return createCanvas(100, 100);
        });

        const {window} = new JSDOM();
        global.window = window;
        global.navigator = window.navigator;
        global.document = window.document;

        const root = document.createElement('div');
        root.style.cssText = 'width: 500px; height: 500px;';


        //prompt user for
        Object.defineProperty(root, "clientWidth", {value: image_size});
        Object.defineProperty(root, "clientHeight", {value: image_size});

        const chart = echarts.init(root, null, {
            renderer: 'svg'
        });

        chart.setOption(option);

        //save as svg
        var new_file = new_folder_name + '/' + items[i].substring(0, items[i].length - 4) + 'svg';

        fs.writeFileSync(new_file, root.querySelector('svg').outerHTML, 'utf-8');
        await svgExport.render({
            input: [new_file],
            output: [`${new_folder_name}/${items[i].substring(0, items[i].length - 4)}${format} ${options}`],
        }, process);

        chart.dispose();
        counter++;
    }
    spinner.succeed(chalk.green(" finished\n"));
    print(chalk.dim(`Generated ${counter} charts\n`));
}


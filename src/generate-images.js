#!/usr/bin/env node

import { print, sleep, usage } from "./functions.js";
import fs from 'fs';
import chalk from 'chalk';
import * as echarts from 'echarts';
import { JSDOM } from 'jsdom';
import ora from "ora";

//just a lil animation in the terminal
const spinner = ora('working');
print('\n');
spinner.start();
//sleep(500);

//check command-line args
const args = process.argv;
if (args.length != 3){
    spinner.stop();
    usage();
    process.exit(1);
}

//check given folder of JSONs
var folder_path = process.argv[2];
fs.readdir(folder_path, function(err, items){
    if (err) {
        spinner.fail(chalk.red("Error on folder path\n"));
        process.exit(1);
      }

    if(!items){
        spinner.fail(chalk.red("Error on folder path\n"));
        process.exit(1);
    }

    //create new directory for generated charts
    const new_folder_name = '../GeneratedImages'
    if (!fs.existsSync(new_folder_name)) {
        fs.mkdirSync(new_folder_name)
      }

        
    //read each folder entry
    for (var i=0; i<items.length; i++) {
        if(items[i].substring(items[i].length - 5, items[i].length) != '.json'){
            spinner.fail(chalk.red("Error encountered on a file type\n"));
            process.exit(1);
        }

        var filepath = folder_path + '/' + items[i];
        var data = fs.readFileSync(filepath);

        //config object
        var option;
        try{ 
            option = JSON.parse(data);
          } catch(e) { 
            spinner.fail(chalk.red("Error on JSON file format\n"));
            process.exit(1);
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
        
        Object.defineProperty(root, "clientWidth", {value: 1000});
        Object.defineProperty(root, "clientHeight", {value: 1000});
        
        const chart = echarts.init(root, null, {
            renderer: 'svg'
        });

        chart.setOption(option);

        //save as svg
        var new_file = '../GeneratedImages/'+ items[i].substring(0, items[i].length - 4) + 'svg';
        fs.writeFileSync(new_file, root.querySelector('svg').outerHTML, 'utf-8');

        chart.dispose();
    }    

    spinner.succeed(chalk.green(" finished\n"));
});

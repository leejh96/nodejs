#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
// argv[0] 노드설치경로
// argv[1] 현재실행하는 파일 경로
// argv[2] 타입, html할지 route할지
// argv[3] 파일명
// argv[4] 파일경로
let type = process.argv[2];
let name = process.argv[3];
let directory = process.argv[4] || '.';
let htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Template</title>
</head>
<body>
    <h1>Hello</h1>
    <p>CLI</p>
</body>
</html>
`;

const routerTemplate = `const express = require('express');
const router = express.Router();

router get('/', (req, res, next)=>{
    try{
        res.send('ok');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports =router;`;

const mkdirp = () =>{
    //사용자의 현재폴더가 html이고 입력한 위차가 html/css 일 경우
    //./css를 만들어주기위해 relative 사용  
    const dirname = path.relative('.', path.normalize(dir)).split(path.sep).filter(p=>!!p); 
    dirname.forEach((d, idx) => {
        if (!exist(pathBulider)){
            fs.mkdirSync(pathBulider);
        }
    });
};
const exist = () => {
    try{
        fs.accessSync(dir, fs, constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    }catch(e){
        return false;
    }
};
const makeTemplate = () =>{
    mkdirp(directory);
    if (type === 'html'){
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)){
            console.error(chalk.bold.red('이미 파일이 존재합니다.'));
        } else{
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, chalk.green('생성완료'));
        }
    }else if (type === 'express-router'){
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)){
            console.error(chalk.bold.red('이미 파일이 존재합니다.'));
        } else{
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, chalk.green('생성완료'));
        }
    }else{
        console.error('html 또는 express-router 둘 중하나를 입력하세요')
    }
}

let triggered = false;
program
    .version('0.0.1', '-v, --version')
    //설명을 담고있는 부분
    .usage('[options]');

program
//[]는 옵션으로 넣거나말거나, <>필수로 넣어야하는 부분
    .command('template <type>')
    .usage('--name <name> --path [path]')
    .description('템플릿을 생성합니다.')
    .alias('tmpl')
    //-n 이나 --name을 같은 명령어로 설정
    .option('-n, --name<name>', '파일명을 입력하세요', 'index')
    .option('-d, --directory [path]','생성 경로를 입력하세요','.')
    .action((type, options) => {
        makeTemplate(type, options.name, options.directory);
        triggered = true;
    });

program
    .command('*', {noHelp: true})
    .action(()=>{
        console.log('해당 명령어를 찾을 수 없습니다.');
        program.help();
        triggered = true;
    });

program
    .parse(process.argv);

if (!triggered){
    inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: '템플릿 종류를 선택하세요',
        choices: ['html', 'express-router'],
    },{
        type: 'input',
        name: 'name',
        message: '파일의 이름을 선택하세요',
        default: 'index',
    },{
        type: 'input',
        name: 'directory',
        message: '파일이 위치할 폴더의 경로를 입력하세요',
        default: '.', 
    },{
        type: 'confirm',
        name: 'confirm',
        message: '생성하시겠습니까?',
    }])
        .then((answer)=>{
            if (answer.confirm){
                makeTemplate(answer.type, answer.name, answer.directory);
                console.log(chalk.rgb(128,128,128)('터미널을 종료합니다.'));
            }
        });
}
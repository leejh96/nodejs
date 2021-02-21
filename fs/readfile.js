const fs = require('fs');

fs.readFile('./fs/readme.txt',(err,data)=>{
    if(err){
        throw err;
    }
    console.log(data); //버퍼
    console.log(data.toString());
});
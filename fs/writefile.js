const fs = require('fs');

fs.writeFile('./fs/writeme.txt', '글을 써주세요', (err,data)=>{
    if (err){
        throw err;
    }
    fs.readFile('./fs/writeme.txt',(err, data)=>{
        if (err){
            throw err;
        }
        console.log(data.toString());
    });
});
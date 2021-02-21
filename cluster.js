//여러개의 코어를 모두다 돌리기 위해 클러스터를 사용
const cluster = require('cluster');
const http = require('http');
const os = require('os');
const numCPUs = os.cpus().length;


// 마스터는 관리자, 워커는 cpu갯수만큼 생성
if (cluster.isMaster){
    console.log('마스터 프로세스 아이디', process.pid);
    for (let i = 0; i<numCPUs; i++){
        //워커를 만들어내는 명령어
        cluster.fork();
    }
    //코어가 하나 죽으면 다시 실행시킨다.
    cluster.on('exit', (worker, code, signal) => {
        console.log(cluster.worker.process.pid, '워커가 종료되었습니다.');
        cluster.fork();
    })
} 
else{
    http.createServer((req, res)=>{
        res.end('http server');
    }).listen(8000);
    console.log(process.pid,'워커실행');
}

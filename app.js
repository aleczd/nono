// Initialising Packages (Packages used: express, body-parser, fs)
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const child_process = require('child_process');
const fs = require('fs');

app.use(express.static('client'));

//Global Var
let meta = false
let info = false
let sol = false

app.post('/setup', urlencodedParser, function (req, resp) {
    meta = req.body
    sol = false

    resp.redirect('http://127.0.0.1:8090/')
})

app.post('/solve', urlencodedParser, function (req, resp) {
    let info = req.body
    let dim = meta.sizeSolve.split("x")
    let colour = false
    if (Object.keys(meta).length == 2){
        colour = true
    }
    
    let cols = []
    let rows = []
    let i2 = 0
    for (let i = 1; i <= parseInt(dim[0]); i++){
        let key = Object.keys(info)[i-1]
        cols.push(info[key])
        i2 = i
    } 
    for (let j = 1; j <= parseInt(dim[1]); j++){
        let key = Object.keys(info)[i2+j-1]
        rows.push(info[key])
    } 

    fs.writeFileSync('input.txt', colour.toString()+"\n");
    var log = fs.createWriteStream("input.txt",{
        flags: "a"
    })
    log.write(dim.toString()+"\n")
    for (let i = 1; i <= parseInt(dim[0]); i++){
        log.write(cols[i-1]+"\n")
    }
    for (let i = 1; i <= parseInt(dim[1]); i++){
        log.write(rows[i-1]+"\n")
    } 

    /* var solver = child_process.spawnSync("py", ["script.py"])
    console.log("Process finished.");
    if(solver.error) {
        console.log("ERROR: ",solver.error);
    }
    console.log("stdout: ",solver.stdout);
    sol = solver.stdout.toString() */

    var cp1 = child_process.spawn('py', ['script.py']);
    cp1.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        sol = data.toString()
    });
      
    cp1.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
      
    cp1.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        resp.redirect('http://127.0.0.1:8090/')
    });
});

app.get('/flicker', function (req, resp) {
    let passage = {
        "meta": meta,
        "info": info,
        "sol": sol
    }

    resp.send(passage)
});

module.exports = app;


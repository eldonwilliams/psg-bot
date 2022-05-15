import { config } from 'dotenv';
config();

import express from 'express';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

const app = express();

let botProcess: ChildProcess;

// This script was helped in large part by this post https://stackoverflow.com/questions/49837938/execute-script-from-node-in-a-separate-process

const start = () => {
    if (typeof botProcess !== "undefined" && !botProcess.killed) return;
    botProcess = spawn(process.argv[0], [path.join(__dirname, './bot')], {
        'detached': true,
        'stdio': [ 'ignore', process.stdout, process.stdin, ],
    });
}

const stop = () => {
    if (typeof botProcess === "undefined") return;
    if (botProcess.killed) return;
    botProcess.kill();
}

const restart = () => {
    if (typeof botProcess === "undefined") start();
    stop();
    start();
}

app.post('/restart', (req, res) => {
    console.log('RUNNER: RESTART');
    restart();
    res.status(200).send();
});

app.listen(process.env.RUNNER_PORT, () => {
    console.log('RUNNER: START');
    start();
});
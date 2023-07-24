const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('ssh2');

const app = express();
const conn = new Client();

app.use(bodyParser.json());

app.post('/pull', (req, res) => {
  const ssh = req.body.ssh;
  const repositoryPath = req.body.path;
  const branch = req.body.branch;
  const repositoryName = req.body.repository;

  console.log(`Recibido push en ${branch} para el proyecto ${repositoryName}`);
  
  if(branch.indexOf('master') > -1){
    conn.connect({
        host: ssh.host,
        port: ssh?.port ?? 22,
        username: ssh.username,
        password: ssh.password
      });
    const command = `cd ${repositoryPath}/${repositoryName} && git branch ${branch} && git pull`;
    conn.on('ready', function() {
        console.log('Client :: ready');
        conn.exec(command, function(err, stream) {
          if (err) throw err;
          stream.on('close', function(code, signal) {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
          }).on('data', function(data) {
            console.log('STDOUT: ' + data);
          }).stderr.on('data', function(data) {
            console.log('STDERR: ' + data);
          });
        });
      });
    return res.send(command);
  }

  return res.sendStatus(500);
});

app.listen(5000, () => {
  console.log('Servidor web escuchando en el puerto 5000');
});
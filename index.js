require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('ssh2');

const app = express();
const conn = new Client();

const HOST = process.env.SSH_HOST;
const PORT = process.env.SSH_PORT;
const USERNAME = process.env.SSH_USERNAME;
const PASSWORD = process.env.SSH_PASSWORD;
const PATH = process.env.REPOSITORY_PATH;

app.use(bodyParser.json());

app.post('/pull', (req, res) => {
  const repositoryName = req.body.name;
  console.log(`Recibido push para el proyecto ${repositoryName}`);
  
    conn.connect({
        host: HOST,
        port: PORT ?? 22,
        username: USERNAME,
        password: PASSWORD
      });
    const command = `cd ${PATH}/${repositoryName} && sudo git pull`;
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
});

app.listen(5000, () => {
  console.log('Servidor web escuchando en el puerto 5000');
});
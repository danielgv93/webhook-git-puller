const express = require('express');
const bodyParser = require('body-parser');
const child_process = require('child_process');
const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const sender = req.body.sender;
  const branch = req.body.ref;

  console.log(`Recibido push de ${sender.login} en ${branch}`);
  
  if(branch.indexOf('master') > -1){
    child_process.exec('cd /ruta/a/tu/proyecto && git pull');
  }

  return res.sendStatus(200);
});

app.listen(5000, () => {
  console.log('Servidor web escuchando en el puerto 5000');
});
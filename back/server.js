// recuperation du package http de node.js
const http = require('http');

// recuperation des fichiers 
const app = require('./app');

//creation du port Normalizer 
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
// ajout du port sur app
app.set('port', port);

// gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// creation du serveur
const server = http.createServer( app);
// si le serveur a une erreur sa nous la renvoie
server.on('error', errorHandler);
//csi tout est ok ok ecoute l'adresse et on y ajoute le port
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  // on renvoie ecoute sur et le port a la console pour dire que tout c'est bien passer
  console.log('Listening on ' + bind);
});

// on applique la fonction listen au server avec le port en argument
server.listen(port);

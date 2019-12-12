
module.exports = (app) => {
  
  var io = app.get('io');
  var firebase = app.get('firebase');
  
  io.on('connection', socket => {
        socket.on('sign-up-request', data => {
            var creds = JSON.parse(data);
            firebase.auth().createUserWithEmailAndPassword(creds.email, creds.password)
              .then(result => socket.emit('sign-up-success', JSON.stringify(result)))
              .catch(error => socket.emit('sign-up-failure', JSON.stringify(error)));
        });
      
      socket.on('log-in-request', data => {
          var creds = JSON.parse(data);
          firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
            .then(result => socket.emit('log-in-success', JSON.stringify(result)))
            .catch(error => socket.emit('log-in-failure', JSON.stringify(error)));
      });
      
      socket.on('log-out-request', data => {
          firebase.auth().signOut()
            .then(result => socket.emit('log-out-success', JSON.stringify(result)))
            .catch(error => socket.emit('log-out-failure', JSON.stringify(error)));
      });
      
      firebase.auth().onAuthStateChanged(data =>
        socket.emit('auth-state-changed', data ? JSON.stringify(data) : null));
  });
    
};

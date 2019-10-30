
module.exports = (app) => {
  
  var io = app.get('io');
  var firebase = app.get('firebase');
  
  io.on('connection', socket => {
        socket.on('sign-up-request', data => {
            firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
              .then(result => socket.emit('sign-up-success', result))
              .catch(error => socket.emit('sign-up-failure', error));
        });
      
      socket.on('log-in-request', data => {
          firebase.auth().signInWithEmailAndPassword(data.email, data.password)
            .then(result => socket.emit('log-in-success', result))
            .catch(error => socket.emit('log-in-failure', error));
      });
      
      socket.on('log-out-request', data => {
          firebase.auth().signOut()
            .then(result => socket.emit('log-out-success', result))
            .catch(error => socket.emit('log-out-failure', error));
      });
      
      firebase.auth().onAuthStateChanged(data => socket.emit('auth-state-changed', data));
  });
    
};

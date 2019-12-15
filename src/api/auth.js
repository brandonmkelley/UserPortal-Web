
module.exports = (app) => {
  var io = app.get('io');
  var firebase = app.get('firebase');
  
  io.on('connection', socket => {
    socket.on('begin-auth', () => {
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);
      
      firebase.auth(firebaseApp).onAuthStateChanged(user => {
        if (user)
          socket.join(user.email);
          
        else
          socket.leaveAll();
        
        socket.emit('auth-state-changed', JSON.stringify(user));
      });
    });
    
    socket.on('sign-up-request', data => {
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);
      
      var creds = JSON.parse(data);
      
      firebase.auth(firebaseApp).createUserWithEmailAndPassword(creds.email, creds.password)
        .then(result => socket.emit('sign-up-success', JSON.stringify(result)))
        .catch(error => socket.emit('sign-up-failure', JSON.stringify(error)));
    });
    
    socket.on('log-in-request', data => {
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);

      var creds = JSON.parse(data);

      firebase.auth(firebaseApp).signInWithEmailAndPassword(creds.email, creds.password)
        .then(result => socket.emit('log-in-success', JSON.stringify(result)))
        .catch(error => socket.emit('log-in-failure', JSON.stringify(error)));
    });
    
    socket.on('log-out-request', data => {
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);
      
      firebase.auth(firebaseApp).signOut()
        .then(result => socket.emit('log-out-success', JSON.stringify(result)))
        .catch(error => socket.emit('log-out-failure', JSON.stringify(error)));
    });
    
    socket.on('send-update-user', data => {
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);
      
      var user = firebase.auth(firebaseApp).currentUser;
      var userUpdate = JSON.parse(data);
      
      user.updateProfile(userUpdate);
      socket.to(user.email).emit('receive-update-user', userUpdate);
    });
  });
};

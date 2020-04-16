
module.exports = (app) => {
  var io = app.get('io');
  var firebase = app.get('firebase');
  
  io.on('connection', socket => {
    socket.on('begin-auth', () => {
      console.log('Incoming API Event: begin-auth');

	    console.log('socket sessionID: ' + socket.handshake.sessionID);
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);
      
      firebase.auth(firebaseApp).onAuthStateChanged(user => {
        if (user)
          socket.join(user.email);
          
        else
          socket.leaveAll();
        
	console.log('Outgoing API Event: auth-state-changed');
        socket.emit('auth-state-changed', JSON.stringify(user));
      });
    });
    
    socket.on('sign-up-request', data => {
      console.log('Incoming API Event: sign-up-request');
	    
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);
      
      var creds = JSON.parse(data);
      
      firebase.auth(firebaseApp).createUserWithEmailAndPassword(creds.email, creds.password)
        .then(result => {
		console.log('Outgoing API Event: sign-up-success');
		socket.emit('sign-up-success', JSON.stringify(result));

		console.log(result.user.uid);
		console.log(result.user.email);
		firebase.database(firebaseApp).ref('users/' + result.user.uid).set({
			email: result.user.email
		});
	})
        .catch(error => {
      		console.log('Outgoing API Event: sign-up-failure');
		socket.emit('sign-up-failure', JSON.stringify(error))
	});
    });
    
    socket.on('log-in-request', data => {
      console.log('Incoming API Event: log-in-request');

      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);

      var creds = JSON.parse(data);

      firebase.auth(firebaseApp).signInWithEmailAndPassword(creds.email, creds.password)
        .then(result => {
		console.log('Outgoing API Event: log-in-success');
		socket.emit('log-in-success', JSON.stringify(result));
	})
        .catch(error => {
      		console.log('Outgoing API Event: log-in-failure');
		socket.emit('log-in-failure', JSON.stringify(error))
	});
    });
    
    socket.on('log-out-request', data => {
      console.log('Incoming API Event: log-out-request');
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);
      
      firebase.auth(firebaseApp).signOut()
        .then(result => {
      		console.log('Outgoing API Event: log-out-success');
		socket.emit('log-out-success', JSON.stringify(result))
	})
        .catch(error => {
      		console.log('Outgoing API Event: log-out-failure');
		socket.emit('log-out-failure', JSON.stringify(error))
	});
    });
  });
};

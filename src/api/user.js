
module.exports = (app) => {
  var io = app.get('io');
  var firebase = app.get('firebase');
  
  io.on('connection', socket => {
    socket.on('send-update-user', data => {
      console.log('Incoming API Event: send-update-user');
      
      var firebaseApp = app.get('firebaseApp-' + socket.handshake.sessionID);
      
      var user = firebase.auth(firebaseApp).currentUser;
      var userUpdate = JSON.parse(data);
      
      user.updateProfile(userUpdate);
	console.log('Outgoing API Event: receive-update-user');
      socket.to(user.email).emit('receive-update-user', userUpdate);
    });
  });
};

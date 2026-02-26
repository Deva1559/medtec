module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('ambulance:tracking', (data) => {
      io.emit('ambulance:location_updated', data);
    });

    socket.on('emergency:join', (data) => {
      socket.join(`emergency:${data.emergencyId}`);
    });

    socket.on('emergency:update', (data) => {
      io.to(`emergency:${data.emergencyId}`).emit('emergency:status_changed', data);
    });

    socket.on('dashboard:subscribe', () => {
      socket.join('dashboard');
    });

    socket.on('notification:send', (data) => {
      io.to(`user:${data.recipientId}`).emit('notification:received', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

// Preload script for secure communication between main and renderer processes
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Future API methods will be added here
  // For now, this ensures proper security setup
});



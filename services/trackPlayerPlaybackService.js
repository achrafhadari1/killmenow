// This service needs to be registered for the TrackPlayer to work properly
module.exports = async function () {
  // This service needs to return quickly
  // See https://react-native-track-player.js.org/docs/basics/playback-service
  return Promise.resolve();
};

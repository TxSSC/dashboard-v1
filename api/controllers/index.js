module.exports = function(app) {
  return {
    Commandeer: require('./commandeer')(app)
  };
};
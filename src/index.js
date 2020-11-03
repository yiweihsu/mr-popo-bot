const { router, line } = require('bottender/router');

const handleMessage = require('./handles/handleMessage');
const handleFollow = require('./handles/handleFollow');
const handleUnfollow = require('./handles/handleUnfollow');
const handleJoin = require('./handles/handleJoin');
const handleLeave = require('./handles/handleLeave');

module.exports = function App() {
  return router([
    line.message(handleMessage),
    line.follow(handleFollow),
    line.unfollow(handleUnfollow),
    line.join(handleJoin),
    line.leave(handleLeave),
  ]);
};

const { msgSend } = require('../function/message');

module.exports = {
  name: "ping",
  description: "Return pong",
  execute(msg) {
    msgSend(msg, 'Ping', 'Pong');
  }
}
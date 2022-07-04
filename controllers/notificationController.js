const push = require("web-push");

class Notifier {
  constructor() {
    this.subscribed = [];
    this.push = push;
    this.keys = push.generateVAPIDKeys();
    this.push.setVapidDetails(
      "mailto:james_bosley@hotmail.co.uk",
      this.keys.publicKey,
      this.keys.privateKey
    );
  }

  subscribeUser(user) {
    this.subscribed.push(user);
  }

  unsubscribeUser(userId) {
    this.subscribed = this.subscribed.filter(user => user.id !== userId);
  }

  sendNotification(message, recipientIds) {
    const recipients = this.subscribed.filter(user => recipientIds.includes(user.id));

    recipients.forEach(user => {
      this.push.sendNotification(user, JSON.stringify(message));
    });
  }
}

module.exports = () => new Notifier();

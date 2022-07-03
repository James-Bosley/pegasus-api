const push = require("web-push");

class Notifier {
  constructor(subscribed) {
    this.subscribed = subscribed || [];
    this.push = push;
    this.keys = push.generateVAPIDKeys();
    this.push.setVapidDetails(
      "mailto:james_bosley@hotmail.co.uk",
      this.keys.publicKey,
      this.keys.privateKey
    );
    return {
      key: this.keys.publicKey,
      subscribe: this.subscribeUser,
      unsubscribe: this.unsubscribeUser,
      send: this.sendNotification,
    };
  }

  subscribeUser(user) {
    console.log("sub", user);
    this.subscribed.push(user);
    console.log(this.subscribed);
  }

  unsubscribeUser(userId) {
    this.subscribed = this.subscribed.filter(user => user.id !== userId);
  }

  sendNotification(message, recipientIds) {
    console.log("Message", message);
    console.log("ids", recipientIds);
    console.log("subs", this.subscribed);
    const recipients = this.subscribed.filter(user => recipientIds.includes(user.id));

    recipients.forEach(user => {
      this.push.sendNotification(user, JSON.stringify(message));
    });
  }
}

module.exports = subscribed => new Notifier(subscribed);

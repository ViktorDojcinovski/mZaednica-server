"use strict";
var admin = require("firebase-admin");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterCreate(data, createData) {
      try {
        if (data) {
          let message = null;
          if (data.global) {
            let topic = data.type;
            if (data.municipality) {
              topic = `${topic}_${data.municipality.id}`;
            }
            message = {
              notification: {
                title: data.title,
                body: data.body,
              },
              data: data.data,
              topic,
            };
          }
          else if (data.user) {
            message = {
              ...message,
              token: data.user.notificationToken,
              topic: undefined,
            };
          }

          if (message) {
            console.log(message);
            admin
              .messaging()
              .send(message)
              .then((response) => {
                // Response is a message ID string.
                console.log("Successfully sent message:", response);
              })
              .catch((error) => {
                console.log("Error sending message:", error);
              });
          }
        }
      } catch (c) {
        console.error(c);
      }
    },
  },
};

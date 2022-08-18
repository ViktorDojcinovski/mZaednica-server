module.exports = ({ env }) => ({
  email: {
    notificationEmailTo: env('NOTIFICATION_EMAIL_TARGETS', 'kiko_trajkovski@hotmail.com').split(','),
  },
});

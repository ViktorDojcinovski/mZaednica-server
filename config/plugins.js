module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'smtp.example.com'),
      port: env('SMTP_PORT', 587),
      auth: {
        user: env('SMTP_USERNAME'),
        pass: env('SMTP_PASSWORD'),
      },
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: env('MAIL_FROM', 'noreply@mzaednica.mk'),
      defaultReplyTo: env('MAIL_REPLY_TO', 'noreply@mzaednica.mk'),
    },
  },
  apple: {
    teamId: env('APPLE_TEAM_ID'),
    keyId: env('APPLE_KEY_ID'),
    siteClientId: env('APPLE_WEBSITE_CLIENT_ID'),
    appClientId: env('APPLE_APP_CLIENT_ID'),
    callbackUrl: env('APPLE_CALLBACK_URL'),
    callbackUrlPostfix: env('APPLE_CALLBACK_URL_POSTFIX')
  }
});

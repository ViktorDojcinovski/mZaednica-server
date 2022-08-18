module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "649defef20282e8d81c7b2279ad48fee"),
    },
  },
  url: env("URL", "http://localhost:1337"),
  proxy: true,
  cron: {
    enabled: true,
  },
});

module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: env('DATABASE_CLIENT', 'sqlite'),
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
        database: env('DATABASE_NAME', 'strapi'),
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env('DATABASE_PORT', '5432'),
        username: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi')
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});

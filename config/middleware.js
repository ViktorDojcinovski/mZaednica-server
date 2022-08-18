module.exports = {
  //...
  settings: {
    cors: {
      enabled: true,
      credentials: true,
      origin: [
        "http://localhost",
        "http://localhost:1337",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://localhost:3000",
        "http://localhost:8000",
        "https://dev.m-zaednica.mk",
        "https://m-zaednica.mk",
        "https://appleid.apple.com",
        "https://mzaednica.mk",
      ],
      headers: [
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "Access-Control-Allow-Origin",
      ],
    },
  },
};

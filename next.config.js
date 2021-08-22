const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  switch (phase) {
    case PHASE_DEVELOPMENT_SERVER:
      return {
        // environment varibales for local development
        env: {
          IDP_DOMAIN: "my-neighbor-cat1.auth.ap-northeast-2.amazoncognito.com",
          USER_POOL_ID: "ap-northeast-2_uB9TxvgQb",
          USER_POOL_CLIENT_ID: "7q3tg8thh700rh4rrmpjqi4abe",
          REDIRECT_SIGN_IN: "http://localhost:3000/token",
          REDIRECT_SIGN_OUT: "http://localhost:3000/",
          AUTH_COOKIE_DOMAIN: "localhost",
        },
      };
    default:
      return {
        // environment varibales for production
        env: {
          IDP_DOMAIN: "my-neighbor-cat1.auth.ap-northeast-2.amazoncognito.com",
          USER_POOL_ID: "ap-northeast-2_uB9TxvgQb",
          USER_POOL_CLIENT_ID: "7q3tg8thh700rh4rrmpjqi4abe",
          REDIRECT_SIGN_IN: "http://localhost:3000/token",
          REDIRECT_SIGN_OUT: "http://localhost:3000/",
          AUTH_COOKIE_DOMAIN: "localhost",
        },
      };
  }
};
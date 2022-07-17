import '../styles/globals.css'
import React from "react";
import { AppProps } from "next/app";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";

console.assert(
  process.env.NEXT_PUBLIC_USER_POOL_ID &&
  process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID &&
  process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN &&
  process.env.NEXT_PUBLIC_IDP_DOMAIN &&
  process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN &&
  process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT,
  '\n! env vars for Cognito were NOT set properly !'
);

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION, //! Konfiguration
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // example taken from https://aws-amplify.github.io/docs/js/authentication
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      // This should be the subdomain in production as the cookie should only
      // be present for the current site
      domain: process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN,
      // OPTIONAL - Cookie path
      path: "/",
      // OPTIONAL - Cookie expiration in days
      expires: 7,
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      // The cookie can be secure in production
      secure: false,
    },
  },
});

Auth.configure({
  oauth: {
    domain: process.env.NEXT_PUBLIC_IDP_DOMAIN,
    scope: ["email", "openid"],
    // we need the /autologin step in between to set the cookies properly,
    // we don't need that when signing out though
    redirectSignIn: process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN,
    redirectSignOut: process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT,
    responseType: "token",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp

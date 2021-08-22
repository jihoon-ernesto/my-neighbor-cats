import { createGetServerSideAuth, createUseAuth } from "aws-cognito-next";
import pems from "./pems.json";

export const getServerSideAuth = createGetServerSideAuth({ pems });
export const useAuth = createUseAuth({ pems });
export * from "aws-cognito-next";


// https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_uB9TxvgQb/.well-known/jwks.json
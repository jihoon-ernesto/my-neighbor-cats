import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React from "react";
import { GetServerSideProps } from "next";
import {
  AuthTokens,
  useAuth,
  useAuthFunctions,
  getServerSideAuth,
} from "../auth";


export const getServerSideProps: GetServerSideProps<{
  initialAuth: AuthTokens;
}> = async (context) => {
  const initialAuth = getServerSideAuth(context.req);

  return { props: { initialAuth } };
};

export default function Home(props: { initialAuth: AuthTokens }) {
  const auth = useAuth(props.initialAuth);
  const { login, logout } = useAuthFunctions();

  return (
    <div className={styles.container}>
      <Head>
        <title>우리 동네 고양이</title>
        <meta name="description" content="AWS ABP 2021 - 우리 동네 고양이" />
        <link rel="icon" href="/cat-face-256.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          우리 동네 고양이<br/>
          🐈 🐈
        </h1>

        <p className={styles.description}>
          (여기 대충 앱 소개)
        </p>

        <React.Fragment>
          {auth ? (
            <button type="button" onClick={() => logout()}>
              sign out
            </button>
          ) : (
            <React.Fragment>
              <button type="button" onClick={() => login()}>
                sign in
              </button>
            </React.Fragment>
          )}
        </React.Fragment>

        <div className={styles.grid}>
          {/*
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>
          */}

          <Link
            href="/cats-map"
          >
            <div className={styles.card}>
              <h2>고양이 지도 &rarr;</h2>
              <p>
                고양이들이 살고 있는 우리 동네 지도
              </p>
            </div>
          </Link>

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

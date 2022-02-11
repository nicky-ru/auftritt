import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Component from "../components/Component";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Auftritt</title>
        <meta name="description" content="A template for building dapps with Hasura GraphQL backend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <Component/>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home

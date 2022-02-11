import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Component from "../components/Component";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Halo Dashboard V2</title>
        <meta name="description" content="Halo Dashboard V2" />
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

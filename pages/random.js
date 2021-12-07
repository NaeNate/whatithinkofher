import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "../styles/styles.module.css";

const Index = () => {
  const [post, setPost] = useState();
  const posts = [];

  const fetchPosts = new Promise(async (resolve, reject) => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      posts.push(doc.data());
    });

    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    resolve(randomPost);
  });

  useEffect(() => {
    fetchPosts.then(({ body, createdAt }) => {
      setPost(
        <div className={styles.post}>
          <p className={styles.body}>{body}</p>
          <p className={styles.date}>{new Date(createdAt).toDateString()}</p>
        </div>
      );
    });
  }, []);

  return (
    <>
      <Head>
        <title>whatithinkofher</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="A random snippet." />
      </Head>
      <h1 className={styles.header}>whatithinkofher</h1>
      {post}
    </>
  );
};

export default Index;

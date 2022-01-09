import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "../styles/styles.module.css";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      fetchPosts();
    }
  }, [router.isReady]);

  const fetchPosts = async () => {
    setPosts([]);

    const querySnapshot = await getDocs(
      query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10))
    );

    querySnapshot.forEach((doc) => {
      setPosts((posts) => [
        ...posts,
        <div className={styles.post} key={doc.data().createdAt}>
          <p className={styles.body}>{doc.data().body}</p>
          <p className={styles.date}>
            {new Date(doc.data().createdAt).toDateString()}
          </p>
        </div>,
      ]);
    });
  };

  return (
    <>
      <Head>
        <title>whatithinkofher</title>
      </Head>
      <h1 className={styles.header}>whatithinkofher</h1>
      <div className={styles.posts}>{posts}</div>
    </>
  );
};

export default Index;

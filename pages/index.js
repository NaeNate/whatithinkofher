import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "../styles/index.module.css";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  const fetchPosts = async () => {
    if (!router.isReady) return;

    setPosts([]);

    const { year, month } = router.query;
    if (month && !year) router.push("/");

    let querySnapshot = await getDocs(
      query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10))
    );

    if (year && !month) {
      querySnapshot = await getDocs(
        query(
          collection(db, "posts"),
          where("createdAt", ">", new Date(year).getTime()),
          where(
            "createdAt",
            "<",
            new Date((parseInt(router.query.year) + 1).toString()).getTime()
          ),
          orderBy("createdAt", "desc"),
          limit(10)
        )
      );
    }

    if (year && month) {
      querySnapshot = await getDocs(
        query(
          collection(db, "posts"),
          where("createdAt", ">", new Date(year, month).getTime()),
          where(
            "createdAt",
            "<",
            new Date(year, parseInt(month) + 1).getTime()
          ),
          orderBy("createdAt", "desc"),
          limit(10)
        )
      );
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      setPosts((posts) => [
        ...posts,
        <Post
          body={data.body}
          createdAt={data.createdAt}
          key={data.createdAt}
        />,
      ]);
    });
  };

  useEffect(() => {
    fetchPosts();
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>whatithinkofher</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Where I write what I think of her." />
      </Head>
      <h1 className={styles.header}>whatithinkofher</h1>
      {posts}
    </>
  );
};

const Post = ({ body, createdAt }) => {
  return (
    <div className={styles.post}>
      <p className={styles.body}>{body}</p>
      <p className={styles.date}>{new Date(createdAt).toDateString()}</p>
    </div>
  );
};

export default Index;

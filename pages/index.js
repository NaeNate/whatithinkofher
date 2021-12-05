import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "../styles/index.module.css";
import { useRouter } from "next/router";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  let q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  if (router.query.year) {
    q = query(
      collection(db, "posts"),
      where("createdAt", ">", new Date(router.query.year).getTime()),
      where(
        "createdAt",
        "<",
        new Date((parseInt(router.query.year) + 1).toString()).getTime()
      ),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    console.log("oopop");
  } else console.log("sldkfjds");

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setPosts((posts) => [
        ...posts,
        <Post key={doc.data().createdAt.toString()} data={doc.data()} />,
      ]);
    });
  };

  useEffect(() => {
    setPosts([]);
    fetchPosts();
  }, []);

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

const Post = ({ data }) => {
  return (
    <div className={styles.post}>
      <p className={styles.body}>{data.body}</p>
      <p className={styles.date}>{new Date(data.createdAt).toDateString()}</p>
    </div>
  );
};

export default Index;

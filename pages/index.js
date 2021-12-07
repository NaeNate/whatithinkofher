import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "../styles/styles.module.css";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [years, setYears] = useState([]);
  const existingYears = [];
  const router = useRouter();

  const { year, month } = router.query;
  if (month && !year) router.push("/");

  useEffect(() => {
    fetchPosts();
  }, [router.isReady]);

  const createTimeline = (year) => {
    if (!existingYears.includes(year)) {
      setYears((years) => [...years, <Year year={year} key={year} />]);
      existingYears.push(year);
    }
  };

  const fetchPosts = async () => {
    if (!router.isReady) return;

    setPosts([]);

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
      setPosts((posts) => [
        ...posts,
        <Post
          body={doc.data().body}
          createdAt={doc.data().createdAt}
          key={doc.data().createdAt}
        />,
      ]);

      createTimeline(new Date(doc.data().createdAt).getFullYear());
    });
  };

  return (
    <>
      <Head>
        <title>whatithinkofher</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="A collection of snippets where I write what I think of her."
        />
      </Head>
      <h1 className={styles.header}>whatithinkofher</h1>
      <div className={styles.posts}>{posts}</div>
      <div className={styles.sidebar}>
        <Link href="/random">
          <a className={styles.link}>Random Snippet</a>
        </Link>
        {years}
      </div>
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

const Year = ({ year }) => {
  return (
    <div>
      <p>{year}</p>
    </div>
  );
};

export default Index;

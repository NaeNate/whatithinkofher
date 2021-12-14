import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
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
  const router = useRouter();

  const { year, month, page = 0 } = router.query;
  if (month && !year) router.push("/");

  useEffect(() => {
    fetchPosts();
  }, [router.isReady, router.query.page]);

  const fetchPosts = async () => {
    if (!router.isReady) return;

    setPosts([]);

    let id;

    await getDocs(
      query(collection(db, "posts"), orderBy("id", "desc"), limit(1))
    ).then((snapshot) => {
      snapshot.forEach((doc) => {
        id = doc.data().id;
      });
    });

    let querySnapshot = await getDocs(
      query(
        collection(db, "posts"),
        orderBy("id", "desc"),
        startAt(id - page * 10),
        limit(10)
      )
    );

    if (year && !month) {
      querySnapshot = await getDocs(
        query(
          collection(db, "posts"),
          where("id", ">=", page * 10),
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
    } else if (year && month) {
      querySnapshot = await getDocs(
        query(
          collection(db, "posts"),
          where("id", ">=", page * 10),
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
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="A collection of snippets where I write what I think of her."
        />
      </Head>
      <h1 className={styles.header}>whatithinkofher</h1>
      <div className={styles.posts}>{posts}</div>
      {posts.length < 10 || (
        <Link href={`/?page=${parseInt(page) + 1}`}>
          <a>Next Page</a>
        </Link>
      )}{" "}
      {!!page && (
        <Link href={page > 1 ? `/?page=${page - 1}` : "/"}>
          <a>Previous Page</a>
        </Link>
      )}
    </>
  );
};

export default Index;

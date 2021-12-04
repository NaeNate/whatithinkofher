import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

const Create = () => {
  const [logged, setLogged] = useState(
    process.env.NODE_ENV === "development" ? true : false
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogged(true);
      }
    });
  }, []);

  return (
    <>{logged ? <CreatePostForm /> : <ValidateForm setLogged={setLogged} />}</>
  );
};

const CreatePostForm = () => {
  const [body, setBody] = useState("");
  const router = useRouter();

  const handleCreatePost = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts"), {
      body,
      createdAt: Date.now(),
    }).then(() => router.push("/"));
  };

  return (
    <form onSubmit={handleCreatePost}>
      <textarea
        type="text"
        required={true}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></textarea>
      <button type="submit">Create Post</button>
    </form>
  );
};

const ValidateForm = ({ setLogged }) => {
  const [password, setPassword] = useState("");

  const handleValidate = async (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, "nate@qstreet.org", password)
      .then(() => setLogged(true))
      .catch((err) => {
        console.log(err);
        setPassword("");
      });
  };

  return (
    <form onSubmit={handleValidate}>
      <input
        type="text"
        required={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Validate</button>
    </form>
  );
};

export default Create;

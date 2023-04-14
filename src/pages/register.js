import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../styles/form.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("handleSubmit called"); // Add this line to check how many times this function is called
    try {
      const response = await fetch(`http://${process.env.AUTH_URL}/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.message) {
        setMessage("Registration successful!");
        // Redirect to index
        router.push(`/login`);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      console.error(error.message);
      setMessage("An error occurred. Please try again later.");
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <input type="submit" value="Register" className={styles.submit} />
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;

import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/form.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(`http://${process.env.AUTH_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.token) {
        setMessage("Login successful!");
        //Save token to storage
        localStorage.setItem("token", result.token);
        // Redirect to the chat page
        router.push(`/chat?username=${username}`);
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
        <h1>Login</h1>
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
        <input type="submit" value="Login" className={styles.submit} />
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;

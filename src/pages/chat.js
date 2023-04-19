import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/chat.module.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const notifRef = useRef(null);
  const router = useRouter();
  const username = router.query.username;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (!username) return;
    //chat
    console.log(process.env.CHAT_URL);
    const fetchChatHistory = async () => {
      const response = await fetch(
        `http://${process.env.CHAT_URL}/chat_history`,
        {
          headers: headers,
        }
      );

      const data = await response.json();
      setMessages(data);
    };
    fetchChatHistory();

    socketRef.current = new WebSocket(
      `ws://${process.env.CHAT_URL}/ws/${username}`
    );
    socketRef.current.onopen = () => {
      // Set the "Authorization" header for the WebSocket request
      socketRef.current.send(
        JSON.stringify({
          type: "authenticate",
          token: `Bearer ${token}`,
        })
      );
    };

    socketRef.current.addEventListener("message", (event) => {
      const messageData = JSON.parse(event.data);
      setMessages((prev) => [messageData, ...prev]);
      window.scrollTo(0, document.body.scrollHeight);
    });

    //notifications
    const notificationsUrl = `ws://${process.env.NOTIFICATIONS_URL}/ws`;
    notifRef.current = new WebSocket(notificationsUrl);

    notifRef.current.onopen = () =>
      console.log("Notification WebSocket connected");
    notifRef.current.onclose = () => {
      console.log("Notification WebSocket closed");
      setTimeout(() => {
        notifRef.current = new WebSocket(notificationsUrl);
      }, 5000);
    };

    notifRef.current.onmessage = (event) => {
      const notif = JSON.parse(event.data);
      showBrowserNotification(notif);
    };

    return () => {
      socketRef.current.close();
      notifRef.current.close();
    };
  }, [username]);

  const showBrowserNotification = (notif) => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications.");
    } else if (
      Notification.permission === "granted" &&
      notif.sender_username !== username
    ) {
      new Notification(`${notif.sender_username}`, {
        body: notif.content,
      });
    } else if (
      Notification.permission !== "denied" &&
      notif.sender_username !== username
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(`${notif.sender_username}`, {
            body: notif.content,
          });
        }
      });
    }
  };
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socketRef.current.send(JSON.stringify({ content: newMessage, username }));
    setNewMessage("");
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      {/* <div className={styles.hostname}>
        <h3>Connected to container: {process.env.HOSTNAME}</h3>
      </div> */}
      <div className={styles.chat}>
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.sender_username === username
                  ? styles.currentUserMessage
                  : ""
              }`}
            >
              <strong>{message.sender_username}: </strong>
              {message.content}
            </div>
          ))}
        </div>
        <div className={styles.inputWrapper}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={styles.chatInput}
            />
            <button onClick={sendMessage} className={styles.chatButton}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

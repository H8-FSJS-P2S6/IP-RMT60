import React, { useEffect, useState } from "react";
import axios from "axios"; // Pastikan axios sudah terinstall
import { useNavigate } from "react-router";

const ChatWithAI = () => {
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_API_BASE_URL;
  // State untuk menyimpan pesan input dan percakapan
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Fungsi untuk menghandle perubahan input pengguna
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Fungsi untuk mengirim pesan
  const handleSendMessage = async () => {
    if (!input.trim()) return; // Cegah pengiriman pesan kosong

    // Menambahkan pesan pengguna ke percakapan
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    // Mengirim pesan ke API dan mendapatkan balasan AI
    try {
      const response = await axios.post(serverUrl + "/chat", {
        message: input,
      });
      const aiResponse = response.data.reply;

      // Menambahkan balasan AI ke percakapan
      setMessages([...newMessages, { sender: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
    }

    // Mengosongkan input setelah pesan dikirim
    setInput("");
  };

  useEffect(() => {
    if (!access_token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2>Chat with AI</h2>
      <div
        className="border rounded p-3 mb-3"
        style={{
          height: "400px",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
        }}
      >
        {/* Area untuk menampilkan percakapan */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`d-inline-block p-2 rounded ${
                message.sender === "user" ? "bg-primary text-white" : "bg-light"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button
          className="btn btn-primary"
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithAI;

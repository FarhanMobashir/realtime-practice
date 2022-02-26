import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
const apiUrl = "http://localhost:5000";

const ChatContainer = styled.div`
  border: 2px solid white;
  width: 80%;
  height: 80vh;
`;

const Input = styled.input`
  font-size: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  margin: 10px 0px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
`;

const InputComponent = ({ label, value, onChange }) => {
  return (
    <Label>
      {label} <Input value={value} onChange={onChange} />
    </Label>
  );
};

function App() {
  const [allMessages, setAllMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // name and message
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const fetchFromApi = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}`);
      const data = await res.json();
      setAllMessages(data.message);
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function loadDataHandler() {
    fetchFromApi();
  }

  return (
    <div className="App">
      <header className="App-header">
        <ChatContainer>
          <InputComponent
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputComponent
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button onClick={() => console.log(name, message)}>Send</Button>
        </ChatContainer>
      </header>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { useFetch } from "./hooks/useFetch";
const apiUrl = "http://localhost:5000";

const ChatContainer = styled.div`
  border: 2px solid white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  font-size: 20px;
  display: inline;
  border: 2px solid grey;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 20px;
  padding: 8px 4px;
`;

const Label = styled.label`
  font-size: 16px;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  font-weight: bold;
  color: grey;
`;

const Heading = styled.h1`
  color: ${(props) => props.color || "black"};
  font-size: ${(props) => props.fontSize || "24px"};
  text-align: ${(props) => props.alignment || "left"};
`;

const Button = styled.button`
  margin: 10px 0px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  color: ${(props) => props.color || "white"};
  background-color: ${(props) => props.bgColor || "black"};
  font-size: ${(props) => props.fontSize || "14px"};
`;

const InputComponent = ({ label, value, onChange }) => {
  return (
    <Label>
      {label} <Input value={value} onChange={onChange} />
    </Label>
  );
};

const MessageContainer = styled.div`
  padding: 10px 20px;
  margin: 0px 24px;
  display: flex;
  flex-direction: column;
`;

const MessageBox = styled.div`
  border: 5px solid #2c2828;
  margin-top: 15px;
  padding: 10px 20px;
  border-radius: 10px;
`;

const SenderName = styled.p`
  background-color: #222222;
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  width: 150px;
`;
const SenderMessage = styled.p`
  background-color: #dcbeff;
  padding: 10px 15px;
  font-size: 20px;
  border-radius: 10px;
`;

const MessageComponent = ({ senderName, senderMesssage }) => {
  return (
    <MessageBox>
      <SenderName>{senderName}</SenderName>
      <SenderMessage>{senderMesssage}</SenderMessage>
    </MessageBox>
  );
};

function App() {
  // name and message
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let timeout;
    async function getNewMessage() {
      let json;
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/poll`);
        json = await res.json();
        console.log(json.msg);
        setLoading(false);
        if (res.status >= 400) {
          throw new Error("request not succeeed");
        }
        failedTries = 0;
      } catch (e) {
        console.error("Polling error", e);
        failedTries++;
      }
      setAllMessages(json.msg);
    }
    // getNewMessage();
    // return () => clearTimeout(timeout);

    // ? Using request animation frame
    let raf;
    let timeToMakeNewRequest = 0;
    const BACKOFF = 5000;
    let failedTries = 0;
    async function rafTimer(time) {
      if (timeToMakeNewRequest <= time) {
        await getNewMessage();
        timeToMakeNewRequest = time + 2000 + failedTries * BACKOFF;
      }
      raf = requestAnimationFrame(rafTimer);
    }
    requestAnimationFrame(rafTimer);
    return () => cancelAnimationFrame(raf);
  }, []);

  async function postNewMessage() {
    const data = {
      user: name,
      text: message,
    };
    console.log(data);
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    setPosting(true);
    await fetch(`${apiUrl}/poll`, options);
    setPosting(false);
  }

  return (
    <div className="App">
      <Heading color="dodgerblue" alignment="center" fontSize="32px">
        Chat App
      </Heading>
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

          <Button
            bgColor="dodgerblue"
            onClick={postNewMessage}
            fontSize="18px"
            disabled={posting ? true : false}
          >
            {posting ? "Sending..." : "Send"}
          </Button>
        </ChatContainer>
      </header>
      <hr />
      <Heading color="dodgerblue" alignment="center" fontSize="32px">
        Messages
      </Heading>
      <Heading color="black" alignment="center" fontSize="16px">
        {loading ? "Loading" : ""}
      </Heading>
      <MessageContainer>
        {!loading && allMessages
          ? allMessages.map((item) => (
              <MessageComponent
                key={item.text}
                senderName={item.user}
                senderMesssage={item.text}
              />
            ))
          : null}
      </MessageContainer>
    </div>
  );
}

export default App;

/**
 * notes:
 * ? 1. Using settimeout : The issue with using settimeout is that even if we move away from the tab on which our chat app is opened it will keep polling and hence will waste the resources.
 *
 * ? 2. Using requestAnimationFrame : In order to not make request if the user is way from the tab , a good and easy way is to use the requestAnimationFrame function which help us do the same thing.
 *
 * ? 3. Backoff and Retry : When the request fails , in order to get synced with server we make 2 to 3 immediate request and after that we backoff and retry. There can be exponential backoff as well as liner backoff.
 *
 *
 *
 */

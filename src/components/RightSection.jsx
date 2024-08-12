import React, { useState } from 'react';
import './RightSection.css'; 
import chatgptlogo from '../assets/chatgptlogo.png';

const RightSection = () => {
  const [message, setMessage] = useState('');
//   Purpose: This state variable holds the current message that the user is typing into the input field.
// Initial Value: The initial value is an empty string (''), meaning that the input field starts off empty.
// Update Function: The setMessage function is used to update the message state. This is typically done in the onChange event of the input field to reflect the user's typing in real-time.
  const [conversation, setConversation] = useState([]);
//   Purpose: This state variable keeps track of the entire conversation between the user and the chatbot. It's an array where each element represents a message in the conversation, whether it's from the user or the bot.
// Initial Value: The initial value is an empty array ([]), indicating that there are no messages in the conversation when the component first loads.
// Update Function: The setConversation function is used to update the conversation state. Messages are added to this array as the user sends messages and the bot responds. This ensures that the UI can render the full conversation history.
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
//   Purpose: This state variable indicates whether the chatbot is currently generating a response. It helps manage the UI to show a loading indicator or message while the bot is processing the user's query.
// Initial Value: The initial value is false, meaning that by default, the bot is not in the process of generating a response.
// Update Function: The setGeneratingAnswer function is used to change this state. It is set to true when the user sends a message and the bot starts generating a response, and set back to false once the response is received and displayed.

  const sendMessage = async (e) => {
    e.preventDefault();//This line ensures that the default form submission behavior (which would cause a page reload) is prevented. It is essential for maintaining the single-page application experience.
    if (!message.trim()) return;//This line checks if the message is not empty or whitespace. If it is, the function returns early, preventing empty messages from being sent.

    const newMessage = { type: 'user', text: message };
    //A new message object is created with the type 'user' and the current text from the message state.
    setConversation([...conversation, newMessage]);
    //This new message is added to the conversation array, and the state is updated using setConversation.
    setGeneratingAnswer(true);
    //The setGeneratingAnswer(true) sets the generatingAnswer state to true, which triggers the UI to show a loading indicator while waiting for the bot's response.

    try {
      //he function makes an asynchronous fetch request to the Gemini API to get the bot's response.
      //The request is a POST method with a JSON payload that includes the user's message.
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }]
          })
        }
      );
      const data = await response.json();
      const newAnswer = { type: 'bot', text: data.candidates[0].content.parts[0].text };//A new message object is created for the bot's response.
      setConversation([...conversation, newMessage, newAnswer]);//The conversation state is updated to include both the user's message and the bot's response.
    } catch (error) {
      console.error(error);
      const errorAnswer = { type: 'bot', text: "Sorry - Something went wrong. Please try again!" };
      //If the API request fails, an error message is logged, and a fallback error message is created.
      setConversation([...conversation, newMessage, errorAnswer]);//he conversation state is updated to include the user's message and the error message.
    }

    setGeneratingAnswer(false);//The generatingAnswer state is set to false, which hides the loading indicator.
    setMessage('');//The message state is cleared, resetting the input field.
  };

  return (
    <div className="rightSection">
      <div className="rightin">
        <div className="chatgptversion">
          <p className="text1">ChatBOT</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        <div className="nochat">
          <div className="s1">
            <img src={chatgptlogo} alt="chatgpt" height={70} width={70} />
            <h1>How can I help you today?</h1>
          </div>
          <div className="s2">
            <div className="suggestioncard">
              <p>Try asking about the weather today.</p>
            </div>
            <div className="suggestioncard">
              <p>What’s the latest news?</p>
            </div>
            <div className="suggestioncard">
              <p>What’s the latest news?</p>
            </div>
            <div className="suggestioncard">
              <p>What’s the latest news?</p>
            </div>
          </div>
        </div>
        <div className="conversation">
          {conversation.map((item, index) => (
            <div key={index} className={`message ${item.type}`}>
            {/* //key={index}: A unique key assigned to each element in the list. React uses this key to identify which items have changed, are added, or are removed. Using the index as a key is generally acceptable if the list is static or does not change frequently, but for dynamic lists where items can be reordered or removed, using a unique identifier (like an ID) is preferable. */}
              <div className="messageContent">{item.text}</div>
            </div>
          ))}
          {generatingAnswer && (
            <div className="message bot">
              <div className="messageContent">Loading your answer... It might take up to 10 seconds</div>
            </div>
          )}
        </div>
        <div className="bottomsection">
          <div className="messagebar">
            <input
              type="text"
              placeholder="Message IntelliChat..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <svg
              onClick={sendMessage}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </div>
          <p>CHATGPT BOT can make mistakes. Consider checking important information.</p>
        </div>
      </div>
    </div>
  );
};

export default RightSection;

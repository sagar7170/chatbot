import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator} from '@chatscope/chat-ui-kit-react'
import { useState } from 'react';

const API_KEY="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"

function App() { 
  const [typing,setTyping]=useState(false)
  const [messages,setMessages]=useState([
    {
      message:"Hi ask me anything, How can help you?",
      sender:"ChatGpt"
    }
  ])
  const handlesend=async (message)=>{
    const newMessage={
      message:message,
      sender:"user",
      direction:"outgoing"
    }

    const newMessages=[...messages,newMessage]
    //update message
    setMessages(newMessages)
    //set typing indicator
    setTyping(true)

    await processMessageToChatGpt(newMessages)
  }

  async function processMessageToChatGpt(chatMessages){
    let apiMessages=chatMessages.map((messageObject)=>{
      let role=""
      if (messageObject.sender=== "ChatGpt" ){
        role="assistant"
      }else{
        role="user"
      }
      return{role:role, content:messageObject.message}
    })

    const systemMessage={
      role:"system",
      content:"Explain all concepts like I am 10 year old"
    }

    const apiRequestBody={
      "model":"gpt-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:'POST',
      headers:{
        'Authorization':"Bearer " + API_KEY,
        'Content-Type':'application/json'
        
      },
      body:JSON.stringify(apiRequestBody)
    }).then((data)=>{
        return data.json()
    }).then((data)=>{
      console.log('response from openAI API:',data);
      console.log(data.choices[0].message.content)
      setMessages(
        [...chatMessages,{
          message:data.choices[0].message.content,
          sender:"ChatGpt"
        }]
      )
      setTyping(false)
    })  
  }

  return (
    <>
      <div className="app">
        <div className='Chatgpt-container'>
          <MainContainer>
            <ChatContainer >
              <MessageList typingIndicator={typing ? <TypingIndicator content='Chatbot is Typing'/> : null}>
                {messages.map((message,i)=>{
                  return <Message key={i} model={message}/>
                })}
              </MessageList>
              <MessageInput placeholder='Type message here' onSend={handlesend}/>
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
}

export default App;
const express = require('express');
const app = express();


const dotenv = require("dotenv");

const {ChatOpenAI} = require ("langchain/chat_models/openai");
const {HumanChatMessage} = require("langchain/schema");
const { OpenAI } = require("langchain/llms/openai");

const {ConversationChain} = require ("langchain/chains")
const {  ChatPromptTemplate,
      HumanMessagePromptTemplate,
        SystemMessagePromptTemplate,
        MessagesPlaceholder} = require ("langchain/prompts");
const {BufferMemory} = require ("langchain/memory");


dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || "5112";
const GPT3 = "gpt-3.5-turbo";
const GPT4 = "gpt-4";
const model = GPT3;

console.log("## Initialize LangChainBot Agents.... ")

const chat = new ChatOpenAI({ 
    modelName: GPT4,
    temperature: 0.7 
});    
console.log(" -> langChatBot Agent [ " + chat.modelName + " ] done.")

const chat3 = new ChatOpenAI({ 
    modelName: GPT3,
    temperature: 0.7 
}); 
console.log(" -> langChatBot Agent [ " + chat3.modelName + " ] done.")






// GET /
app.get('/', (req, res) => {
  res.send('hello server');
});

// GET /getmessage
app.get('/getmessage', async (req, res) => {
  await simulateDelay(2000);
  res.send('hello again');
});

// GET /getmessagewithtext?usertext=<user-text>
app.get('/getmessagewithtext', async (req, res) => {
  const userText = req.query.usertext;
//   const message = await chatBotWithText(userText);
    const message = await callMyChatBot(userText);
  res.send(message);
});

// Simulated delay function
function simulateDelay(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Asynchronous function for chatBot
async function chatBot() {
  await simulateDelay(2000);
  return 'hello again';
}

// Asynchronous function for chatBotWithText
async function chatBotWithText(userText) {
  await simulateDelay(5000);
  return 'hello 2';
}

// Start the server
// const port = 5112;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// ===



async function callMyChatBot(text){

      let od1 = Date.now();
       
      console.log("### GPT4-BotAgent - Setting up chatPromptTemplate, MessagePlaceHolder, HumanMessagePromptTemplate, ConversationChain ### ... Done");
  
        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
          SystemMessagePromptTemplate.fromTemplate(
            "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
          ),
          new MessagesPlaceholder("history"),
          HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);
      
        const chain = new ConversationChain({
          memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
          prompt: chatPrompt,
          llm: chat,
        });
      
  
        console.log("### GPT3-BotAgent - Setting up chatPromptTemplate, MessagePlaceHolder, HumanMessagePromptTemplate, ConversationChain ### ... Done");
  
        const chatPrompt3 = ChatPromptTemplate.fromPromptMessages([
          SystemMessagePromptTemplate.fromTemplate(
            "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
          ),
          new MessagesPlaceholder("history"),
          HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);
      
        const chain3 = new ConversationChain({
          memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
          prompt: chatPrompt3,
          llm: chat3,
        });
  
  
        // ########## THE CHAT starts here ##############
  
      const response1 = await chain.call({input: "hi! I am Cosmos."});
  
      console.log("GPT4 answered --> 1st question - od1 langchain returned in : " + (Date.now()-od1)/1000);
      console.log("GPT4 - od1 response1 = \n\t>> " + response1.response);
  
      let od2 = Date.now();
      const response2 = await chain3.call({input: "Translate this sentence from English to French. " + text});
  
      console.log("GPT3 answered---> od2 langchain returned in : " + (Date.now()-od2)/1000);
      console.log("GPT3 - od2 response1 \n\t>> " + response2.response);
      // console.log(response2.response);
  
      let od3 = Date.now();
      const response3 = await chain.call({ input: "What's my name? Also can you translate this from French to English: " + response2.response});
     
      console.log("GPT4 answered again --> od3 langchain returned in : " + (Date.now()-od3)/1000);
      console.log("GPT4 response2 = \n\t>> " + response3.response); 
  
      console.log("\n================\nCalled callMyChatBot with text = " + text);
      let deltaDate = Date.now() - od1;
      console.log("ending call... " + deltaDate/1000);
  
      return response3.response;

  }
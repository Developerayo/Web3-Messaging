import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

const contractABI = [
  [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageId","type":"uint256"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"string","name":"content","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"NewMessage","type":"event"},{"inputs":[],"name":"getMessageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMessages","outputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"string","name":"content","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct Messaging.Message[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"messages","outputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"string","name":"content","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"content","type":"string"}],"name":"sendMessage","outputs":[],"stateMutability":"nonpayable","type":"function"}]
];

const contractAddress = '0x218B6a0234e1070ca7753dF497a135A7d92ED55A'; 

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    async function initialize() {
      const ethereumProvider = await detectEthereumProvider();
      
      if (ethereumProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(ethereumProvider);
        const signer = ethersProvider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, ethersProvider);
        setProvider(ethereumProvider);
        setSigner(signer);
        setContract(contract);
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchMessages();
    }
  }, [contract]);

  async function fetchMessages() {
    const count = await contract.getMessageCount();
    const fetchedMessages = [];
    
    for (let i = 0; i < count; i++) {
      const message = await contract.messages(i);
      fetchedMessages.push(message);
    }

    setMessages(fetchedMessages);
  }

  async function handleSendMessage() {
    await contract.connect(signer).sendMessage(newMessage);
    fetchMessages();
    setNewMessage('');
  }

  async function handleLogin() {
    await provider.request({ method: 'eth_requestAccounts' });
    fetchMessages();
  }

  return (
    <div className="App">
      <button onClick={handleLogin}>Login with MetaMask</button>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>Sender: {message.sender}</p>
            <p>Content: {message.content}</p>
            <p>Timestamp: {new Date(message.timestamp * 1000).toLocaleString()}</p>
          </div>
        ))}
        <input 
          type="text" 
          value={newMessage} 
          onChange={e => setNewMessage(e.target.value)} 
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </div>
  );
}

export default App;

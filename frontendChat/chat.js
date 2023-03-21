const chatForm = document.getElementById('chat-form');
const chatMessageInput = document.getElementById('chat-message');
const userList = document.getElementById('user-list');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    let message = { text: chatMessageInput.value };
    const response = await axios.post("http://localhost:4000/users/chat", message, { headers: { 'Authentication': token } });
    console.log(response);
    chatMessageInput.value = '';
});


window.addEventListener('load', () => {
    getusers();
    getmessages();
})

async function getusers() {
    const response = await axios.get("http://localhost:4000/users/signup");
    const userlist = response.data.users;
    userlist.forEach((user) => {
        const userElement = document.createElement('div');
        userElement.textContent = user.name + " joined";
        userList.appendChild(userElement);
    });
}

async function getmessages(){
const response = await axios.get("http://localhost:4000/users/chat");
const chatHistory = response.data.message;
chatMessages.innerHTML = '';
chatHistory.forEach((chat) => {
    const chatMessageElement = document.createElement('div');
    chatMessageElement.textContent = `${chat.signupName}: ${chat.message}`;
    chatMessages.appendChild(chatMessageElement);
})
}
let intervalId;

function startUpdatingMessages() {
  // Clear any previous interval
  clearInterval(intervalId);

  // Set new interval to call the function every 1 second
  intervalId = setInterval(getmessages, 1000);
}

startUpdatingMessages();
// const io = require('socket.io-client');
const chatForm = document.getElementById('chat-form');
const chatMessageInput = document.getElementById('chat-message');
const userList = document.getElementById('user-list');
const chatMessages = document.getElementById('chat-messages');
const socket = io('http://localhost:8000')

const createGroupForm = document.querySelector('#create-group-form');
const groupNameInput = document.querySelector('#group-name');
const membersInput = document.querySelector('#members');
const groupsList = document.querySelector('#groups');

const uploadbtn=document.getElementById('uploadbtn');

const file=document.getElementById('file');

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

chatForm.addEventListener('submit', async (event) => {
  console.log("yoooooo")
  event.preventDefault();
  const token = localStorage.getItem('token');
  const groupId=JSON.parse(localStorage.getItem('groupId'));
  const tok = parseJwt(token);
  let message = { text: chatMessageInput.value };
  let obj = {
    name: tok.name,
    text: chatMessageInput.value
  }
  const date = new Date().getTime(); // Get current timestamp
  localStorage.setItem(date, JSON.stringify(obj)); // Store chat message with timestamp as key

  // Remove oldest chat message if there are more than 10 saved
  let oldestKey = localStorage.key(0);
  if (localStorage.length > 11) {
    for (let i = 1; i < localStorage.length; i++) {
      if (localStorage.key(i) < oldestKey) {
        oldestKey = localStorage.key(i);
      }

    } // Get key of oldest chat message
    localStorage.removeItem(oldestKey); // Remove oldest chat message from localStorage
  }
  const response = await axios.post("http://44.204.114.231:4000/users/chat", message, { headers: { 'Authentication': token } });
  socket.emit('send-message', groupId);
  chatMessageInput.value = '';
});


function showNewChatOnScreen(chat) {

  const chatMessageElement = document.createElement('div');
  // chatMessageElement.textContent = `${chat.name}>>>>> ${chat.text}`;
  chatMessages.appendChild(chatMessageElement);
}


window.addEventListener('load', () => {
  getusers();
  let Details, details;
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'token' && key !== 'groupId') {
      Details = localStorage.getItem(key);
      details = JSON.parse(Details);
      showNewChatOnScreen(details);
    }
    getmessages();
  });
})
getgroups();


async function getgroups() {
  const token = localStorage.getItem('token');
  const response = await axios.get("http://44.204.114.231:4000/users/getgroupname", { headers: { 'Authentication': token } });
  const grpdetails = response.data.groupDetails;
  const parent = document.querySelector('#groups');
  for (let i = 0; i < grpdetails.length; i++) {
    let child = `<li onclick="insideGroup(${grpdetails[i].groupId})">${grpdetails[i].groupName}</li>`
    parent.innerHTML = parent.innerHTML + child
  }
}


async function insideGroup(id) {
  try {
    localStorage.setItem("groupId", id)
    window.location.href = "./groupchat.html"
  } catch (err) {
    console.log("error in inside group FE", err)
  }
}


async function getusers() {
  const response = await axios.get("http://44.204.114.231:4000/users/signup");
  const userlist = response.data.users;
  userlist.forEach((user) => {
    const userElement = document.createElement('div');
    userElement.textContent = user.name
    userList.appendChild(userElement);
  });
}


async function getmessages() {
  let newKey = localStorage.key(0);
  for (let i = 1; i < localStorage.length; i++) {
    if (localStorage.key(i) < newKey) {
      newKey = localStorage.key(i);
    }
  }
  const response = await axios.get(`http://44.204.114.231:4000/users/chat?currenttime=${newKey}`);
  const chatHistory = response.data.message;
  chatMessages.innerHTML = '';
  chatHistory.forEach((chat) => {
    const chatMessageElement = document.createElement('div');
    chatMessageElement.textContent = `${chat.signupName} >>>> ${chat.message}`;
    chatMessages.appendChild(chatMessageElement);
  })
}


socket.on('receive-message', async (group) => {
  const groupId=JSON.parse(localStorage.getItem('groupId'));
  //console.log(">>>>>",group,groupId);
  //console.log(group===groupId);
  if(group === groupId){
      getmessages();
      getusers();
  }
})

// let intervalId;
// function startUpdatingMessages() {
//   // Clear any previous interval
//   clearInterval(intervalId);

//   // Set new interval to call the function every 1 second
//   intervalId = setInterval(getmessages, 1000);
// }

// startUpdatingMessages();


createGroupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  let grpinformation = {
    groupName: groupNameInput.value,
    members: membersInput.value.split(',').map(name => name.trim())
  };
  if (groupNameInput.value && membersInput.value) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post("http://44.204.114.231:4000/group/creategrp", grpinformation, { headers: { 'Authentication': token } });
      console.log(response.data.groupid);
      if (response.status == 201) {
        // Add new group to list of groups
        const parent = document.querySelector('#groups');

        let child = `<li onclick="insideGroup(${response.data.groupid}); getgroups()">${groupNameInput.value}</li>`
        parent.innerHTML = parent.innerHTML + child

        // Close modal and clear form inputs
        // closeModal();
        groupNameInput.value = '';
        membersInput.value = '';
      }
      else if (response.status == 202) {
        groupNameInput.value = '';
        membersInput.value = '';
        alert('You are not admin of this group,you can not add the user to the group')
      }
      else {
        groupNameInput.value = '';
        membersInput.value = '';
        throw new Error(response.message);
      }
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert('Please fill out all fields');
  }
});


uploadbtn.addEventListener('click',uploadFile);

       async function uploadFile(e){
        try{
            e.preventDefault();
            const uploadedfile=file.files[0];
            console.log(uploadedfile);
            if(!uploadedfile){
               msg.innerHTML="Please Upload a file ";
               setTimeout(()=>{
                   msg.innerHTML="";
               },3000)
           }
           else{
            const formData=new FormData();
            formData.append('file',uploadedfile);
            console.log(formData);
            const groupId=JSON.parse(localStorage.getItem('groupId'));
            const token=localStorage.getItem('token');
            const response=await axios.post(`http://localhost:4000/chat/sendfile/${groupId}`,formData,{headers:{"Authorization":token,'Content-Type':'multipart/form-data'}});
                console.log(response);
                showmessage(response.data.message.username,response.data.message.message)
                uploadedfile.value=null;
           }
        }catch(err){
            console.log(err);
            msg.innerHTML="";
          msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
          setTimeout(()=>{
            msg.innerHTML="";
        },3000)
      }
  }
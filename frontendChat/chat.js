async function sendMessage() {
    const response= await axios.get("http://localhost:4000/users/login")
    if(response.status==201){
        console.log('okay');
       
    }
    // Get the input box and the chat box elements
    const inputBox = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-box");
    
    // Create a new paragraph element to display the message
    const message = document.createElement("p");
    message.innerHTML = inputBox.value;
    
    // Append the message to the chat box
    chatBox.appendChild(message);
    
    // Clear the input box
    inputBox.value = "";
  }
const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const chatBox = document.getElementById('chatBox')
const messageEl = document.getElementById('message')
const user = document.getElementById('user')
const date = new Date() // Date implementation

socket.on('newMessage', data => {
    addMessage(data, false)
});

socket.on("newUserEntered", data => {
  const notification = document.createElement("li");
  notification.innerHTML =  `<strong>${data.username}</strong> has joined the conversation - ${data.time}`;
  notification.classList.add("new-user-notification");
  chatBox.appendChild(notification);
  console.log(data);
});

// Post message to board
const postMessage = async () => {
  const data = {
    message: messageEl.value,
    time: getCurrentTime()
  };

  fetch("chat/postMessage", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then( response => response.json())
  .then( response => {
    /*if(response.msg === "success") {
      const newMessage = document.createElement("li");
      newMessage.innerText = `${data.msg}`;
      chatBox.appendChild(newMessage);
    }*/

    messageEl.value = "";
  })
}

// Add message from any user to chatbox, determine if added
// by current user.
const addMessage = (data = {}, theUser = false) => {
  const newMessage = document.createElement("li");
  let the_user;
  if (user) {
    the_user = user.value;
  } else {
    the_user = "";
  }
  newMessage.classList.add(`${the_user===data.user? 'out' : 'in'}`);
  
  newMessage.innerHTML = `
    <div class="chat-img">
      <img alt="Avtar" src="https://bootdey.com/img/Content/avatar/avatar6.png">
    </div>
    <div class="chat-body">
      <div class="chat-message">
        <h5>${the_user===data.user? 'Yo' : data.user}</h5>
        <p>${data.message}</p>
        <small>${data.time}</small>
      </div>
    </div>
  `;
  chatBox.appendChild(newMessage);
};

const getCurrentTime = () => {
  const now = new Date();
  

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return `${hours}:${minutes} ${ampm}`
};

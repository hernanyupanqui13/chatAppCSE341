const socket = io('/'); // This means your client will always be connected to your server, locally or on Heroku.

const errorContainer = document.getElementById('errMsg');
const usernameInput = document.getElementById('username');
const date = new Date()

// A simple async POST request function
const getData = async (url = '') => {
    const response = await fetch(url, {
        method: 'GET'
    })
    return response.json()
}

// A simple async POST request function
const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response.json()
}

// Login user to access chat room.
const login = async () => {
  const username = usernameInput.value;
  const response = await postData("login", {username: username});
  if (response.msg === "success") {
    socket.emit("newUser", username, getCurrentTime())
    window.location = "chat";
  } else {
    Swal.fire(
      'Ups!',
      response.details,
      'error'
    )
    console.log(response.msg, response.details);
  }
}


const getCurrentTime = () => {
  const now = new Date();
  

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return `${hours}:${minutes} ${ampm}`
};


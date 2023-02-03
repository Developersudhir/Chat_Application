const socket = io();
var username;
var container = document.querySelector(".container");
var list = document.querySelector(".list");
var count = document.getElementById("user_count");
var message = document.getElementById("message");
var btn = document.getElementById("btn");
var audio = new Audio("./ring.mp3");

// Taking Username And Storing In Variable
do {
  username = prompt("Enter Your Name: ");
} while (!username);

var Uname=document.getElementById('Uname');
Uname.innerText="Welcome "+username;

// Emitting The Event "New User Joined" When User Joined The Website
socket.emit("new-user-joined", username);

// When "User Joined"  Event Occured We Appending His Name In Chat As Join User 
socket.on("user-joined", (soc_name) => {
  userJoinedleft(soc_name, "joined");
});

// Function For Appending Username In Chat
function userJoinedleft(name, status) {
  let div = document.createElement("div");
  // div.innerText=name;
  div.classList.add("status");
  let content = `<p><b>${name}</b> ${status} the chat</p>`;
  div.innerHTML = content;
  container.appendChild(div);
  container.scrollTop=container.scrollHeight;

}
// When User Disconnected We Showing The Message User Left
socket.on("user-disconnected", (user) => {
  userJoinedleft(user, "left");
});

// For dislaying And Storing The Joined Users And Appending In Users List
socket.on("user-list", (users) => {
  list.innerHTML = "";
  users_arr = Object.values(users);
  for (i = 0; i < users_arr.length; i++) {
    let li = document.createElement("li");
    li.innerText = users_arr[i];
    list.appendChild(li);
  }
  count.innerHTML = users_arr.length;
});

/// Adding Event Listener On Send Button To Sending Message
btn.addEventListener("click", () => {
  let data = {
    user: username,
    msg: message.value,
  };
  if (message.value != "") {
    appendMessage(data, "right");
    socket.emit("message", data);
    message.value = "";
  }
});

// Function For Appeneding Message with Sender Name

function appendMessage(data, status) {
  let div = document.createElement("div");
  div.classList.add("message", status);
  let content = `<h6>${data.user} ~</h6>
    <p>${data.msg}</p>`;
  div.innerHTML = content;
  container.appendChild(div);
  if (status == "left") {
        audio.play();
  };
};
// appending Message At Left Side Of Chat
socket.on("message", (data) => {
  appendMessage(data, "left");
});

const socket = io();

const container = document.querySelector(".chat");

socket.on("init-chat", (arg) => {
  console.log(arg);
  container.innerHTML = "";

  arg.forEach((chat) => {
    const chatList = document.createElement("div");
    chatList.innerHTML = `
                <h3>Name: ${chat.user}</h3>
                <p>Message:${chat.message}</p>
                `;
    chatList.className = "cards";
    container.appendChild(chatList);
  });
});

socket.on("new-message", (arg) => {
  const chatList = document.createElement("div");
  chatList.innerHTML = `
                <h3>Name: ${arg.user}</h3>
                <p>Message:${arg.message}</p>
                `;
  chatList.className = "cards";
  container.appendChild(chatList);
});

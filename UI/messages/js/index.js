let button = document.getElementById("toggle-menu"),
  navContainer = document.getElementById("homepage-navbar"),
  modal = document.getElementById("modal-test");

let messageContainer = document.querySelector(".display-message"),
  sender = document.querySelector("sender"),
  subject = document.querySelector("subject"),
  body = document.querySelector("message-body");

button.addEventListener("click", function(event) {
  event.preventDefault();
  console.log("hello");
  navContainer.classList.remove("toggle-off");
  modal.style.display = "block";
  navContainer.classList.add("toggle-on");
});

window.addEventListener("mouseup", function(event) {
  if (
    event.target !== navContainer &&
    event.target.parentNode !== navContainer
  ) {
    navContainer.classList.add("toggle-off");
    navContainer.classList.remove("toggle-on");
    modal.style.display = "none";

    console.log("hey");
  }
});

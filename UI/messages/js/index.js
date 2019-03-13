const button = document.getElementById('toggle-menu');
const navContainer = document.getElementById('homepage-navbar');
const loginLink = document.getElementById('loginlink');
const signupLink = document.getElementById('signuplink');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const modal = document.getElementById('modal-test');
const loginDiv = document.getElementById('loginform-container');
const signupDiv = document.getElementById('signupform-container');
const passwordReset = document.getElementById('password-reset');
const passwordForm = document.getElementById('password-form');
const messageContainer = document.querySelector('.display-message');
const sender = document.querySelector('sender');
const subject = document.querySelector('subject');
const mainBody = document.getElementsByTagName('body');
const body = document.querySelector('message-body');

button.addEventListener('click', (event) => {
  event.preventDefault();
  navContainer.classList.remove('toggle-off');
  modal.style.display = 'block';
  navContainer.classList.add('toggle-on');
  mainBody[0].style.overflow = 'hidden';
});

window.addEventListener('mouseup', (event) => {
  if (event.target !== navContainer && event.target.parentNode !== navContainer) {
    navContainer.classList.add('toggle-off');
    navContainer.classList.remove('toggle-on');
    modal.style.display = 'none';
    mainBody[0].style.overflow = 'auto';
  }
});

loginLink.addEventListener('click', () => {
  loginForm.classList.remove('form-display');
  signupForm.classList.add('form-display');
  passwordForm.classList.add('form-display');
});

signupLink.addEventListener('click', () => {
  loginForm.classList.add('form-display');
  passwordForm.classList.add('form-display');
  signupForm.classList.remove('form-display');
});

passwordReset.addEventListener('click', () => {
  loginForm.classList.add('form-display');
  signupForm.classList.add('form-display');
  passwordForm.classList.remove('form-display');
});




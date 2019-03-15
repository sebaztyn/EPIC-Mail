const button = document.getElementById('toggle-menu');
const navContainer = document.getElementById('homepage-navbar');
const modal = document.getElementById('modal-test');
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
  button.style.display = 'none';
  mainBody[0].style.overflow = 'hidden';
});

window.addEventListener('mouseup', (event) => {
  if (event.target !== navContainer && event.target.parentNode !== navContainer) {
    navContainer.classList.add('toggle-off');
    button.style.display = 'block';
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

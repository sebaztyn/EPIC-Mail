/*  eslint import/first: 0 */
import { fetchPOST } from './fetch.mjs';

const button = document.getElementById('toggle-menu');
const navContainer = document.getElementById('homepage-navbar');
const modal = document.getElementById('modal-test');
const composeMail = document.querySelector('a[class="main-page-compose-individual-mail"]');

const sendMailButton = document.querySelector('#submit-message');

// Handles sending mails to users
const sendMailHandler = (event) => {
  event.preventDefault();
  const email = document.querySelector('#recipient-email').value;
  const subject = document.querySelector('#email-subject').value;
  const message = document.querySelector('#email-message').value;
  const messageObj = { email, subject, message };
  const url = 'https://epic-mail-2018.herokuapp.com/api/v1/messages';
  return fetchPOST(url, 'POST', messageObj);
};


if (sendMailButton) sendMailButton.addEventListener('click', sendMailHandler);
button.addEventListener('click', (event) => {
  event.preventDefault();
  navContainer.classList.remove('toggle-off');
  modal.style.display = 'block';
  navContainer.classList.add('toggle-on');
  button.style.display = 'none';
});
window.addEventListener('mouseup', (event) => {
  if (event.target !== navContainer && event.target.parentNode !== navContainer) {
    navContainer.classList.add('toggle-off');
    button.style.display = 'block';
    navContainer.classList.remove('toggle-on');
    modal.style.display = 'none';
    // mainBody[0].style.overflow = 'auto';
  }
});


// if (composeMail) composeMail.addEventListener('click', composeMessageHandler);
// if (sendMailButton) sendMailButton.addEventListener('click', sendMailHandler);

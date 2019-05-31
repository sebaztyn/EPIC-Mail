import groupMethods from './group.mjs';
import { fetchGET, fetchPOST, deleteMessageHandler } from './fetch.mjs';


const button = document.getElementById('toggle-menu');
const navContainer = document.getElementById('homepage-navbar');
const modal = document.getElementById('modal-test');
const inboxBodyTag = document.querySelector('#application-inbox-body-element');
const deletedBodyTag = document.querySelector('#application-deleted-body-element');
const sentBodyTag = document.querySelector('#application-sent-body-element');
const composeMessageTag = document.querySelector('#application-compose-message-element');
const unreadBodyTag = document.querySelector('#application-unread-body-element');
const myGroupsBodyTag = document.querySelector('#application-myGroup-body-element');
const draftBodyTag = document.querySelector('#application-draft-body-element');
const sendMailButton = document.querySelector('#submit-message');
const mainContainerElement = document.querySelector('div[class="container"]');
const listMessageDisplay = document.querySelector('.display-list-message ');
const generalViewPane = document.querySelector('.view-pane');
const composeMessage = document.querySelector('.new-msg-container');
const headerString = document.querySelector(".header-string");
const messageReturnButton = document.querySelector(".display-list-message span:first-child");
const messageDeleteButton = document.querySelector(".display-list-message span:nth-child(2)");
const createGroupReset = document.querySelector('.group-cover>div:nth-child(2)>span:first-child');
const createNewGroupButton = document.querySelector('#submit-name');

const bodyHandler = url => fetchGET(url);


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

if (messageDeleteButton) messageDeleteButton.addEventListener('click', deleteMessageHandler);

if (sendMailButton) sendMailButton.addEventListener('click', sendMailHandler);

// Keeping an active SCREEN even with a dynamic resizing of device
const screenSize = (e) => {
  if (e.matches) {
    if (listMessageDisplay) {
      if (listMessageDisplay.style.display === 'block') {
        mainContainerElement.style.display = 'none';
        generalViewPane.style.display = 'block';
      }
    }
  } else if (mainContainerElement) {
    mainContainerElement.style.display = 'block';
  }
};

window.matchMedia('(max-width: 799px)').addListener(screenSize);

const composeMessageHandler = () => {
  if (window.matchMedia('(max-width: 559px)').matches) { headerString.textContent = 'new message'; }
  const senderEmail = document.querySelector("#sender-email");
  senderEmail.textContent = localStorage.getItem('email');
  if (window.matchMedia('(max-width: 799px)').matches) {
    if (mainContainerElement) mainContainerElement.style.display = 'none';
    composeMessage.style.display = 'block';
  } else if (composeMessage) {
    composeMessage.style.display = 'block';
  }
};

if (localStorage.getItem('token') && myGroupsBodyTag) groupMethods.listGroupsHandler();
if (localStorage.getItem('token') && composeMessageTag) composeMessageHandler();
if (localStorage.getItem('token') && inboxBodyTag) bodyHandler('https://epic-mail-2018.herokuapp.com/api/v1/messages');
if (localStorage.getItem('token') && unreadBodyTag) bodyHandler('https://epic-mail-2018.herokuapp.com/api/v1/messages/unread');
if (localStorage.getItem('token') && sentBodyTag) bodyHandler('https://epic-mail-2018.herokuapp.com/api/v1/messages/sent');
if (localStorage.getItem('token') && draftBodyTag) bodyHandler('https://epic-mail-2018.herokuapp.com/api/v1/messages/draft');

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

createGroupReset.addEventListener('click', groupMethods.createGroupresetInputHandler);
if (createNewGroupButton) createNewGroupButton.addEventListener('click', groupMethods.createGroupHandler);
if (messageReturnButton) {
  messageReturnButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (inboxBodyTag) window.location.href = '/UI/paths/index.html';
    if (unreadBodyTag) window.location.href = '/UI/paths/unread.html';
    if (sentBodyTag) window.location.href = '/UI/paths/sent.html';
    if (draftBodyTag) window.location.href = '/UI/paths/draft.html';
    if (deletedBodyTag) window.location.href = '/UI/paths/deleted.html';
  });
}

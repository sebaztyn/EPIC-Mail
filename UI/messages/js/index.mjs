import groupMethods from './group.mjs';
import { fetchGET, fetchPOST, deleteMessageHandler } from './fetch.mjs';


const button = document.getElementById('toggle-menu');
const navContainer = document.getElementById('homepage-navbar');
const modal = document.getElementById('modal-test');
const inbox = document.querySelector('a[class="main-page-inbox"]');
const unread = document.querySelector('a[class="main-page-unread"]');
const sent = document.querySelector('a[class="main-page-sent"]');
const createGroupLink = document.querySelector('a[class="main-page-create-group"]');
const composeMessageLink = document.querySelector('a[class="main-page-compose-individual-mail"]');
const myGroup = document.querySelector('a[class="main-page-my-group"]');
const deletedMails = document.querySelector('a[class="main-page-deleted"]');
const draft = document.querySelector('a[class="main-page-draft"]');
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
const createGroupReset = document.querySelector('.group-cover>div:nth-child(2) span');
const createNewGroupButton = document.querySelector('#submit-name');

const bodyHandler = url => fetchGET(url);


// Handles sending mails to users
const sendMailHandler = (event) => {
  event.preventDefault();
  const email = document.querySelector('#recipient-email').value;
  const subject = document.querySelector('#email-subject').value;
  const message = document.querySelector('#email-message').value;
  const messageObj = { email, subject, message };
  const url = 'http://localhost:3000/api/v1/messages';
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

if (myGroupsBodyTag) groupMethods.listGroupsHandler();
if (composeMessageTag) composeMessageHandler();
if (inboxBodyTag) bodyHandler('http://localhost:3000/api/v1/messages');
if (unreadBodyTag) bodyHandler('http://localhost:3000/api/v1/messages/unread');
if (sentBodyTag) bodyHandler('http://localhost:3000/api/v1/messages/sent');
if (draftBodyTag) bodyHandler('http://localhost:3000/api/v1/messages/draft');

const newMessageHandler = () => {
  if (localStorage.getItem('token')) {
    window.location.href = 'http://127.0.0.1:5500/UI/messages/compose-message.html';
  }
};
const unreadHandler = () => {
  if (localStorage.getItem('token')) {
    window.location.href = 'http://127.0.0.1:5500/UI/messages/unread.html';
  }
};
const sentMessageViewHandler = () => {
  if (localStorage.getItem('token')) {
    window.location.href = 'http://127.0.0.1:5500/UI/messages/sent.html';
  }
};
const inboxHandler = () => {
  if (localStorage.getItem('token')) {
    window.location.href = 'http://127.0.0.1:5500/UI/messages/index.html';
  }
};
const myGroupHandler = () => {
  if (localStorage.getItem('token')) {
    window.location.href = 'http://127.0.0.1:5500/UI/messages/my-group.html';
  }
};
const createGroupLinkHandler = () => {
  if (localStorage.getItem('token')) {
    window.location.href = 'http://127.0.0.1:5500/UI/messages/group.html';
  }
};
const clickHandler = (url) => {
  if (localStorage.getItem('token')) {
    window.location.href = url;
  }
};

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

inbox.addEventListener('click', inboxHandler);
unread.addEventListener('click', unreadHandler);
sent.addEventListener('click', sentMessageViewHandler);
composeMessageLink.addEventListener('click', newMessageHandler);
myGroup.addEventListener('click', myGroupHandler);
if (createGroupReset) createGroupReset.addEventListener('click', groupMethods.createGroupresetInputHandler);
if (createGroupLink) createGroupLink.addEventListener("click", createGroupLinkHandler);
if (createNewGroupButton) createNewGroupButton.addEventListener('click', groupMethods.createGroupHandler);
deletedMails.addEventListener('click', clickHandler);
draft.addEventListener('click', clickHandler);
if (messageReturnButton) {
  messageReturnButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (inboxBodyTag) window.location.href = 'http://127.0.0.1:5500/UI/messages/index.html';
    if (unreadBodyTag) window.location.href = 'http://127.0.0.1:5500/UI/messages/unread.html';
    if (sentBodyTag) window.location.href = 'http://127.0.0.1:5500/UI/messages/sent.html';
    if (draftBodyTag) window.location.href = 'http://127.0.0.1:5500/UI/messages/draft.html';
    if (deletedBodyTag) window.location.href = 'http://127.0.0.1:5500/UI/messages/deleted.html';
  });
}
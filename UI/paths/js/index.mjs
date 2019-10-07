import groupMethods from './group.mjs';
import { groupPopIn } from './group.mjs';
import {
  fetchGET,
  fetchPOST,
  deleteMessageHandler
}

  from './fetch.mjs';

const button = document.getElementById('toggle-menu');
const navContainer = document.querySelector('#homepage-navbar');
const modalBackdrop = document.querySelector('.modal-backdrop');
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
const popMessage = document.querySelector('.new-msg-container>div:last-child');
const headerString = document.querySelector(".header-string");
const messageReturnButton = document.querySelector(".display-list-message span:first-child");
const messageDeleteButton = document.querySelector(".display-list-message span:nth-child(2)");
const createGroupReset = document.querySelector('.group-cover>div:nth-child(2)>span:first-child');
const groupNameReset = document.querySelector('#group-name-reset');
const createNewGroupButton = document.querySelector('#submit-name');
const groupList = document.querySelector('.group-list-card ul');
const myGroupModal = document.querySelector('.my-group-modal');
const modalCloseButton = document.querySelector('.group-manipulation>span');
const editGroupNameButton = document.querySelector('.group-name-edit');
const addMemberModal = document.querySelector('.add-group-user');
const deleteGroupButton = document.querySelector('.delete-group-div');
const addGroupUserButton = document.querySelector('#add-group-user');
const changeGroupName = document.querySelector('#group-name-change');
const deleteGroup = document.querySelector('#delete-group-button');
const groupPopMessage = document.querySelector('div#group-popup-message'); const addUserResetButton = document.querySelector('#addUser-reset');
const newMessageModal = document.querySelector('#new-group-message');
const sendGroupMessageButton = document.querySelector('#submit-group-message');
const memberListModal = document.querySelector('#group-members-list');
const groupMemberContainer = document.querySelector('.group-member-container');

const bodyHandler = url => fetchGET(url);


const groupNameModal = (event) => {
  editGroupNameButton.style.display = 'block';
  addMemberModal.style.display = 'none';
  newMessageModal.style.display = 'none';
  deleteGroupButton.style.display = 'none';
  memberListModal.style.display = 'none';
  return changeGroupName.setAttribute('data-group_id', event.target.parentElement.parentElement.dataset.groupid);
};
const groupMembersModal = (event) => {
  memberListModal.style.display = 'block';
  editGroupNameButton.style.display = 'none';
  addMemberModal.style.display = 'none';
  newMessageModal.style.display = 'none';
  deleteGroupButton.style.display = 'none';
  return memberListModal.setAttribute('data-group_id', event.target.parentElement.dataset.groupid);
};
const addUserModal = (event) => {
  editGroupNameButton.style.display = 'none';
  deleteGroupButton.style.display = 'none';
  newMessageModal.style.display = 'none';
  memberListModal.style.display = 'none';
  addMemberModal.style.display = 'block';
  return addGroupUserButton.setAttribute('data-group_id', event.target.parentElement.parentElement.dataset.groupid);
};
const deleteGroupModal = (event) => {
  const groupName = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent.toUpperCase();
  document.querySelector('.confirm-group-delete').textContent = `Delete ${groupName}?`;
  editGroupNameButton.style.display = 'none';
  addMemberModal.style.display = 'none';
  newMessageModal.style.display = 'none';
  memberListModal.style.display = 'none';
  deleteGroupButton.style.display = 'block';
  return deleteGroup.setAttribute('data-group_id', event.target.parentElement.parentElement.dataset.groupid);
};
const groupMessageModal = (event) => {
  newMessageModal.style.display = 'block';
  editGroupNameButton.style.display = 'none';
  addMemberModal.style.display = 'none';
  deleteGroupButton.style.display = 'none';
  memberListModal.style.display = 'none';
  return sendGroupMessageButton.setAttribute('data-group_id', event.target.parentElement.parentElement.dataset.groupid);
};
const groupModalHandler = (event) => {
  if (event.target.matches('.fa-edit') || event.target.matches('.fa-user-plus') || event.target.matches('.fa-trash') || event.target.matches('.fa-envelope') || event.target.matches('.member-list')) {
    myGroupModal.style.display = 'block';
  }
  if (event.target.matches('.fa-edit')) {
    return groupNameModal(event);
  }
  if (event.target.matches('.member-list')) {
    groupMembersModal(event);
    return groupMethods.listMembersHandler();
  }
  if (event.target.matches('.fa-user-plus')) {
    return addUserModal(event);
  }
  if (event.target.matches('.fa-trash')) {
    return deleteGroupModal(event);
  }
  if (event.target.matches('.fa-envelope')) {
    return groupMessageModal(event);
  }
};
if (groupList) groupList.addEventListener('click', groupModalHandler, true);
/* eslint-disable no-return-assign */

// Handles sending mails to users
const popUp = () => popMessage.style.bottom = '0vh';
const sendMailHandler = (event) => {
  const email = document.querySelector('#recipient-email').value;
  const subject = document.querySelector('#email-subject').value;
  const message = document.querySelector('#email-message').value;
  popUp();
  if (!email) return popMessage.textContent = 'Recipient email is required';
  if (!subject) return popMessage.textContent = 'Email subject is required';
  if (!message) return popMessage.textContent = 'Message field cannot be blank';
  popMessage.textContent = 'Sending Message';
  const messageObj = {
    email,
    subject,
    message
  };
  event.preventDefault();
  setTimeout(() => {
    const url = 'https://epic-mail-2018.herokuapp.com/api/v1/messages';
    fetchPOST(url, 'POST', messageObj);
  }, 1000);
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
  if (window.matchMedia('(max-width: 559px)').matches) {
    headerString.textContent = 'new message';
  }
  const senderEmail = document.querySelector("#sender-email");
  senderEmail.textContent = localStorage.getItem('email');
  if (window.matchMedia('(max-width: 799px)').matches) {
    if (mainContainerElement) mainContainerElement.style.display = 'none';
  }
}

;
if (localStorage.getItem('token') && myGroupsBodyTag) groupMethods.listGroupsHandler();
if (localStorage.getItem('token') && composeMessageTag) composeMessageHandler();
if (localStorage.getItem('token') && inboxBodyTag) bodyHandler('https://epic-mail-2018.herokuapp.com/api/v1/messages');
if (localStorage.getItem('token') && unreadBodyTag) bodyHandler('https://epic-mail-2018.herokuapp.com/api/v1/messages/unread');
if (localStorage.getItem('token') && sentBodyTag) bodyHandler('https://epic-mail-2018.herokuapp.com/api/v1/messages/sent');
if (localStorage.getItem('token') && draftBodyTag) bodyHandler('https://epic-mail-2018.herokuapp.com/api/v1/messages/draft');


const slideOut = () => modalBackdrop.style.width = '100vw';
const slideIn = () => modalBackdrop.style.width = '0vw';
button.addEventListener('click', (event) => {
  event.preventDefault();
  button.style.display = 'none';
  return slideOut();
}

);
window.addEventListener('mouseup', (event) => {
  if (event.target !== navContainer && event.target.parentNode !== navContainer) {
    button.style.display = 'block';
    return slideIn();
  }
});
if (createGroupReset)createGroupReset.addEventListener('click', groupMethods.createGroupresetInputHandler);
if (groupMemberContainer)groupMemberContainer.addEventListener('click', groupMethods.deleteMember, true);
if (groupNameReset)groupNameReset.addEventListener('click', groupMethods.groupNameResetHandler);
if (addGroupUserButton) addGroupUserButton.addEventListener('click', groupMethods.addUser);
if (createNewGroupButton) createNewGroupButton.addEventListener('click', groupMethods.createGroupHandler);
if (deleteGroup) deleteGroup.addEventListener('click', groupMethods.deleteGroupHandler);
if (sendGroupMessageButton) sendGroupMessageButton.addEventListener('click', groupMethods.sendGroupMessage);
if (changeGroupName) changeGroupName.addEventListener('click', groupMethods.changeNameHandler);
if (addUserResetButton) addUserResetButton.addEventListener('click', () => document.querySelector('#add-group-member').value = '');
if (modalCloseButton) {
  modalCloseButton.addEventListener('click', () => {
    groupPopIn();
    if (groupPopMessage.textContent)groupPopMessage.textContent = '';
    myGroupModal.style.display = 'none';
  });
}
if (messageReturnButton) {
  messageReturnButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (inboxBodyTag) window.location.href = '../paths/index.html';
    if (unreadBodyTag) window.location.href = '../paths/unread.html';
    if (sentBodyTag) window.location.href = '../paths/sent.html';
    if (draftBodyTag) window.location.href = '../paths/draft.html';
    if (deletedBodyTag) window.location.href = '../paths/deleted.html';
  }
  );
}

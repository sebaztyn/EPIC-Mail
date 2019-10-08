
let ulContainerElement = document.querySelector('div[class="container"] ul');
const mainContainerElement = document.querySelector('div[class="container"]');
const inboxBodyTag = document.querySelector('#application-inbox-body-element');
const sentBodyTag = document.querySelector('#application-sent-body-element');
const unreadBodyTag = document.querySelector('#application-unread-body-element');
const subject = document.querySelector('.subject');
const sender = document.querySelector('.sender');
const messageBody = document.querySelector('.display-the-full-message');
const displayMessage = document.querySelector('.display-list-message');
const popMessageDiv = document.querySelector('.new-msg-container>div:last-child');
const viewPane = document.querySelector('.view-pane');

const option = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
};
const displayMessageHandler = (event, url) => {
  event.preventDefault();
  if (localStorage.getItem('token')) {
    fetch(url, option)
      .then(response => response.json())
      .then((res) => {
        if (res.data) {
          messageBody.setAttribute('data-messageid', res.data[0].message_id);
          if (window.matchMedia('(max-width: 799px)').matches) {
            mainContainerElement.style.display = 'none';
            viewPane.style.display = 'block';
            displayMessage.style.display = 'block';
          } else {
            mainContainerElement.style.display = 'block';
            displayMessage.style.display = 'block';
          }
          if (res.data[0].status === 'sent') {
            sender.innerHTML = `To:<em>${res.data[0].email}</em>`;
          }
          if (res.data[0].status !== 'sent') {
            sender.innerHTML = `From: <em>${res.data[0].sender_email}</em>`;
          }
          subject.innerHTML = `<h4>${res.data[0].subject}</h4>`;
          messageBody.textContent = res.data[0].message;
        }
      })
      .catch(err => console.log(err));
  }
};
const dataObj = (res) => {
  const notificationDiv = document.querySelector('.unread-notification');
  if (notificationDiv) notificationDiv.style.display = 'none';
  ulContainerElement.style.display = 'block';
  const messages = res.data;
  ulContainerElement.innerHTML = '';
  messages.forEach((message) => {
    const liElement = document.createElement('li');
    if (unreadBodyTag || inboxBodyTag) liElement.addEventListener('click', event => displayMessageHandler(event, `https://epic-mail-2018.herokuapp.com/api/v1/messages/${liElement.dataset.message_id}`));
    if (sentBodyTag) liElement.addEventListener('click', event => displayMessageHandler(event, `https://epic-mail-2018.herokuapp.com/api/v1/messages/sent/${liElement.dataset.message_id}`));

    liElement.setAttribute('data-message_id', message.message_id);
    liElement.setAttribute('class', 'message_list');
    const pTags = `<p><em>${message.firstname} ${message.lastname}</em></p>
                            <p><strong>${message.subject}</strong></p>
                            <p>${message.message}</p>`;
    liElement.innerHTML = pTags;
    ulContainerElement.prepend(liElement);
    return ulContainerElement;
  });
  return mainContainerElement.appendChild(ulContainerElement);
};

export const emptyDataObj = (res) => {
  if (!ulContainerElement) ulContainerElement = document.querySelector('.container ul');
  if (ulContainerElement) ulContainerElement.style.display = 'none';
  const messages = res.message;
  const msgDiv = `<div  class='unread-notification'>
          <p><span><i class="fa fa-exclamation-circle"></i></span></p>
          <p>${messages}</p>
        </div>`;
  mainContainerElement.innerHTML = msgDiv;
  return mainContainerElement;
};


const errorMsgObj = (res) => {
  if (!ulContainerElement) ulContainerElement = document.querySelector('.container ul');
  if (ulContainerElement) ulContainerElement.style.display = 'none';
  const messages = res.error;
  const msgDiv = `<div  class='unread-notification'>
          <p>${messages}</p>
        </div>`;
  mainContainerElement.innerHTML = msgDiv;
  return mainContainerElement;
};

export const fetchGET = (url) => {
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then((response) => {
      if (response.data) {
        return dataObj(response);
      }
      if (response.message) {
        return emptyDataObj(response);
      }
      if (response.error) {
        return errorMsgObj(response);
      }
    })
    .catch(err => console.log(err));
};

export const fetchPOST = (url, verb, bodyObj) => {
  const popIn = () => {
    popMessageDiv.textContent = 'Message Sent Successfully!';
    popMessageDiv.style.bottom = '-10vh';
  };
  fetch(url, {
    method: verb,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObj)
  })
    .then(res => res.json())
    .then((response) => {
      if (response.status !== 201) {
        return popMessageDiv.textContent = response.error;
      }
      if (response.status === 201) {
        popIn();
        popMessageDiv.addEventListener('transitionend', () => {
          popMessageDiv.textContent = '';
          return window.location.assign('/EPIC-Mail/UI/paths/index.html');
        });
      }
    })
    .catch(err => console.log(err));
};


export const deleteMessageHandler = (event) => {
  event.preventDefault();
  if (localStorage.getItem('token')) {
    let url;
    const messageId = messageBody.dataset.messageid;
    if (sentBodyTag) {
      url = `https://epic-mail-2018.herokuapp.com/api/v1/messages/sent/${messageId}`;
    } else {
      url = `https://epic-mail-2018.herokuapp.com/api/v1/messages/${messageId}`;
    }
    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then((response) => {
        if (response.data) {
          if (sentBodyTag)window.location.href = '/EPIC-Mail/UI/paths/sent.html';
          if (inboxBodyTag) window.location.href = '/EPIC-Mail/UI/paths/index.html';
          if (unreadBodyTag) window.location.href = '/EPIC-Mail/UI/paths/unread.html';
        }
      })
      .catch(err => console.log(err));
  }
};

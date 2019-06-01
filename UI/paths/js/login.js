const loginButton = document.querySelector('.login-submit-button');
const email = document.querySelector('#login-email-input');
const password = document.querySelector('#login-password-input');


const getUserData = () => {
  const userData = { email: email.value, password: password.value };
  return userData;
};


const notifyLoginDiv = document.querySelector(".notify-login-user");

const notifyLoginUser = (message) => {
  const notifyParagraph = `<p>${message}</p>`;
  notifyLoginDiv.innerHTML = notifyParagraph;
  return notifyLoginDiv;
};
const removeNotificationMsg = () => {
  notifyLoginDiv.innerHTML = '';
  return notifyLoginDiv;
};

const loginHandler = (event) => {
  event.preventDefault();
  const loginData = getUserData();
  if (!loginData.email) {
    return notifyLoginUser('Email field cannot be empty');
  }
  if (!loginData.password) {
    return notifyLoginUser('Password field cannot be empty');
  }
  fetch('https://epic-mail-2018.herokuapp.com/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then((response) => {
      if (response.status === 201) {
        localStorage.setItem('token', response.data[0].token);
        localStorage.setItem('email', loginData.email);
        notifyLoginUser('Login successful');
        return setTimeout(() => { window.location.replace('/EPIC-Mail/UI/paths/index.html'); }, 2000);
      }
      return notifyLoginUser(response.error);
    })
    .catch(err => console.log(err));
};
loginButton.addEventListener('click', loginHandler);

email.addEventListener('input', removeNotificationMsg);
password.addEventListener('input', removeNotificationMsg);

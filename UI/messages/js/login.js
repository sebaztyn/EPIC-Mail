const loginButton = document.querySelector('button[class="login-submit-button"]');
const email = document.querySelector('#login-email-input');
const password = document.querySelector('#login-password-input');


const getUserData = () => {
  const userData = { email: email.value, password: password.value };
  return userData;
};

let notifyLoginDiv = null;
const notifyLoginUser = (message) => {
  if (!notifyLoginDiv) {
    const parentDiv = document.querySelector('.main-login');
    const loginDiv = document.querySelector('.form-footer');
    notifyLoginDiv = document.createElement('div');
    notifyLoginDiv.setAttribute('id', 'notify-login-user');
    notifyLoginDiv.setAttribute('class', 'user-notification');
    notifyLoginDiv.textContent = '';
    notifyLoginDiv.textContent = message;
    return parentDiv.insertBefore(notifyLoginDiv, loginDiv);
  }
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
        setTimeout(() => { window.location.replace('../index.html'); }, 2000);
      }
      return notifyLoginUser(response.error);
    })
    .catch(err => console.log(err));
};
loginButton.addEventListener('click', loginHandler);

const removeNotificationMsg = () => {
  if (notifyLoginDiv) {
    notifyLoginDiv = document.querySelector('#notify-login-user');
    return notifyLoginDiv.parentElement.removeChild(notifyLoginDiv);
  }
};
email.addEventListener('input', removeNotificationMsg);
password.addEventListener('input', removeNotificationMsg);

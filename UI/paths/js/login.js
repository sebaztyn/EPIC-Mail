const loginButton = document.querySelector('.login-submit-button');
const email = document.querySelector('#login-email-input');
const password = document.querySelector('#login-password-input');
const spinner = document.querySelector('.fa');


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

const loginHandler = (event) => {
  spinner.classList.add('fa-spinner');
  event.preventDefault();
  const loginData = getUserData();
  if (!loginData.email) {
    spinner.classList.remove('fa-spinner');
    return notifyLoginUser('Email field cannot be empty');
  }
  if (!loginData.password) {
    spinner.classList.remove('fa-spinner');
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
        localStorage.setItem('id', response.data[0].id);
        localStorage.setItem('email', response.data[0].email);
        spinner.classList.remove('fa-spinner');
        window.location.replace('UI/paths');
      } else {
        spinner.classList.remove('fa-spinner');
        return notifyLoginUser(response.error);
      }
    })
    .catch(err => console.log(err));
};
const removeNotificationMsg = () => {
  spinner.classList.remove('fa-spinner');
  notifyLoginDiv.innerHTML = '';
  return notifyLoginDiv;
};
loginButton.addEventListener('click', loginHandler);

email.addEventListener('input', removeNotificationMsg);
password.addEventListener('input', removeNotificationMsg);

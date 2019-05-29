const signupButton = document.querySelector('button[id="signup-button"]');
const firstName = document.querySelector('#signup-firstName');
const lastName = document.querySelector('#signup-lastName');
const username = document.querySelector('#signup-username');
const email = document.querySelector('#signup-email');
const password = document.querySelector('#signup-password');
const confirmPassword = document.querySelector('#signup-confirm-password');
const recoveryEmail = document.querySelector('#signup-recoveryEmail');


const getUserData = () => {
  const userData = {
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    recoveryEmail: recoveryEmail.value
  };
  return userData;
};

let notifyDiv;
const notifyUser = (message) => {
  if (!notifyDiv) {
    const signupDiv = document.querySelector('#signup-form-buttons');
    notifyDiv = document.createElement('div');
    notifyDiv.setAttribute('id', 'notify-user');
    notifyDiv.setAttribute('class', 'user-notification');
    notifyDiv.textContent = '';
    notifyDiv.textContent = message;
    return signupDiv.insertBefore(notifyDiv, signupDiv.firstElementChild);
  }
};

const signupHandler = (event) => {
  event.preventDefault();
  const formData = getUserData();
  if (formData.password !== formData.confirmPassword) {
    return notifyUser('Passwords do not match. Try again');
  }
  delete formData.confirmPassword;
  fetch('http://localhost:3000/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then((response) => {
      if (response.status === 201) {
        localStorage.setItem('token', response.data[0].token);
        console.log(localStorage.getItem('token'));
        notifyUser('Signup successful');
        setTimeout(() => { window.location.replace('http://127.0.0.1:5500/UI/messages/index.html'); }, 2000);
      } else {
        return notifyUser(response.error);
      }
    })
    .catch(err => console.log(err));
};
const removeNotificationMsg = () => {
  if (notifyDiv) {
    notifyDiv = document.querySelector('#notify-user');
    notifyDiv.parentElement.removeChild(notifyDiv);
  }
};

signupButton.addEventListener('click', signupHandler);

firstName.addEventListener('input', removeNotificationMsg);

lastName.addEventListener('input', removeNotificationMsg);

username.addEventListener('input', removeNotificationMsg);

email.addEventListener('input', removeNotificationMsg);

password.addEventListener('input', removeNotificationMsg);

confirmPassword.addEventListener('input', removeNotificationMsg);

recoveryEmail.addEventListener('input', removeNotificationMsg);

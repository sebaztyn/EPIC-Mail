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

const notifyDiv = document.querySelector(".notify-user");

const notifyUser = (message) => {
  const notifyParagraph = `<p>${message}</p>`;
  notifyDiv.innerHTML = notifyParagraph;
  return notifyDiv;
};
const removeNotificationMsg = () => {
  notifyDiv.innerHTML = '';
  return notifyDiv;
};

const signupHandler = (event) => {
  event.preventDefault();
  const formData = getUserData();
  if (formData.password !== formData.confirmPassword) {
    return notifyUser('Passwords do not match. Try again');
  }
  delete formData.confirmPassword;
  fetch('https://epic-mail-2018.herokuapp.com/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then((response) => {
      if (response.ok) {
        localStorage.setItem('token', response.data[0].token);
        notifyUser('Signup successful');
        setTimeout(() => { window.location.replace('/UI/paths/index.html'); }, 2000);
      } else {
        return notifyUser(response.error, "An error occurred");
      }
    })
    .catch(err => console.log(err));
};

signupButton.addEventListener('click', signupHandler);

firstName.addEventListener('input', removeNotificationMsg);

lastName.addEventListener('input', removeNotificationMsg);

username.addEventListener('input', removeNotificationMsg);

email.addEventListener('input', removeNotificationMsg);

password.addEventListener('input', removeNotificationMsg);

confirmPassword.addEventListener('input', removeNotificationMsg);

recoveryEmail.addEventListener('input', removeNotificationMsg);

const groupUlContainer = document.querySelector('.group-list-card ul');

const postGroup = (url, bodyObj) => {
  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObj)
  })
    .then(response => response.json())
    .then((res) => {
      if (res.status === 201) return res.data;
    })
    .catch(err => console.log(err));
};


const option = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
};
const getGroup = (url) => {
  fetch(url, option)
    .then(res => res.json())
    .then((response) => {
      if (response.data) return response.data;
    }).catch(err => console.log(err));
};

const groupData = (res) => {

};

const groupMethods = {
  createGroupresetInputHandler(event) {
    const createGroupInput = document.querySelector('#group-name');
    event.preventDefault();
    createGroupInput.value = '';
    return createGroupInput;
  },
  createGroupHandler(event) {
    event.preventDefault();
    const url = 'http://localhost:3000/api/v1/groups';
    const newGroupName = document.querySelector('#group-name').value;
    const obj = {
      name: newGroupName
    };
    return postGroup(url, obj);
  },
  listGroupsHandler() {
    const url = 'http://localhost:3000/api/v1/groups';
    fetch(url, option)
      .then(res => res.json())
      .then((response) => {
        if (response.data) {
          const groups = response.data;
          groups.forEach((group) => {
            const htmlString = `<li  data-groupid="${group.group_id}">
    <p>${group.name}</p>
    <span><i class="fa fa-edit"></i></span>
    <span><i class="fa fa-user-plus"></i></span>
    <span><i class="fa fa-trash-alt"></i></span>
    <span><i class="fa fa-envelope"></i></span>
  </li>`;
            groupUlContainer.insertAdjacentHTML('afterbegin', htmlString);
          });
          return groupUlContainer;
        }
      })
      .catch(err => console.log(err));
  }
};

export default groupMethods;
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

const listGroupHTML = (id, name) => `<li data-groupid="${id}">
    <p>${name}</p>
    <span>
      <i class="fa fa-edit tooltip">
       <span class="edit">Edit Group Name</span>
      </i>
    </span>
    <span>
      <i class="fa fa-user-plus tooltip">
        <span class="add-user">Add new User</span>
      </i>
    </span>
    <span>
      <i class="fa fa-trash-alt tooltip">
        <span class="delete-group">Delete Group</span>
      </i>
    </span>
    <span>
      <i class="fa fa-envelope tooltip">
            <span class="group-message">Send Group Message</span>
      </i>
    </span>
  </li>`;


const groupMethods = {
  createGroupresetInputHandler(event) {
    const createGroupInput = document.querySelector('#group-name');
    event.preventDefault();
    createGroupInput.value = '';
    return createGroupInput;
  },
  createGroupHandler(event) {
    event.preventDefault();
    const url = 'https://epic-mail-2018.herokuapp.com/api/v1/groups';
    const newGroupName = document.querySelector('#group-name').value;
    const obj = {
      name: newGroupName
    };
    return postGroup(url, obj);
  },
  listGroupsHandler() {
    const url = 'https://epic-mail-2018.herokuapp.com/api/v1/groups';
    fetch(url, option)
      .then(res => res.json())
      .then((response) => {
        if (response.data) {
          const groups = response.data;
          groups.forEach((group) => {
            const htmlString = listGroupHTML(group.group_id, group.name);
            groupUlContainer.insertAdjacentHTML('afterbegin', htmlString);
          });
          return groupUlContainer;
        }
      })
      .catch(err => console.log(err));
  }
};

export default groupMethods;

const groupUlContainer = document.querySelector('.group-list-card ul');
const groupMemberContainer = document.querySelector('#group-members-list ul');
const popMessageDiv = document.querySelector('.main-group>div:last-child');
const groupNameInputElement = document.querySelector('#group-name');
const changeGroupNameInput = document.querySelector('#change-group-name');
const groupPopMessage = document.querySelector('div#group-popup-message');


const popIn = (message) => {
  popMessageDiv.textContent = message;
  popMessageDiv.style.bottom = '-10vh';
};
/* eslint-disable no-return-assign */
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
      if (res.status === 201) {
        popIn('Group Created Successfully!');
        popMessageDiv.addEventListener('transitionend', () => {
          popMessageDiv.textContent = '';
          return setTimeout(() => groupNameInputElement.value = '', 1000);
        });
      } else {
        return popMessageDiv.textContent = res.error;
      }
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
    <p class="member-list" data-groupid="${id}">
    Click here to view group members
    <hr>
    </p>
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
      <i class="fa fa-trash tooltip">
        <span class="delete-group">Delete Group</span>
      </i>
    </span>
    <span>
      <i class="fa fa-envelope tooltip">
            <span class="group-message">Send Group Message</span>
      </i>
    </span>
  </li>`;

// Handles changing group name popins;
export const groupPopIn = (message) => {
  groupPopMessage.textContent = message;
  groupPopMessage.style.bottom = '-10vh';
};


// Handles the fetch API request to change a group name;
const fetchPatch = (url, bodyObj) => fetch(url, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(bodyObj)
})
  .then(response => response.json())
  .then((res) => {
    if (res.status === 201) {
      groupPopIn('Group Name Changed successfully');
      return groupPopMessage.addEventListener('transitionend', () => {
        changeGroupNameInput.value = '';
        groupPopMessage.textContent = '';
        return setTimeout(() => window.location.reload('/EPIC-Mail/UI/paths/my-group.html'), 1000);
      });
    }
    groupPopMessage.textContent = res.error;
    return groupPopMessage;
  })
  .catch(err => console.log(err));


// Handles the fetch API request to DELETE a group;
const fetchDelete = url => fetch(url, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then((res) => {
    if (res.status === 200) {
      groupPopIn(res.data[0].message);
      return groupPopMessage.addEventListener('transitionend', () => {
        groupPopMessage.textContent = '';
        return setTimeout(() => window.location.reload('/EPIC-Mail/UI/paths/my-group.html'), 1000);
      });
    }
    groupPopMessage.textContent = res.error;
    return groupPopMessage;
  })
  .catch(err => console.log(err));


// Handles the fetch API request to DELETE a Member of a group;
const fetchDeleteMember = url => fetch(url, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then((res) => {
    if (res.status === 200) {
      groupPopIn(res.data[0].message);
      return groupPopMessage.addEventListener('transitionend', () => {
        groupPopMessage.textContent = '';
        return setTimeout(() => window.location.reload('/EPIC-Mail/UI/paths/my-group.html'), 1000);
      });
    }
    groupPopMessage.textContent = res.error;
    return groupPopMessage;
  })
  .catch(err => console.log(err));

// Handles create group popups
const popUp = () => popMessageDiv.style.bottom = '0vh';

// Handles changing group name popups
const groupPopUp = () => groupPopMessage.style.bottom = '0vh';


const emptyGroup = (res) => {
  document.querySelector('.group-list-card ul ').style.display = 'none';
  const messages = res.message;
  const msgDiv = `<div  class='unread-notification'>
          <p><span><i class="fa fa-exclamation-circle"></i></span></p>
          <p>${messages}</p>
        </div>`;
  return document.querySelector('.group-list-card').innerHTML = msgDiv;
};

const postAddUserToGroup = (url, bodyObj) => fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(bodyObj)
})
  .then(res => res.json())
  .then((response) => {
    if (response.status === 201) {
      groupPopIn('New member added');
      groupPopMessage.addEventListener('transitionend', () => {
        groupPopMessage.textContent = '';
        return setTimeout(() => document.querySelector('#add-group-member').value = '', 1000);
      });
    } else {
      return groupPopMessage.textContent = response.error;
    }
  })
  .catch(err => console.log(err));


const postGroupMessage = (url, bodyObj) => fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(bodyObj)
})
  .then(res => res.json())
  .then((response) => {
    if (response.status === 201) {
      groupPopIn('Message sent to group');
      groupPopMessage.addEventListener('transitionend', () => {
        groupPopMessage.textContent = '';
        return setTimeout(() => {
          document.querySelector('#email-subject').value = '';
          document.querySelector('#email-message').value = '';
          return window.location.reload('/EPIC-Mail/UI/paths/my-group.html');
        }, 1000);
      });
    } else {
      return groupPopMessage.textContent = response.error;
    }
  })
  .catch(err => console.log(err));

const memberList = (id, groupId, firstname, lastname) => `
<li data-userid="${id}" data-groupid="${groupId}" class='single-member'>
  <span data-userid=${id} data-groupid="${groupId}" class="member-name">${firstname} ${lastname}</span>
  <span data-userid=${id} data-groupid="${groupId}" class="remove-member">Remove Member</span>
  </li>`;

// THE GROUP METHODS FOR THE GROUP ENDPOINTS

const groupMethods = {
  // Handles clearing of change group name input field
  groupNameResetHandler() {
    changeGroupNameInput.value = '';
    groupPopMessage.textContent = '';
    return changeGroupNameInput;
  },

  // Handles the changing of group name
  changeNameHandler() {
    const groupId = document.querySelector('#group-name-change').dataset.group_id;
    const newName = changeGroupNameInput.value;
    groupPopMessage.textContent = 'Changing group name';
    groupPopUp();
    const url = `https://epic-mail-2018.herokuapp.com/api/v1/groups/${groupId}/name`;
    const nameObj = { name: newName };
    return setTimeout(() => fetchPatch(url, nameObj), 1000);

  },

  // Handles clearing of create group input field
  createGroupresetInputHandler(event) {
    const createGroupInput = document.querySelector('#group-name');
    event.preventDefault();
    createGroupInput.value = '';
    return createGroupInput;
  },

  // Handles Group Creation
  createGroupHandler(event) {
    event.preventDefault();
    const url = 'https://epic-mail-2018.herokuapp.com/api/v1/groups';
    const newGroupName = groupNameInputElement.value;
    popUp();
    if (!newGroupName) return popMessageDiv.textContent = 'Enter a group name please';
    popMessageDiv.textContent = 'Creating Group';

    const obj = {
      name: newGroupName
    };
    return setTimeout(() => postGroup(url, obj), 1000);
  },


  // Handles Group DELETION
  deleteGroupHandler(event) {
    const groupId = document.querySelector('#delete-group-button').dataset.group_id;
    const url = `https://epic-mail-2018.herokuapp.com/api/v1/groups/${groupId}`;
    groupPopMessage.textContent = 'Deleting Group';
    groupPopUp();
    return setTimeout(() => fetchDelete(url), 1000);
  },

  // List all groups available to a user
  listGroupsHandler() {
    const id = localStorage.getItem('id');
    const url = `https://epic-mail-2018.herokuapp.com/api/v1/groups`;
    fetch(url, option)
      .then(res => res.json())
      .then((response) => {
        if (response.data) {
          const groups = response.data;
          const groupList = groups.map((group) => {
            const htmlString = listGroupHTML(group.group_id, group.name);
            return groupUlContainer.insertAdjacentHTML('afterbegin', htmlString);
          });
          return groupList;
        }
        if (response.message) {
          return emptyGroup(response);
        }
      })
      .catch(err => console.log(err));
  },

  // List all members in a group
  listMembersHandler() {
    groupMemberContainer.innerHTML = '';
    const groupId = document.querySelector('#group-members-list').dataset.group_id;
    const url = `https://epic-mail-2018.herokuapp.com/api/v1/groups/${groupId}/members`;
    fetch(url, option)
      .then(res => res.json())
      .then((response) => {
        if (response.data) {
          document.querySelector('.group-name').textContent = response.data[0].name;
          const members = response.data;
          members.forEach((member) => {
            const memberHTML = memberList(member.id, groupId, member.firstname, member.lastname);
            groupMemberContainer.insertAdjacentHTML('afterbegin', memberHTML);
          });
          return groupMemberContainer;
        }
        if (response.message) {
          return emptyGroup(response);
        }
      })
      .catch(err => console.log(err));
  },

  // Handles Adding a user to a group;
  addUser() {
    const groupId = document.querySelector('#add-group-user').dataset.group_id;
    const bodyObj = { email: document.querySelector('#add-group-member').value };
    const url = `https://epic-mail-2018.herokuapp.com/api/v1/groups/${groupId}/users/`;
    groupPopMessage.textContent = 'Adding User to group';
    groupPopUp();
    setTimeout(() => postAddUserToGroup(url, bodyObj), 1000);

  },

  // For sending GROUP Messages
  sendGroupMessage() {
    groupPopMessage.textContent = 'Sending Message';
    groupPopUp();
    const groupId = document.querySelector('#submit-group-message').dataset.group_id;
    const messageObj = {
      subject: document.querySelector('#email-subject').value,
      message: document.querySelector('#email-message').value
    };

    const url = `https://epic-mail-2018.herokuapp.com/api/v1/groups/${groupId}/messages`;
    setTimeout(() => postGroupMessage(url, messageObj), 1000);
  },

  // Delete members in a group
  deleteMember(event) {
    groupPopMessage.textContent = 'Deleting Member';
    groupPopUp();
    const id = event.target.dataset.userid;
    const groupId = event.target.dataset.groupid;
    const url = `https://epic-mail-2018.herokuapp.com/api/v1/groups/${groupId}/users/${id}`;
    return setTimeout(() => fetchDeleteMember(url), 1000);
  }


};

export default groupMethods;

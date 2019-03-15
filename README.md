# EPIC-Mail

[![Test Coverage](https://api.codeclimate.com/v1/badges/fedcd971281710565457/test_coverage)](https://codeclimate.com/github/sebaztyn/EPIC-Mail/test_coverage) [![Coverage Status](https://coveralls.io/repos/github/sebaztyn/EPIC-Mail/badge.svg?branch=develop)](https://coveralls.io/github/sebaztyn/EPIC-Mail?branch=develop) [![Build Status](https://travis-ci.com/sebaztyn/EPIC-Mail.svg?branch=develop)](https://travis-ci.com/sebaztyn/EPIC-Mail)


### EPIC Mail
As EPIC Andelans who work towards advancing human potential and giving back to the society, we wish to empower others by building a web app that helps people exchange messages/information over the internet.

#### Getting Started


##### Pre-requisites
- Internet Connection
- HTML
- Cascading Stylesheet(CSS)
- JavaScript
- NodeJS
- Git
- npm
- Express Library
- A test suite e.g Mocha and Chai
- Pivotal Tracker
-JSON Web Token

#### Installing


#### Template URL
- https://sebaztyn.github.io/EPIC-Mail/UI/index.html

#### Api URL
- https://epic-mail-2018.herokuapp.com/

#### Api Documentation
-  https://epic-mail-2018.herokuapp.com/api-docs

#### User Access
User
- email: johndoe@johndoe.com
- password: Password123

#### How to get a local copy
**Clone repository**
- copy the link to the project from github website
- create a folder on local machine
- cd in to the folder and call a git init
- git clone repository
- npm install to install development dependencies


### Routes
- GET https://epic-mail-2018.herokuapp.com/ - A visit to the homepage

- GET https://epic-mail-2018.herokuapp.com/api/v1/messages - A visit to endpoint provides all received messages

- GET https://epic-mail-2018.herokuapp.com/api/v1/messages/2 - A visit to endpoint returns a specific message

- DELETE https://epic-mail-2018.herokuapp.com/api/v1/messages/2 - A visit to endpoint deletes a specific message and returns a string
- GET https://epic-mail-2018.herokuapp.com/api/v1/messages/sent - A visit to endpoint returns an array of all the sent items

- GET https://epic-mail-2018.herokuapp.com/api/v1/messages/unread - A visit to endpoint returns an array of all received unread items
- POST https://epic-mail-2018.herokuapp.com/api/v1/auth/signup - A visit to endpoint creates a new user and returns a signup token.
- POST https://epic-mail-2018.herokuapp.com/api/v1/auth/login - A visit to endpoint allows an already registered user to login on providing matching credientials with what is saved in the database.


#### Branches
The branches are structured in a way that explains what they do during the app building process. For example, a branch that tracked the login endpoint creation was called ft-login-xxx 
while there equally branches that took care of bug fixes and routine chores.


#### Running Tests
Tests are run by calling 'npm test' using testing suites of Mocha and Chai
```
App running on port 3000


  Testing endpoints
    √ It should post new user data to the database (1275ms)
    √ It allow user saved in the database access to the login page (655ms)

  Creating and Testing  API endpoint for Receiving Messages
    √ it  should return specific keys "allMessages and Status" when a call is made to all received messages (40ms)

  Fetching all unread Messages
    √ it  should return specific value:UNREAD when a call is made to all received unread messages (88ms)

  Fetching all sent Messages
    √ it  should return specific value:SENT when a call is made to all sent messages (99ms)

  Fetching a specific Message
    √ it  should return a unique message matching the ID of the searched Message (76ms)

  Deleting a specific Message
    √ it  should return a unique matching the ID of the deleted Message (60ms)

  Creating a Message
    √ It should post user Message to the database (60ms)
```


### Contributor(s)
- Chima Ekeneme Sebastine

### Author(s)
- Chima Ekeneme Sebastine
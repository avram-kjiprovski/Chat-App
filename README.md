# Chat App

In this repository both the front-end and the back-end are combined. 
Everything outside the 'client' directory is a backend, everything inside the 'client' directory is front-end.

## How to start:
- Through one terminal navigate to 'client' directory and execute the following:
    - npm install
    - npm start
- Through a different terminal at the root directory of the project execute the following:
    - npm install
    - npm start


## Additional information

At root directory there is a .env file which isn't pushed on github which includes information for the following variables:
- MONGO_URI
- PORT (i.e '8000')
- LOG_LEVEL
- TOKEN_EXPIRATION_TIME
- SECRET_KEY 
- SALT_ROUNDS (i.e '10')
- PREFIX (i.e 'api/v1/')


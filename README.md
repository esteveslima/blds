# blds

Website for a fictitious company 'Travel A' with a simple CRUD and Google Maps Embed API Integration.

This project was built without security features. The API key should not be exposed and the key provided in this project will be removed as soon as possible.

The images used in the website were uploaded to the repository to ensure their existence in future tests and this is leading to a bigger repository size.

## Testing locally

First of all, ensure that the ports 3000 and 8080 are free for use.

### Test with Docker

  - Ensure that you have installed docker and docker-compose;
    - docker: https://docs.docker.com/engine/install/
    - docker-compose: https://docs.docker.com/compose/install/
    
  - Run the command `docker-compose up --build --detach` inside the folder `/deployments`;
 
  - Right after the containers finish building, the ports 3000 for the front-end and 8080 for the back-end will be exposed to the host for testing. 
  
  - Open `http://localhost:3000` in the browser;

This test already have all the configurations needed for this project in the file `/deployments/docker-compose.yml`.

### Manual Test

  - Ensure that you have mysql, node and npm installed with the services up and running;
  - Change the credentials for the mysql database `DB_USER` and `DB_PASS` in the file `/back-end/config/.env`. This credentials might be the root credentials created with mysql installation or the credentials of another created user:
      ```bash
        mysql -u root -p
        ...
        CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
        GRANT ALL PRIVILEGES ON * . * TO 'user'@'localhost';
        FLUSH PRIVILEGES;
      ```      
  
  - Also change the credentials for the Google Maps Embed API `REACT_APP_GOOGLE_MAPS_API_KEY` in the file `/front-end/blds/.env`. 
  Temporary Credential key created: `AIzaSyCaHRdOGunmKAd-fMtYkVdXmrv4geKEeyQ`

  - To start the back-end, run the following commands inside the `/back-end` root folder:
    ```npm
      npm install
      npm run migrate
      npm run build
      npm start
    ```
        
  - To start the front-end, run the following commands inside the `/front-end/blds` root folder:
    ```npm
      npm install
      npm start
    ```
    
    If everything was configured correctly the access to the page `http:/localhost:3000/` and the communication to the back-end at port 8080 will be provided.

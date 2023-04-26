# Hardware Store project

<p align="center">
<img src="readme/🖥️Hardware_Store.png">
</p>

## A simple Hardware store web app with login functionality

## Instalation

I have provided Docker files that are necessary to build this app as containers. There is also a compose file that allows you to set up the entire app on any server with just one compose command.

### Instalation steps:

1. Download and install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).
2. Download project onto your server.
3. If you plan to use this app in production, buy a domain and set up the DNS providers to point this domain to your server's public IP address. Edit the docker-compose.yaml file so that the front-end website points to the purchased domain instead of localhost.
    - For security reasons, it is advised to edit mongo-init.js to create a new database user. If you do this step, you will have to edit the mongo string inside the compose file to include the credentials.
    - Change the volumes directories if you want the data to be saved on a specific file path.
4. Run following command if you are finished with configuration:

```bash
docker-compose up
```

5. If you didn't edit the compose file and you host this app on your personal PC, the website will be hosted on the 127.0.0.1 address on the default port 80.

### **IMPORTANT NOTES!**

1. On the first run, every image will be built from source, so it may take a few seconds (if not minutes) to start.
2. Login credentials are necessary to access the admin actions. On startup, a new user is created with the following credentials

```
login: admin@example.com
password: admin
```

3. Later on, you should create a new admin user and delete this temporary one.

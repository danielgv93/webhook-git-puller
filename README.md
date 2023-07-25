# WEBHOOK GIT PULLER

## Description

This application recieves the HTTP POST request from a github webhook repository and updates the server application on the server using ssh connection.

## Usage
- Create a .env file with the following variables:
```env
  SSH_HOST=SSH_HOST
  SSH_USERNAME=SSH_USERNAME
  SSH_PASSWORD=SSH_PASSWORD
  SSH_PORT=SSH_PORT ## Optional
  REPOSITORY_PATH="/your/repositories/folder/path"
```
- Deploy the aplication with docker:
```bash
docker compose up --build -d
```

Default listening port `3002`

# BookBix_Backend

## Development Setups

### For Powershell and Bash users(local development)
#### Prerequisites
Before starting local development, it is required to have Node.js installed in your system. Additionally, you will need to install the Nest.js CLI by running the following command: 

    npm install -g @nestjs/cli

 The advantage of using the Nest.js CLI is that it helps to create, build, and manage your Nest.js projects easily and efficiently.

#### step to development
1. Copy contents of `.env.template` to a new file named `.env`
2. Run the following command:

    Powershell: `./docker.ps1 `

    Bash: `./docker.sh`


### For devcontainer user(remote development)
#### step to development(there is no Prerequisites because it on container)

1. Clone the repository
   
2. Open the cloned repository in Visual Studio Code

3. Click the "Remote-Containers: Open Folder in Container" command in the Command Palette (press `F1` to open the Command Palette)

4. Wait for the container to start and for the application to be installed

5. Copy contents of `.env.template` to a new file named `.env`

6. Run the following command: `nest start` The application will start in development mode, allowing you to make code changes and see the results in real-time.
 


### Tech Stack
- Nest.js
- MongoDB
- Docker

### Warning
Do not modify the `docker` file without proper understanding.


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
 
3. Copy contents of `.env.template` to a new file named `.env`  (if you not doing this the next step will be error)

4. Click the "Remote-Containers: Open Folder in Container" command in the Command Palette (press `F1` to open the Command Palette) 
 
5. Wait for the container to start and for the application to be installed 
 
6. Run the following command: `nest start --watch` The application will start in development mode, allowing you to make code changes and see the results in real-time. 
  
7. if you want to use git you need to use this command first `git config --global --add safe.directory /workspaces/sec33_Group4_BookBix_Backend` (and the vscode will suggest you to Manage Unsafe Repositories to use git in vscode)
 
### **Getting the Stripe Secret Key**

The Stripe secret key is required to make API calls to the Stripe API, such as creating and updating customers, charges, and subscriptions. Here's how you can get your Stripe secret key:

1. Sign up for a Stripe account at **[https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)**.
2. Once you've signed up, navigate to the **Developers** section in your Stripe dashboard.
3. In the **API keys** section, you'll see your **Test mode** and **Live mode** secret keys. Copy the **Test mode** secret key (which starts with **`sk_test_`**) and set it as the value of the **`STRIPE_SECRET_KEY`** environment variable in your **`.env`** file.
    
    ```
    STRIPE_SECRET_KEY=sk_test_..
    ```
    
    If you don't have an **`.env`** file, create one in the root directory of your project.
    
4. Use the **`STRIPE_SECRET_KEY`** environment variable to make API calls to the Stripe API.
    
    You can also find your Stripe secret key by navigating to **[https://dashboard.stripe.com/test/apikey](https://dashboard.stripe.com/test/apikey)**, which will display your **Test mode** secret key. Make sure to keep your secret key secure and not share it with anyone.

### **Using Stripe `listen` with a Local Webhook**

Stripe provides a command-line interface (CLI) tool called **`listen`** that lets you receive webhook events from Stripe and test your webhook handler locally. You can use the **`listen`** command with the **`--forward-to`** option to forward webhook events to a local endpoint, such as **`http://localhost:3001/stripe/webhook`**.

Here are the steps to use the **`listen`** command with a local webhook:

1. Install the Stripe CLI by following the instructions **[here](https://stripe.com/docs/stripe-cli#install)**.
2. Start your server on port **`3001`** and make sure it's accessible at **`http://localhost:3001/stripe/webhook`**. This endpoint will receive the webhook events from Stripe.
3. Run the following command to start listening for webhook events:
    
    ```
    stripe listen --forward-to http://localhost:3001/stripe/webhook
    ```
    
    This command starts the webhook listener and forwards any events received from Stripe to the specified local endpoint.
4. When you run the **`listen`** command for the first time, Stripe generates a webhook signing secret for you. Copy this secret and set it as the value of the **`STRIPE_WEBHOOK_SECRET`** environment variable in your **`.env`** file. If you don't have an **`.env`** file, create one in the root directory of your project.
    
    ```
    STRIPE_WEBHOOK_SECRET=whsec_...
    ```
    
    You can also find the webhook signing secret in your Stripe dashboard under **Developers** > **Webhooks** > **Signing secret**. Make sure to keep this secret secure and not share it with anyone.    
### Tech Stack 
- Nest.js 
- MongoDB 
- Docker 
 
### Warning 
Do not modify the `docker` file without proper understanding. 
 
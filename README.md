# Manage Oauth token in NodeJs
This project aims to show how to manage Oauth token lifecycle. You could freely reuse the token module in your project. It use [Got](https://www.npmjs.com/package/got) to handle http requests process.

## Content
Based on [openid-client](https://github.com/panva/node-openid-client) to use it in your project, you need to add a dependency to `openid-client`, and then download the files [token.js](common/token.js) and [retry.js](common/retry.js) from this project, and add it in yours, feel free to adapt it if needed.

## First time run
1. Clone the repo: git clone https://github.com/Orange-OpenSource/oauth2-token-manager-for-nodeJS.git

2. Install project dependencies

    ```bash
    yarn install
    ```

3. Subscribe to [an API](https://developer.orange.com/products/) for this sample choose [An SMS API](https://developer.orange.com/?s=sms&c=&type=api)

4. Get your client id and secret provided to you

5. Set your client id, secret, API hostname, token endpoint within `.env`

6. Run the script

    ```bash
    npm run start
    ```
7. Open http://localhost:3000 in your browser, and voilà.

To check if token calls work, you could try to sent you an SMS phone_number format without country number, neither the 0: http://localhost:3000/sms?phone_number=623456789&message=mylocalappwork

`token.js` module use environnement variables (loaded via `dotenv` in that sample project): 
* CLIENT_ID
* CLIENT_SECRET
* DISCOVER_URL (optionnal) e.g `DISCOVER_URL = "https://GATEWAY/oauth/v3/.well-known/oauth-authorization-server"`
* TOKEN_ENDPOINT (optionnal if DISCOVER_URL is provided)
* API_HOSTNAME Hostname to join the API without protocol e.g `GATEWAY`
* SCOPES (optionnal) Each requested scopes needed separated by a space

When it's done, you could use the module in any file of your project by importing the token and retry module, and call `getAccessToken` function. This function return a promise, as an example of how to use it you could take a look at [sms.js](./routes/sms.js).

`Retry` module allow to manage token expiration and then intercept the error to allow refreshing token and retrying the request

For any question or remark, please feel free to open an issue
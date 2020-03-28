const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


const processSecret = (callback, id=null) => {
    fs.readFile(constants.CLIENT_SECRET, function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Gmail API.
        authorize(JSON.parse(content), callback, id);
    });
}


const authorize = (credentials, callback, id=null) => {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
 
    var OAuth2 = google.auth.OAuth2;
 
    var oauth2Client = new OAuth2(clientId, clientSecret,  redirectUrl);
 
    // Check if we have previously stored a token.
    fs.readFile(constants.TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        if(id)
          callback(oauth2Client, id);
        else
          callback(oauth2Client);
      }
    });
}


const getNewToken = (oauth2Client, callback, id=null) => {
    var authUrl = oauth2Client.generateAuthUrl({access_type: 'offline', scope: constants.SCOPES});
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
   
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        if(id)
        callback(oauth2Client, id);
        else
        callback(oauth2Client);
      });
    });
};


const storeToken = (token) => {
    try {
      fs.mkdirSync(constants.TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFileSync(consts.TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }
  


const constants = {
    SCOPES: 'https://www.googleapis.com/auth/gmail.readonly',
    TOKEN_DIR: 'credentials/',
    TOKEN_PATH: 'credentials/gmail-nodejs.json',
    CLIENT_SECRET: 'client_secret.json',
};


module.exports = processSecret;
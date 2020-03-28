const {google} = require('googleapis');

const gmail = google.gmail('v1');
const getRecentTenEmail = (auth) => {
    
    // Only get the recent email - 'maxResults' parameter
    gmail.users.messages.list({auth: auth, userId: 'me', maxResults: 10,}, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
    // Get the message id which we will need to retreive tha actual message next.
    response['data']['messages'].forEach((message)=>{
        // Retreive the actual message using the message id
    
        gmail.users.messages.get({auth: auth, userId: 'me', 'id': message.id}, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
    
            console.log(response['data']);
            
        });

        });
    });

}

const getMailBodyById = (auth, id) => {
    gmail.users.messages.get({auth: auth, userId: 'me', 'id': id}, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
    
        if (response.data.payload && response.data.payload.parts && 
            response.data.payload.parts.length > 0 && response.data.payload.parts[0].body)
        {   const {data} = response.data.payload.parts[0].body;
            buff = new Buffer(data, 'base64');  
            text = buff.toString();
            console.log(text);
        }     
    });
}

module.exports = {
    getRecentTenEmail, 
    getMailBodyById
};
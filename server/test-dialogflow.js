// Simpan sebagai test-dialogflow.js
const dialogflow = require('@google-cloud/dialogflow');
const fs = require('fs');

// Cetak detail kredensial (tanpa private key)
const credentials = require('./config/sns-pproject-aaf4a4c8ad7c.json');
const credentialsCopy = {...credentials};
delete credentialsCopy.private_key;
console.log('Credentials:', credentialsCopy);

// Coba inisialisasi client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: './config/sns-pproject-aaf4a4c8ad7c.json'
});

console.log('Client initialized successfully');

// Coba query sederhana 
async function testQuery() {
  const projectId = credentials.project_id;
  const sessionId = 'test-session';
  const query = 'Hello';
  
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId, sessionId);
  
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: 'en-US',
      },
    },
  };
  
  try {
    console.log('Sending test query...');
    const responses = await sessionClient.detectIntent(request);
    console.log('Response:', responses[0].queryResult.fulfillmentText);
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

testQuery();
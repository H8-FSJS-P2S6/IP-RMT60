const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

const CREDENTIALS = require('../config/sns-project.json');
console.log(CREDENTIALS);
 
const projectId = CREDENTIALS.project_id;


const sessionClient = new dialogflow.SessionsClient({
  credentials: CREDENTIALS
});

/**
 * 
 * @param {string} text 
 * @param {string} sessionId 
 * @returns {Promise<Object>} 
 */
const sendMessageToDialogflow = async (text, sessionId = uuidv4()) => {
  try {
   
    const validSessionId = sessionId || uuidv4();
    console.log(`Processing message in session: ${validSessionId}`);
    
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      validSessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'en-EN', 
        },
      },
    };

    console.log(`Sending to Dialogflow: "${text}"`);
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    
    console.log(`Received intent: ${result.intent?.displayName || 'unknown'}`);
    console.log(`Response text: ${result.fulfillmentText}`);

    return {
      text: result.fulfillmentText,
      intent: result.intent?.displayName || '',
      parameters: result.parameters?.fields || {},
      sessionId: validSessionId,
    };
  } catch (error) {
    console.error('Error dengan Dialogflow:', error);
    throw new Error('Gagal berkomunikasi dengan chatbot: ' + error.message);
  }
};

module.exports = { sendMessageToDialogflow };

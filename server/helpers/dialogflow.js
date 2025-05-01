const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');

async function sendMessageToDialogflow(message, sessionId) {
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  // Validate environment variables
  if (!projectId) {
    throw new Error('DIALOGFLOW_PROJECT_ID is not set');
  }
  if (!credentialsPath) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set');
  }

  // Log for debugging
  console.log('Project ID:', projectId);
  console.log('Credentials Path:', credentialsPath);

  // Initialize Dialogflow client
  const sessionsClient = new dialogflow.SessionsClient({
    keyFilename: credentialsPath,
  });

  const sessionPath = sessionsClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'id-ID', // Match the agent's language
      },
    },
  };

  try {
    const [response] = await sessionsClient.detectIntent(request);
    return response.queryResult.fulfillmentText;
  } catch (error) {
    console.error('Dialogflow error:', error);
    throw new Error(`Failed to communicate with Dialogflow: ${error.message}`);
  }
}

module.exports = { sendMessageToDialogflow };
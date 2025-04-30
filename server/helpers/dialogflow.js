const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Perbaikan cara load credentials
const CREDENTIALS = require('../config/sns-pproject-aaf4a4c8ad7c.json');
const projectId = CREDENTIALS.project_id;

// Gunakan credentials langsung, daripada path file
const sessionClient = new dialogflow.SessionsClient({
  credentials: CREDENTIALS
});

/**
 * Mengirim pesan ke Dialogflow dan respons
 * @param {string} text - Pesan user
 * @param {string} sessionId - ID sesi unik
 * @returns {Promise<string>} - Respons dari Dialogflow
 */
const sendMessageToDialogflow = async (text, sessionId = uuidv4()) => {
  try {
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'id-ID', 
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    return {
      text: result.fulfillmentText,
      intent: result.intent?.displayName || '',
      parameters: result.parameters?.fields || {},
      sessionId,
    };
  } catch (error) {
    console.error('Error dengan Dialogflow:', error);
    throw new Error('Gagal berkomunikasi dengan chatbot');
  }
};

module.exports = { sendMessageToDialogflow };

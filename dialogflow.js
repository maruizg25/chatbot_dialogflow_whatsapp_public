const dialogflow = require("@google-cloud/dialogflow");

require("dotenv").config();
const express = require("express");
// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Other way to read the credentials
// const fs = require('fs');
// const CREDENTIALS = JSON.parse(fs.readFileSync('File path'));

// Your google dialogflow project-id
const PROJECID = CREDENTIALS.project_id;

// Configuration for the client
const CONFIGURATION = {
  credentials: {
    private_key: CREDENTIALS["private_key"],
    client_email: CREDENTIALS["client_email"],
  },
};
// Create a new session
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

async function sendToDialogFlow(msg, session, source, params) {
  let textToDialogFlow = msg;
  console.log("Dentro de la funcion sendToDialogFlow");
  try {
    const sessionPath = sessionClient.projectAgentSessionPath(
      PROJECID,
      session
    );
    console.log("Sesion path:" + sessionPath);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: textToDialogFlow,
          languageCode: "es",
        },
      },
      queryParams: {
        payload: {
          data: params,
        },
      },
    };    
    const responses = await sessionClient.detectIntent(request);
    console.log("Intent detectado");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log("INTENT EMPAREJADO: ", result.intent.displayName);
    } else {
      console.log("Intent no emparejado");
    }
    let defaultResponses = [];
    

    if (result.action !== "input.unknown") {
      result.fulfillmentMessages.forEach((element) => {
        if (element.platform === source) {
          defaultResponses.push(element);
        }
      });
    }
    if (defaultResponses.length === 0) {
      result.fulfillmentMessages.forEach((element) => {
        if (element.platform === "PLATFORM_UNSPECIFIED") {
          defaultResponses.push(element);
        }
      });
    }
    result.fulfillmentMessages = defaultResponses;
    console.log("Este es el resultado" + result);
    return result;
    // console.log("se enviara el resultado: ", result);
  } catch (e) {
    console.log("error");
    console.log(e);
  }
}

module.exports = {
  sendToDialogFlow,
};

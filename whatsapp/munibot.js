//libraries
const dialogflow = require("../dialogflow");

require("dotenv").config();
const express = require("express");
const router = express.Router();
//const request = require("request");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios"); //files
//const config = require("../config");
//const { structProtoToJson } = require("./helpers/structFunctions");
const sessionIds = new Map();

//for whatsapp verification
const token = process.env.TOKEN;

router.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;
  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

//for webhook whatsapp
router.post("/webhook", (req, res) => {
  //Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 3));
  let data = req.body;
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        data.entry[0].changes[0].value.metadata.phone_number_id;
      let from = data.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = data.entry[0].changes[0].value.messages[0].text.body;
      receivedMessage(data);
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});
// webhook for dialogflow
router.post("/dialogflow", (req, res) => {
  console.log(JSON.stringify(req.body.queryResult.outputContexts));
  let session = req.body.session;
  let context_name = `${session}/contexts/await_first`;
  res.send({
    fulfillmentText: "Hola desde el webhook de dialoflow",
    outputContexts: [
      {
        name: context_name,
        lifespanCount: 1,
        parameters: {
          name: "Mau",
        },
      },
    ],
  });
});

//Funcion pare recibir mensaje
async function receivedMessage(data) {
  let phone_number_id = data.entry[0].changes[0].value.metadata.phone_number_id;
  let from = data.entry[0].changes[0].value.messages[0].from;
  let msg_body = data.entry[0].changes[0].value.messages[0].text.body;
  let idwpp = data.id;
  let timeofMessage = data.entry[0].changes[0].value.messages[0].timestamp;
  console.log(
    "Mensaje recibido por el número de teléfono: %d con el mensaje: %s",
    from,
    msg_body
  );
  if (msg_body) {
    //send message to dialogflow
    console.log("MENSAJE DEL USUARIO: ", msg_body);
    await sendToDialogFlow(from, msg_body);
  } else {
    console.log("Es un mensaje con adjunto, y eso lo voy a hacer después jeje");
  }
  // if (messageAttachments) {
  //   handleMessageAttachments(messageAttachments, senderId);
  // }
}
async function sendToDialogFlow(from, msg_body) {
  console.log("Funcion sendToDialogFlow " + msg_body);
  try {
    let result;
    setSessionAndUser(from);
    let session = sessionIds.get(from);
    result = await dialogflow.sendToDialogFlow(msg_body, session, "whatsapp");
    console.log("Resultado de dialogflow: " + result);
    handleDialogFlowResponse(from, result);
  } catch (error) {
    console.log("salio mal en sendToDialogflow...", error);
  }
}
async function setSessionAndUser(from) {
  console.log("poniendo la sesion" + from);
  try {
    if (!sessionIds.has(from)) {
      sessionIds.set(from, uuidv4());
      console.log(sessionIds);
    }
  } catch (error) {
    throw error;
  }
}
function handleDialogFlowResponse(from, response) {
  console.log("handle dialog responses");
  let responseText = response.fulfillmentMessages.fulfillmentText;
  let messages = response.fulfillmentMessages;
  let action = response.action;
  let contexts = response.outputContexts;
  let parameters = response.parameters;

  // sendTypingOff(sender);

  if (isDefined(action)) {
    handleDialogFlowAction(from, action, messages, contexts, parameters);
  } else if (isDefined(messages)) {
    handleMessages(messages, from);
  } else if (responseText == "" && !isDefined(action)) {
    //dialogflow could not evaluate input.
    sendTextMessage(from, "No entiendo lo que trataste de decir ...");
  } else if (isDefined(responseText)) {
    sendTextMessage(from, responseText);
  }
}
async function sendTextMessage(from, text) {
  console.log("Listo para enviar el sms a la api de wpp");
  var messageData = {
    recipient: {
      id: from,
    },
    message: {
      text: text,
    },
    wppID: {
      idwpp: 105724232285422,
    },
  };

  callSendAPI(messageData);
}
async function handleDialogFlowAction(
  from,
  action,
  messages,
  contexts,
  parameters
) {
  switch (action) {
    case "exoneracion.impuestos":
      sendTextMessage(from, "Hola masito estamos en exoneración de impuestos");
      sendListMessage
      break;

    default:
      //unhandled action, just send back the text
      handleMessages(messages, from);
  }
}

async function handleMessages(messages, from) {
  console.log(messages);
  try {
    let i = 0;
    let cards = [];
    while (i < messages.length) {
      switch (messages[i].message) {
        case "card":
          for (let j = i; j < messages.length; j++) {
            if (messages[j].message === "card") {
              cards.push(messages[j]);
              i += 1;
            } else j = 9999;
          }
          await handleCardMessages(cards, from);
          cards = [];
          break;
        case "text":
          await handleMessage(messages[i], from);
          break;
        case "image":
          await handleMessage(messages[i], from);
          break;
        case "quickReplies":
          await handleMessage(messages[i], from);
          break;
        case "payload":
          await handleMessage(messages[i], from);
          break;
        default:
          break;
      }
      i += 1;
    }
  } catch (error) {
    console.log(error);
  }
}
async function handleMessage(message, from) {
  switch (message.message) {
    case "text": // text
      for (const text of message.text.text) {
        if (text !== "") {
          await sendTextMessage(from, text);
        }
      }
      break;
    case "quickReplies": // quick replies
      let replies = [];
      message.quickReplies.quickReplies.forEach((text) => {
        let reply = {
          content_type: "text",
          title: text,
          payload: text,
        };
        replies.push(reply);
      });
      await sendQuickReply(from, message.quickReplies.title, replies);
      break;
    case "image": // image
      await sendImageMessage(from, message.image.imageUri);
      break;
    case "payload":
      let desestructPayload = structProtoToJson(message.payload);
      var messageData = {
        recipient: {
          id: from,
        },
        message: desestructPayload.facebook,
      };
      await callSendAPI(messageData);
      break;
    default:
      break;
  }
}
function callSendAPI(messageData) { 
  console.log(messageData);
  let phoneTosend = messageData.recipient.id;
  let msg_to_send = messageData.message.text;
  let wppID = messageData.wppID.idwpp;
  axios({
    method: "POST",
    url:
      "https://graph.facebook.com/v14.0/" +
      wppID +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: phoneTosend,
      text: { body: msg_to_send },
    },
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      console.log(JSON.stringify(response.messageData));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function isDefined(obj) {
  if (typeof obj == "undefined") {
    return false;
  }

  if (!obj) {
    return false;
  }

  return obj != null;
}

module.exports = router;

const router = require("express").Router();
const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

//create Instance of Assistant

//First auth 
const authenticator = new IamAuthenticator({
    apikey: process.env.WATSON_ASSISTANT_APIKEY
});

//Connect to assistant
const assitant = new AssistantV2({
    version: "2019-02-28",
    authenticator: authenticator,
    url: process.env.WATSON_ASSISTANT_URL
});

//Route to Handle session tokens
// GET /api/watson/session
router.get("/session", async(req, res) => {
    try {
        const session = await assistant.createSession({
            assistantId: process.env.WATSON_ASSISTANT_ID
        });
        res.json(session["result"]);
    }catch(err){
        res.send("There was an error processing your request.");
        console.log(err);
    } 
});

//Handle Messages
//POST /api/watson/message
router.post("/message", async(req, res) => {
    //construct payload
    payload = {
        assistantId: process.env.WATSON_ASSISTANT_ID,
        sessionId: req.headers.session_id,
        input: {
            message_type: "text",
            text: req.body.input
        }
    };
    try{
        const message = await assistant.message(payload);
        res.json(message["result"]);
    }catch(err) {
        res.send("There was an error processing your request.");
        console.log(err);
    }
});

//Export routes 
module.exports = router;

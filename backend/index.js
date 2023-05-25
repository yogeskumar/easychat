const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const CHAT_ENGINE_PROJECT_ID = process.env.CHAT_ENGINE_PROJECT_ID;
const CHAT_ENGINE_PRIVATE_KEY = process.env.CHAT_ENGINE_PRIVATE_KEY;

app.post("/signup", async (req, res) => {
    console.log(req.body.username)
    const { username, secret, email, first_name, last_name } = req.body;

    // Store a user-copy on Chat Engine!
    // Docs at rest.chatengine.io
    try {
        const r = await axios.post(
            "https://api.chatengine.io/users/",
            { username, secret, email, first_name, last_name },
            { headers: { "Private-Key": CHAT_ENGINE_PRIVATE_KEY } }
        );
        return res.status(r.status).json(r.data);
    } catch (e) {
        return res.status(e.response.status).json(e.response.data);
    }
});

app.post("/login", async (req, res) => {
    const { username, secret } = req.body;
    console.log(username)
    // Fetch this user from Chat Engine in this project!
    // Docs at rest.chatengine.io
    try {
        const r = await axios.get("https://api.chatengine.io/users/me/", {
            headers: {
                "Project-ID": CHAT_ENGINE_PROJECT_ID,
                "User-Name": username,
                "User-Secret": secret,
            },
        });
        return res.status(r.status).json(r.data);
    } catch (e) {
        return res.status(e.response.status).json(e.response.data);
    }
});

// vvv On port 3001!
app.listen(3001, () => {
    // console.log("Project id->", CHAT_ENGINE_PROJECT_ID)
    // console.log("Private key->", CHAT_ENGINE_PRIVATE_KEY)
    console.log("listening on port 3001")
});
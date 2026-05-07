const router = require("express").Router();
const Message = require("../models/Message");

// Get all messages between 2 users
router.get("/:sender/:receiver", async (req, res) => {
    const messages = await Message.find({
        $or: [
            { sender: req.params.sender, receiver: req.params.receiver },
            { sender: req.params.receiver, receiver: req.params.sender }
        ]
    });

    res.json(messages);
});

module.exports = router;
const router = require('express').Router();
const { isObjectIdOrHexString } = require('mongoose');
const Room = require('../models/roomModels');

router.get('/rooms', async (req, res) => {
    
   await Room.find({})
    .then((rooms) => res.json(rooms))
    .catch(err => res.status(400).json('Error: '+err));
});

router.delete('/rooms/:id', async (req, res) => {
    await Room.findByIdAndDelete(req.params.id)
    .then(() => res.json("User is deleted"))
    .catch(err => res.status(400).json('Error: ' +err))
});

module.exports=router;

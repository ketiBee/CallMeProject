const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true

    },
    userId: {
        type: String,
        required: true,
        
    }
})

module.exports=mongoose.model('Room', roomSchema);
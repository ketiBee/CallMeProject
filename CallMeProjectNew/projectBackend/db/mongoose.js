const mongoose = require("mongoose");

const dbUrl = "mongodb+srv://keti_bee:4ITgfMU3qCxdfyLo@cluster0.6wsio.mongodb.net/callMeProject"


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
}).catch(error => {
    console.log("Unable to connect to database ", error);
})
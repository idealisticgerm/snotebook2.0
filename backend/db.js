const mongoose  =  require('mongoose');

const MONGO_URL = "mongodb+srv://siddheshkaskar5678:idealistic789@cluster1.bowz6ps.mongodb.net/notes?retryWrites=true&w=majority";

const connectToMongo = async ()=>{
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Connected to Mongo");
    } catch (error) {
        console.log("Connection Error");
        console.log(error);
    }
}

module.exports = connectToMongo;
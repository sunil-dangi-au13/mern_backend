const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/sunil'
const dbConnect = async()=>{
    try {await mongoose.connect(mongoURI,
        {
            useNewUrlParser: true,
            //useFindAndModify: false,
            useUnifiedTopology: true
          })
        console.log('MongoDB connected Sucessfully');
        
    } catch (error) {
       console.log('Not connected'); 
    }
    
    
}

module.exports = dbConnect;
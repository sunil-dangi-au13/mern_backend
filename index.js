const dbConnect = require('./db');
const express = require('express');
const cors = require('cors')
dbConnect();
const app = express();
const port =  process.env.port ||3000;
app.use(express.json());
app.use(cors());

// app.get('/', (req,res)=>{
// res.send("Welcome to Node")
// })

//routes------//
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

const Note = require('./models/Note');
 
// Note.find( )
//  .populate({
//     path: "userid.notes",
//     populate:{
//         path: "notes"
//     }
//  })
//  .then(user => console.log(user))
//  .catch(error => console.log(error))


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})


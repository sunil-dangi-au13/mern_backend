const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middlewares/fetchuser');
const{body,validationResult} = require('express-validator');

// Route No----- 1    Add a new Note:-- Post method----- api/notes/addnote--------//

router.post('/addnote',fetchuser,[
    body('title','Enter a title name').isLength({min:3}),
    body('description','Description atleast 5 character').isLength({min:5}),
],
async(req,res)=>{
    try {
        const{title,description,tag}= req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()})
    }
     // check Notes with alredy exist same title----->>>>>//

     let noteval = await Note.findOne({ title: req.body.title });
         if (noteval) {
            return res.status(400).json({ error: 'Note is already exist with this title' })
         }
    //const userid = req.user
    // console.log("userid",req.user);
    
    const note = new Note({title,description,tag,userid: req.user})
    //console.log(note);
    const savednote = await note.save()
    res.json(savednote)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send(' Internal server error')
    }
    
}
)

// Route No----- 2    Get All Notes:-- Get method----- api/notes/fetchnote--------//

router.get('/fetchnote',fetchuser,
async(req,res)=>{
    const userid = req.user
     
    console.log('userid',userid);
    //console.log('id', req.user);
    try {
        const notes = await Note.find({userid})
        // const notes = await Note.findOne({userId})
        // console.log(notes)
        // if(notes.length !== 0){
        //     console.log("array is not empty");
        // }
        // else{console.log('its empty');}
      
        // console.log(notes,'---->>>');
        res.json(notes)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send(' Internal server error')
    }
}
)


// Route No-----3   Update Note by Id :-- Put method----- api/notes/updatenote/:id--------//

router.put('/updatenote/:id', fetchuser,
async(req,res)=>{
    const{title,description,tag}= req.body;
    //Create a new note object------//
    const newnote = {};
    if(title){newnote.title = title}
    if(description){newnote.description = description}
    if(tag){newnote.tag = tag}

    //find the note and update it----->>>>//
    
    //const userid = req.user
    const note = await Note.findById(req.params.id);
    console.log(note,'----->>>>>');
    // console.log('note-user-id', note.userid.toString())
    // console.log('req-user-id', req.user)
    if(!note){return res.status(404).send("not found")}
    if(note?.userid?.toString()!== req?.user){return res.status(401).send("Acess denied")}

    const updatenote = await Note.findByIdAndUpdate(req.params.id, {$set:newnote},{new:true});
    console.log(updatenote,'----->>>>');
    res.json({updatenote});

}
)


// Route No-----4    Delete Note by Id :-- Delete method----- api/notes/deletenote/:id--------//

router.delete('/deletenote/:id', fetchuser,
async(req,res)=>{
    const{title,description,tag}= req.body;

    //find the note and Delete it----->>>>//
    const note = await Note.findById(req.params.id);
    //console.log(note,'----->>>>>');
    if(!note){return res.status(404).send("not found")}
    //if(note.user.toString()!== req.user.id){return res.status(401).send("Acess denied")}

    const deletenote = await Note.findByIdAndDelete(req.params.id);
    //console.log(updatenote,'----->>>>');
    res.json({"Sucess":"Note deleted Sucessfully"});

}
)



module.exports = router;
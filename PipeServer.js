
const express = require('express');
const mongoose = require('mongoose');
const monk = require('monk');
const cors = require('cors');



const io = require('socket.io')(4000, {
    cors: {
        origin: ['http://3.110.153.246:3000'],
    }
})


const app = express();
const port = process.env.PORT || 9000;
const StatusMessage = {
    SignUpStatus: "S",
    LoginStatus: "L",
}
app.use(express.json()); 
app.use(cors());

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("send-message", (message,room) => {
        console.clear();
         console.log(message);
         console.log(room);
         console.log(LoginDetails);
        //  socket.broadcast.emit('received-message', message)
         socket.to(room).emit('received-message', message);
         
    })

    socket.on("PipeInfo", (PipeName) => {
        console.clear()
        console.log(PipeName);
        let DbPipeName = monk('localhost:27017/PipeName')
        let CollectionPipeName = DbPipeName.get("PipeInfo")
        if(PipeName != null){
          
            CollectionPipeName.insert({Name: PipeName})
            
        }
        CollectionPipeName.find().then((doc) => {
            console.log(".............")
            console.log(doc.Name);
            
            socket.emit("PipeList", doc);

            
            
        })
    })
    socket.on("DeleteID", (doc) => {
        console.log(doc)
        let DbPipeName = monk('localhost:27017/PipeName')
        let CollectionPipeName = DbPipeName.get("PipeInfo")

        CollectionPipeName.remove({_id: doc})
        socket.emit("Reload", {})
        

    })

    socket.on("DeleteTime", (Time) => {
        console.clear()
        console.log(Time);
        
        // mongoose.connect('mongodb://localhost/CurrentTime', {useNewUrlParser: true, useUnifiedTopology: true});
        // let db = mongoose.connection;


        // db.dropDatabase();
        let DbCurrentTime = monk('localhost:27017/CurrentTime')
        let CollectionTime = DbCurrentTime.get("PresentTime")

        CollectionTime.remove({Name: "ANMOL"})
        
        
        
        // setTimeout(() => {
        //     CollectionTime.find().then((TimeDoc) => {
        //         console.log(".....Time From Database.......")
        //         console.log(TimeDoc);
        //         socket.emit("CurrentTime2", TimeDoc)
    
        //     })
        // }, 3000);


    })

    socket.on("StoreTime", (StoreTime) => {
        console.log(".......StoreTime......")
        let DbCurrentTime = monk('localhost:27017/CurrentTime')
        let CollectionTime = DbCurrentTime.get("PresentTime")
        if(StoreTime.Name == "ANMOL"){
            CollectionTime.remove({Name: "ANMOL"})
        }
        console.log(StoreTime);
        if(StoreTime.Name != "ANMOL2"){
            
            CollectionTime.insert(StoreTime)
        }
        CollectionTime.find().then((GetOldStoreTime) => {

            socket.emit("GetStoreTime", GetOldStoreTime )
            
        })
        // socket.emit("GetStoreTime", [StoreTime] )


    })

   

    
})



app.get("/", (req,res) => {
    res.status(200).send("forever start Server.js");
    
})

app.get('/Restart', function (req, res, next) {
    res.status(200).send("Restart Again");
});

app.listen(port, () => {
    console.log(`Listening on localhost: ${port}`);
})




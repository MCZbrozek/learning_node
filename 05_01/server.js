var express = require('express')
var bodyParser = require('body-parser')
const { Socket } = require('socket.io')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl = 'mongodb+srv://mike:learning-node@learning-node.zbscq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
    
})

app.post('/messages', async (req, res) => {
    var message = new Message(req.body)

    var savedMessage = await message.save()
    
    console.log('saved')
    
    var censored = await Message.findOne({message: 'badword'})
            
        if (censored) 
        // Message.remove() was deprecated, replaced with deleteOne
            await Message.deleteOne({_id: censored.id})
        else
            io.emit('message', req.body)

        res.sendStatus(200)
    })
    // .catch((err) =>{
    //     res.sendStatus(500)
    //     return console.error(err)
    // })



io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port)
})



// psuedo code challenge - Convert to async/await

// MyFunction() {
//     GetMessages((list) => {
//         console.log(list)
//     })
// }

// add async to the front of the function, create a variable called list that gives us the result of GetMessage
// and console the resulting 'list' variable into the console. 

// async MyFunction () {
//     let list = await GetMessage()
//     console.log(list)
// }
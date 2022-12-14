import express, { text } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

let todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    classid: String,
    date: { type: Date, default: Date.now },

});

let todomodel = mongoose.model('todos', todoSchema);

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(cors());


app.post('/todo', (req, res) => {



    console.log("body", req.body.text)
    todomodel.create({ text: req.body.text }, (err, saved) => {

        console.log("create ", saved)

        if (!err) {
            res.send({
                message: "your todo is saved",
            })
        } else {
            res.status(500).send({
                message: "server error",
            })
        }
    })
});
app.get('/todos', (req, res) => {

    todomodel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "here is your todo",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error",
            })
        }
    })
});
app.put('/todo/:id', async (req, res) => {
    try {
        let data = await todomodel
            .findByIdAndUpdate(
                req.params.id,
                { text: req.body.text },
                { new: true }
            )
            .exec();
        console.log('update: ', data);
        res.send({
            message: " todo is updated successfully",
            data: data

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "server error"
        })
    }
});

app.delete('/todos', async (req, res) => {
    try {

        let data = await todomodel.deleteMany({})

        res.send({
            message: "your all todos is delete successfully",
            data: data

        })



    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
});
app.delete('/todo/:id', (req, res) => {

    todomodel.deleteOne({ _id: req.params.id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Todo has been deleted successfully",
                })
            } else {
                res.send({
                    message: "No todo found with this id: " + req.params.id,
                })
            }


        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

app.listen(port, () => {
    console.log(`server app is listening on port ${port}`);
});


/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://malik:umermalik120@cluster0.3agpx4r.mongodb.net/malikdatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
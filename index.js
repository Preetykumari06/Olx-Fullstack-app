const express = require('express');
const cors = require('cors')
const { connection } = require('./Config/db');
const { userRouter } = require('./Routes/user.route');
const { productRouter } = require('./Routes/product.route');


const app = express()

const PORT = process.env.PORT || 3030;

app.use(express.json())

app.use(cors())

app.use("/",userRouter)
app.use("/",productRouter)


app.get("/", (req,res) => {
    res.send("Welcome to OLX Backend...")
});

app.listen(PORT, async () => {
    try {
        await connection
        console.log('DB connected');
    } catch (error) {
        console.log(error);
    }
    console.log('server is runnning on port ',PORT);
})
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; 


const app = express()
app.use(express.json())
app.use(cors())
const port = 3000



const blogSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: { type: String, required: true, default: "user" }
});


const productModel = mongoose.model('users12', blogSchema)


app.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization
        var decoded = jwt.verify(token, 'murad');
        console.log(decoded);
        if (decoded.role === "Admin") {
            const users = await productModel.find({})
            return res.send(users)
        }
        res.status(401).json("dont permission")

    } catch (error) {
        res.status(403).json("Token is not valid")

    }
})


app.post('/register', async (req, res) => {
    const { email, password } = req.body
    const user = new productModel({ email: email, password: password })
    await user.save()
    res.send(user)
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await productModel.findOne({ email })

    if (!user) {
        return res.status(404).json("user no")
    }
    if (user.password !== password) {
        return res.status(404).json("")

    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'murad');
    return res.status(200).json({ token })

})



mongoose.connect('mongodb+srv://bd7xw445u:bd7xw445u@cluster0.98bgcim.mongodb.net/')
    .then(() => {
        console.log('Connected...!');
    })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
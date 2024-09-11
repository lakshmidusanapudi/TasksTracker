const express=require('express')
const cors=require('cors')
require('dotenv').config()
const app=express()
const tasks=require('./Routes/Tasks')
const projects=require('./Routes/Projects')
app.use(express.json())
app.use(cors({ origin: '*' }));
app.use('/task',tasks)
app.use('/projects',projects)

app.listen(7000,()=>{
    console.log("Process running on port",7000)
})
const express = require('express');
const router = express.Router();
const connection = require('../db');
const createQueries = require('../queries/post.json');
const getQueries = require('../queries/get.json');

router.post('/addProject', async (req, res) => {
    const {Project_Name} = req.body;
    if (!Project_Name) {
        return res.status(400).send({ error: "Project Name is required" });
    }
    try {     
        await connection.query(createQueries.CreateProjectsTable);
        const [rows] = await connection.query(getQueries.ProjectIdQuery);

        
        let newProjectId = "PID001";


        if (rows.length > 0) {
            const latestProjectId = rows[0].Project_ID;
            const currentIdNumber = parseInt(latestProjectId.slice(-3),6);
            const newIdNumber = currentIdNumber + 1;
            newProjectId = `PID${String(newIdNumber).padStart(3, '0')}`;
        }
        await connection.query(createQueries.AddProject, [
            newProjectId,Project_Name
            
        ]);

        res.status(201).send({ message:"Project added sucessfully" });
    } catch (err) {
        console.log("Error in register:", err.stack);
        res.status(500).send({ error: "Internal server error." });
    }
});

router.get('/getProjects',async (req,res)=>{
    try {
        const [results] = await connection.query(getQueries.getProjects);
        res.status(200).send(results);
    } catch (err) {
        console.error('Error retrieving tasks:', err.stack);
        res.status(500).send({ error: "Internal server error." });
    }
});

router.get('/getProjects/:name',async (req,res)=>{
    const {name} = req.params;
    try {
        const [results] = await connection.query(getQueries.getProjectsByName,[name]);
        res.status(200).send(results);
    } catch (err) {
        console.error('Error retrieving tasks:', err.stack);
        res.status(500).send({ error: "Internal server error." });
    }
});



module.exports=router;
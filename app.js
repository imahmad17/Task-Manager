//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const cors = require('cors');
const app = express();
app.use(express.json()) ;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
    origin: "*",
    methods: 'GET, POST,PUT,DELETE',
    credentials: true, 
  }));


const tasks = [{
    id : "1",
    title:"task1",
    flag:false
},{
    id : "2",
    title:"task2",
    flag:false
},{
    id : "3",
    title:"task3",
    flag:false
},{
    id : "4",
    title:"task4",
    flag:false
}];

app.get("/", (req, res) => {
    res.send(tasks);
});

app.post("/", (req, res) => {
    const {id,title,flag} = req.body;
   
    if (id && title) {
        tasks.push({ id, title, flag });
        res.status(201).send("Task added successfully");
    } else {
        res.status(400).send("Invalid task data");
    }
});

app.get("/filter", (req, res) => {
   const {flag} = req.body ;
    if (flag === 'true' || flag === 'false') {
        const filteredTasks = tasks.filter(task => task.flag === (flag === 'true')); // Filter tasks based on flag value
        res.send(filteredTasks);
    } else {
        res.status(400).send("Invalid flag value. Please provide 'true' or 'false'.");
    }
});

app.put("/:taskId", (req, res) => {
    const taskId = req.params.taskId;
    const { flag } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].flag = flag;
        res.status(200).send("Task status updated successfully");
    } else {
        res.status(404).send("Task not found");
    }
});
app.get("/filter/:status", (req, res) => {
    const status = req.params.status.toLowerCase();
    let filteredTasks;
    if (status === 'all') {
        filteredTasks = tasks;
    } else if (status === 'completed') {
        filteredTasks = tasks.filter(task => task.flag === true);
    } else if (status === 'incomplete') {
        filteredTasks = tasks.filter(task => task.flag === false);
    } else {
        return res.status(400).send("Invalid status");
    }
    res.send(filteredTasks);
});











app.listen(3000, function () {
    console.log("Server started on port 3000.");
});

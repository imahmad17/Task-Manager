import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import "./home.css"
const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            id: uuidv4(),
            title: newTaskTitle,
            flag: false
        };
        try {
            await axios.post('http://localhost:3000/', formData);
            setNewTaskTitle(''); 
            fetchData(); 
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };
    const fetchFilteredTasks = async (filter) => {
        try {
            const response = await axios.get(`http://localhost:3000/filter/${filter}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching filtered tasks:', error);
        }
    };
    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        if (selectedFilter !== '') {
            fetchFilteredTasks(selectedFilter);
        } else {
            fetchData(); 
        }
    };

    const toggleTaskCompletion = async (taskId, currentFlag) => {
        try {
            const updatedTasks = tasks.map(task => {
                if (task.id === taskId) {
                    task.flag = !currentFlag;
                }
                return task;
            });
            setTasks(updatedTasks);
            // Update task flag in the backend
            await axios.put(`http://localhost:3000/${taskId}`, { flag: !currentFlag });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div class="task-container">
        <div class="tasks-table">
            <h2>Tasks</h2>
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index}>
                            <td>
                                <label style={{ textDecoration: task.flag ? 'line-through' : 'none' }}>
                                    <input
                                        type="checkbox"
                                        checked={task.flag}
                                        onChange={() => toggleTaskCompletion(task.id, task.flag)}
                                    />
                                    {task.title}
                                </label>
                            </td>
                            <td>{task.flag ? 'Completed' : 'Incomplete'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div class="add-task">
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Task Title:
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                </label>
                <button type="submit" className='add-button'>Add Task</button>
            </form>
        </div>
        <div class="filter-box">
            <h2>Filter</h2>
            <select onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
            </select>
        </div>
    </div>
    
    );
};

export default Home;

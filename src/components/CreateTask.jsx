/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

const CreateTask = ({ tasks, setTasks }) => {
    const [task, setTask] = useState({
        id: "",
        name: "",
        status: "todo",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (task.name.length < 3) return toast.error('A task must have more than 3 characters');

        if (task.name.length > 100) return toast.error('A task must not have more than 100 characters');

        setTasks((prev) => {
            const List = [...prev, task];

            localStorage.setItem("tasks", JSON.stringify(List));

            return List;
        });

        toast.success("Task created");

        setTask({
            id: "",
            name: "",
            status: "todo",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center ">
            <input
                type="text"
                className="border-2 border-slate-400 bg-slate-100 rounded-md h-12 w-64 px-1"
                value={task.name}
                onChange={(e) => setTask({ ...task, id: uuidv4(), name: e.target.value })}
                placeholder="Enter task"
            />
            <button className="bg-orange-500 rounded-md px-4 h-12 text-white ml-2">
                Create
            </button>
        </form>
    );
};

export default CreateTask;

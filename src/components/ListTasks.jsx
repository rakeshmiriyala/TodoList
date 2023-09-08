/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import { useEffect } from "react";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-hot-toast";

const  ListTasks = ({tasks,setTasks}) => {

    const[todos,setTodos]=useState([]);
    const[doings,setDoings]=useState([]);
    const[dones,setDones]=useState([]);

    const statuses = ['todo','doing','done'];


    useEffect(() => {
        if(tasks) {
        const fTodos = tasks.filter(task => task.status === "todo");
        const fDoings = tasks.filter(task => task.status === "doing");
        const fDones = tasks.filter(task => task.status === "done");

        setTodos(fTodos);
        setDoings(fDoings);
        setDones(fDones);
        }

    },[tasks]);


    return (
        <div className="flex flex-col md:flex-row gap-16">
        {statuses.map((status,index) =>(
            <Section 
                key={index} 
                status={status} 
                tasks ={tasks} 
                setTasks= {setTasks} 
                todos={todos} 
                doings={doings} 
                dones={dones} 
            />
        ))}
    </div> 
    );
};
 
export default ListTasks;


const Section = ({status, tasks,setTasks,todos,doings,dones }) =>{

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop:(item) => addItemToSection(item.id),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }));

    let text = "Todo";
    let bg = "bg-slate-500";
    let tasksToMap = todos

    if(status==="doing"){
        text = "Doing"
        bg = "bg-purple-500"
        tasksToMap = doings 
    }

    if(status==="done"){
        text = "Done"
        bg = "bg-green-500"
        tasksToMap = dones
    }

    const addItemToSection =(id) =>{
        setTasks(prev => {
            const mtasks = prev.map(t =>{
                if(t.id===id){
                    return {...t, status:status}
                }
                return t
            });

            localStorage.setItem("tasks",JSON.stringify(mtasks))

            toast("Task status changed",{icon:"😃"});

            return mtasks;
        });
    };


    return (
    <div ref={drop} className={`w-64 rounded-md p-2   ${isOver ?"bg-slate-200":"" }`}>
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {tasksToMap.length > 0 && tasksToMap.map(task => 
      <Task key = {task.id} task={task} tasks={tasks} setTasks = {setTasks}/>
      )}
    </div>
    );
};

const Header = ({ text , bg , count }) =>{
    return (
    <div className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-white`}>
        {text} 
        <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
            {count}
        </div>
    </div>
    );
};

const Task = ({ task,tasks,setTasks }) =>{

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item:{id:task.id},
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        }),
      }));

      console.log(isDragging)
    const handleRemove = (id) =>{
        console.log(id);
        const fTasks = tasks.filter(t=> t.id !== id)

        localStorage.setItem("tasks",JSON.stringify(fTasks));

        setTasks(fTasks)

        toast("Task removed", {icon:"💀"})
    };


    return (
        <div 
        ref={drag} 
        className={`relative p-4 mt-8 shadow-md rounded-md ${
            isDragging ? "opacity-25":"opacity-100" }cursor-grab`}>
            <p>{task.name}</p>
            <button className="absolute bottom-1 right-1 text-slate-400" onClick={()=> handleRemove(task.id)}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor" 
                class="w-6 h-6"
                >
                <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            </button>
        </div>
    );
};
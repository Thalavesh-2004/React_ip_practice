import {useState,useEffect} from "react";
import axios from "axios";
 import {useNavigate} from "react-router-dom";


function Login(){
    const [form,setForm]=useState({username:"",password:""}); 
    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }
    const navigate=useNavigate();
    const handleSubmit=()=>{
        
        axios.post("http://localhost:3001/login",form)
        .then(res=>{
            if(res.data.success===true){window.alert("login success..!");navigate("/exam");
                }
            else
            window.alert("Invalid login credentials!");
        })
    }   
    return (
        
        <div>
            <h2>=Online Exam System LoginPage=</h2>
            Username: <input type="text" name="username" placeholder=" enter username" onChange={(e)=>handleChange(e)}/> <br /> <br />
            Password: <input type="password" name="password" placeholder="Enter Password" onChange={(e)=>handleChange(e)}/> <br /><br />
            <button onClick={handleSubmit}>login</button>
        </div>

    );
    
}

export default Login;
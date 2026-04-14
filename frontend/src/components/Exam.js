import {useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";



function Exam(){
    
//array containing qn objs
    const [questions,setQuestions]=useState([])
    const [answers,setAnswers]=useState([])
    const [current,setCurrent]=useState(0)
    const navigate=useNavigate();
    const [loading, setLoading] = useState(true); 
    //bringing qns from db to questions array
    useEffect(()=>{
          axios.get("http://localhost:3001/questions")
    .then(res=>{
        setQuestions(res.data);
        setLoading(false);
    });
    },[])
  

    const handleOption=(option)=>{
        const temp=[...answers]
        temp[current]=option
        setAnswers(temp);
        console.log("Answers so far:", temp);
    }

    const handleSubmit=()=>{
        axios.post("http://localhost:3001/answers",{answers})
        .then(res=>{
            navigate("/result",{state:res.data})
        })
    }

        if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>
            <h3>Loading questions...</h3>
        </div>;
    }


    const q=questions[current];
    
    return (
        <div>
    
            <p>Question No: {current}</p>
            <p>{q.question}</p>
            {
                [q.option1,q.option2,q.option3,q.option4].map((option,idx)=>{return(
                    <p>
                        <label>{option}:</label>
 <input type="radio" onChange={()=>handleOption(option)}  checked={answers[current]===option}/>
                    </p>
                   
                );
                    
                })
            }
            <br />
           {current>0 && <button onClick={()=>setCurrent(current-1)}>Prev</button>}
           <br />
           {current<(questions.length-1) && <button onClick={()=>setCurrent(current+1)}>Next</button>}
           <br />
           {current==(questions.length-1)&& <button onClick={handleSubmit}>Submit Test</button>}
        </div>
    )
}

export default Exam;
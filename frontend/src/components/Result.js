import {useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
function Result(){
    const navigate=useNavigate();
    const {state}=useLocation();
    return(
        <div>
            <h2>Results for test!</h2>
            <p>Score=={state.score}</p>
            <p>Total qns=={state.total}</p>
            <p>Percentage=={state.score/state.total*100}</p>
            <p>Analysis</p>
            <div>
             {state.analysis.map((ele,idx)=>
                (
                    <ul key={idx}>
                        <li>Q No:{ele.qno}</li>
                        <li>Question:{ele.qn}</li>
                        <li>Your Answer:{ele.uranswer}</li>
                        <li>Correct Answer:{ele.crtanswer}</li>
                    <br />
                    </ul>
                    
                ))
            }
            </div>
           
            <br />
            <button onClick={()=>navigate("/")}>Logout</button>
            
        </div>
    );
}
export default Result;
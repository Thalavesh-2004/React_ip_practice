import {useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
function Result(){

    const {state}=useLocation();
    return(
        <div>
            <h2>Results for test!</h2>
            <p>Score:{state.score}</p>
            <p>Total qns:{state.total}</p>
            <p>Percentage:{state.score/state.total*100}</p>
        </div>
    );
}
export default Result;
import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import Exam from './components/Exam'
import Result from './components/Result'
import {BrowserRouter,Routes,Route} from "react-router-dom";
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/exam" element={<Exam/>}></Route>
        <Route path="/result" element={<Result/>}></Route>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

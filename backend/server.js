const express=require("express")
const mysql=require("mysql2")
const cors=require("cors")
require('dotenv').config();

const app=express();
app.use(cors())
app.use(express.json())

//connect to db

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 15972,
    ssl: {
        rejectUnauthorized: false//if i put true certificate error  
        // REQUIRED for Aiven MySQL!
    }
})
db.connect((err)=>{
    if(err)console.log("Erorr in db connection: "+err)
    else
    console.log("Connected to DB..!")
})

//login
app.get('/', (req, res) => {
    res.send('Backend is running! 🚀');
});

app.post("/login",(req,res)=>{
    const {username,password}=req.body;
    const sql="select * from users where username=? and password=?";
    db.query(sql,[username,password],(err,result)=>{
        if(err)return res.json(err)
        else{
            if(result.length>0)return res.json({success:true})
                return res.json({success:false})
        }
    })
});


//get qns
app.get("/questions",(req,res)=>{
    db.query("select * from questions",(err,result)=>{
        if(err)return res.json(err)
        return res.json(result);
    })
});

//submit answers

app.post("/answers",(req,res)=>{
    let wrongans=[];
    const {answers}=req.body;
    db.query("select * from questions",(err,result)=>
    {
        if(err)return res.json(err);
        let score=0;
        console.log(result);
        answers.forEach((ele,idx)=>{
            if(ele==result[idx].answer)score++;
            else{
                let qno=idx;
                let qn=result[idx].question;
                let uranswer=ele;
                let crtanswer=result[idx].answer;
                wrongans.push({qno,uranswer,crtanswer,qn});
            }
        });

        return res.json({score:score,total:result.length,analysis:wrongans});
        
    })
})

app.listen(3001,()=>console.log("Backend running on PORT 3001..."));
const express=require("express")
const mysql=require("mysql2")
const cors=require("cors")

const app=express();
app.use(cors())
app.use(express.json())

//connect to db

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root123",
    database:"exam_db"
})

db.connect((err)=>{
    if(err)console.log("Erorr in db connection: "+err)
    else
    console.log("Connected to DB..!")
})

//login

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
    const {answers}=req.body;
    db.query("select answer from questions",(err,result)=>
    {
        if(err)return res.json(err);
        let score=0;
        console.log(result);
        answers.forEach((ele,idx)=>{
            if(ele==result[idx].answer)score++;
        });

        return res.json({score:score,total:result.length});
        
    })
})

app.listen(3001,()=>console.log("Backend running on PORT 3001..."));
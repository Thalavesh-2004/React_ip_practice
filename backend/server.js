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

// TEMPORARY: Run this once to create tables (remove after)
app.get('/setup', (req, res) => {
    const createUsers = `CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20),
        password VARCHAR(20)
    )`;
    
    const createQuestions = `CREATE TABLE IF NOT EXISTS questions (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        question TEXT,
        option1 VARCHAR(255),
        option2 VARCHAR(255),
        option3 VARCHAR(255),
        option4 VARCHAR(255),
        answer VARCHAR(255)
    )`;
    
    db.query(createUsers, (err) => {
        if (err) return res.json({ error: 'Users table error', details: err });
        
        db.query(createQuestions, (err2) => {
            if (err2) return res.json({ error: 'Questions table error', details: err2 });
            
            // Insert sample data
            const insertUsers = `INSERT IGNORE INTO users (username, password) VALUES 
                ('admin', 'admin123'), ('testuser', 'test123')`;
            
            const insertQuestions = `INSERT IGNORE INTO questions (question, option1, option2, option3, option4, answer) VALUES 
                ('What is 2+2?', '3', '4', '5', '6', '4'),
                ('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'Paris')`;
            
            db.query(insertUsers, () => {});
            db.query(insertQuestions, () => {});
            
            res.json({ message: 'Tables created successfully!' });
        });
    });
});

// TEMPORARY ENDPOINT - Remove after running once
app.get('/add-questions', (req, res) => {
    const questions = [
        ['Which river flows through Trichy?', 'Kaveri', 'Vaigai', 'Tamiraparani', 'Cauvery', 'Kaveri'],
        ['What is the famous rock-cut temple in Trichy called?', 'Brihadeeswarar Temple', 'Rockfort Temple', 'Meenakshi Temple', 'Ramanathaswamy Temple', 'Rockfort Temple'],
        ['Which dynasty is credited with building the Rockfort Temple in Trichy?', 'Pallava', 'Chola', 'Pandya', 'Nayak', 'Nayak'],
        ['Trichy is located on the banks of which river?', 'Kaveri River', 'Vaigai River', 'Godavari River', 'Krishna River', 'Kaveri River'],
        ['What is the famous temple dedicated to Lord Shiva in Trichy known as?', 'Jambukeswarar Temple', 'Srirangam Temple', 'Vekkali Amman Temple', 'Samanar Hills', 'Jambukeswarar Temple'],
        ['Which world-famous temple is located on an island in Trichy?', 'Rockfort Temple', 'Srirangam Ranganathaswamy Temple', 'Vekkali Amman Temple', 'Erumbeeswarar Temple', 'Srirangam Ranganathaswamy Temple'],
        ['Srirangam Temple is dedicated to which deity?', 'Lord Shiva', 'Lord Vishnu', 'Lord Brahma', 'Lord Murugan', 'Lord Vishnu'],
        ['What is the name of the hillock in Trichy that has Jain caves and carvings?', 'Golden Rock', 'Samanar Hills', 'Vayalur Hill', 'Uyyakondan Hill', 'Samanar Hills'],
        ['Which famous dam is located near Trichy?', 'Mettur Dam', 'Kallanai Dam', 'Bhavanisagar Dam', 'Vaigai Dam', 'Kallanai Dam'],
        ['Kallanai Dam was built by which Chola king?', 'Raja Raja Chola I', 'Rajendra Chola I', 'Karikala Chola', 'Sundara Chola', 'Karikala Chola']
    ];

    const sql = `INSERT INTO questions (question, option1, option2, option3, option4, answer) VALUES ?`;
    
    db.query(sql, [questions], (err, result) => {
        if (err) {
            console.error('Error inserting questions:', err);
            return res.json({ error: err.message });
        }
        res.json({ 
            success: true, 
            message: `Added ${result.affectedRows} questions to database!`,
            count: result.affectedRows
        });
    });
});
// TEMPORARY ENDPOINT - Add users to database
app.get('/add-users', (req, res) => {
    const users = [
        ['user', 'user123'],
        ['uday', 'uday123'],
        ['satta', 'satta123'],
        ['priya', 'priya123'],
        ['admin', 'admin123'],
        ['testuser', 'test123']
    ];

    const sql = `INSERT IGNORE INTO users (username, password) VALUES ?`;
    
    db.query(sql, [users], (err, result) => {
        if (err) {
            console.error('Error inserting users:', err);
            return res.json({ error: err.message });
        }
        res.json({ 
            success: true, 
            message: `Added ${result.affectedRows} users to database!`,
            count: result.affectedRows
        });
    });
});
app.listen(3001,()=>console.log("Backend running on PORT 3001..."));
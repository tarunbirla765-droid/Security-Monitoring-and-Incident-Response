
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "soc-secret",
  resave: false,
  saveUninitialized: true
}));

/* ================= DATABASE ================= */

const db = new sqlite3.Database("soc.db");

db.run(`CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 username TEXT UNIQUE,
 password TEXT,
 role TEXT DEFAULT 'user'
)`);

db.run(`CREATE TABLE IF NOT EXISTS logs(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 username TEXT,
 action TEXT,
 ip TEXT,
 time TEXT,
 severity TEXT,
 status TEXT
)`);

/* ================= LOG FUNCTION ================= */

function addLog(username, action, req, severity="LOW", status="Investigating"){
 const ip=req.ip;
 const time=new Date().toLocaleString();
 db.run("INSERT INTO logs(username,action,ip,time,severity,status) VALUES(?,?,?,?,?,?)",
 [username,action,ip,time,severity,status]);
}

/* ================= GLOBAL STYLE ================= */

const style = `
<style>
body{
 font-family:Segoe UI;
 background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);
 color:white;
 margin:0;
}
.center{display:flex;justify-content:center;align-items:center;height:100vh;}
.card{
 background:#0b0f19;
 padding:40px;
 border-radius:18px;
 width:420px;
 text-align:center;
 box-shadow:0 0 40px #00eaff40;
}
input{
 width:90%;padding:12px;margin:10px;border:none;border-radius:8px;
}
.btn{
 display:block;margin:15px auto;padding:12px;width:220px;border-radius:10px;
 background:#00eaff;color:black;text-decoration:none;font-weight:bold;
}
.btn-red{background:#ff4b5c;color:white;}
table{width:100%;border-collapse:collapse;background:#0b0f19;}
th,td{padding:12px;border-bottom:1px solid #333;text-align:center;}
th{background:#111}
</style>`;

/* ================= HOME ================= */

app.get("/",(req,res)=>{
res.send(style+`
<div class="center">
 <div class="card">
 <h1>Security Monitoring System</h1>
 <a class="btn" href="/signup">Signup</a>
 <a class="btn" href="/login">Login</a>
 </div>
</div>`);
});

/* ================= SIGNUP ================= */

app.get("/signup",(req,res)=>{
res.send(style+`
<div class="center">
 <div class="card">
 <h2>Create Account</h2>
 <form method="POST">
 <input name="username" placeholder="Username" required>
 <input type="password" name="password" placeholder="Password" required>
 <button class="btn">Signup</button>
 </form>
 </div>
</div>`);
});

app.post("/signup", async(req,res)=>{
const hash=await bcrypt.hash(req.body.password,10);
db.run("INSERT INTO users(username,password) VALUES(?,?)",
[req.body.username,hash],()=>res.redirect("/login"));
});

/* ================= LOGIN ================= */

app.get("/login",(req,res)=>{

let popupScript = "";

if(req.session.alert){
   popupScript = `<script>alert("${req.session.alert}")</script>`;
   req.session.alert = null; // show only once
}

res.send(style+`
${popupScript}
<div class="center">
 <div class="card">
 <h2>Login</h2>
 <form method="POST">
 <input name="username" required>
 <input type="password" name="password" required>
 <button class="btn">Login</button>
 </form>
 </div>
</div>`);
});



app.post("/login",(req,res)=>{

const username = req.body.username;

db.get("SELECT * FROM users WHERE username=?",[username],async(err,user)=>{

// User not found = suspicious
if(!user){
 addLog(username,"Login with non-existing user",req,"MEDIUM","Open");
 return res.send("User not found");
}

const passwordMatch = await bcrypt.compare(req.body.password,user.password);

if(passwordMatch){
 req.session.user=user;
 addLog(username,"Successful Login",req,"LOW","Closed");
 return res.redirect("/dashboard");
}

/* ❌ FAILED LOGIN DETECTED */

addLog(username,"Failed Login Attempt",req,"HIGH","Open");

/* 🔎 CHECK LAST FAILED ATTEMPTS */

db.all(`
SELECT * FROM logs 
WHERE username=? AND action='Failed Login Attempt'
ORDER BY id DESC LIMIT 3
`,[username],(err,rows)=>{

 if(rows.length === 3){
   addLog(username,"🚨 BRUTE FORCE ATTACK DETECTED",req,"CRITICAL","Open");
   req.session.alert = "🚨 SECURITY ALERT: Multiple failed login attempts detected!";
}


return res.redirect("/login");

});


});
});


/* ================= DASHBOARD ================= */

app.get("/dashboard",(req,res)=>{
 if(!req.session.user) return res.redirect("/login");
 const u=req.session.user;

 const adminBtn = u.role==="admin"
 ? `<a class="btn" href="/logs">Open Security Logs</a>` : "";

 res.send(style+`
<div class="center">
 <div class="card">
 <h1>Welcome ${u.username}</h1>
 <h3>Role: ${u.role}</h3>
 <a class="btn btn-red" href="/logout">Logout</a>
 ${adminBtn}
 </div>
</div>`);
});

/* ================= LOGS PAGE ================= */

app.get("/logs",(req,res)=>{
 if(!req.session.user || req.session.user.role!=="admin")
 return res.send("Admins only");

 db.all("SELECT * FROM logs ORDER BY id DESC",(err,rows)=>{
 let html="";
 rows.forEach(l=>{
 html+=`<tr>
 <td>${l.username}</td>
 <td>${l.action}</td>
 <td>${l.ip}</td>
 <td>${l.time}</td>
 <td>${l.severity}</td>
 <td>${l.status}</td>
 <td><a href="/close/${l.id}">Close</a></td>
 </tr>`;
 });

 res.send(style+`
 <h1 style="text-align:center;margin-top:30px">Security Incident Logs</h1>
 <table>
 <tr><th>User</th><th>Action</th><th>IP</th><th>Time</th><th>Severity</th><th>Status</th><th>Response</th></tr>
 ${html}
 </table>
 `);
 });
});

/* ================= INCIDENT RESPONSE ================= */

app.get("/close/:id",(req,res)=>{
 db.run("UPDATE logs SET status='Closed' WHERE id=?",[req.params.id]);
 res.redirect("/logs");
});

/* ================= LOGOUT ================= */

app.get("/logout",(req,res)=>{
 req.session.destroy(()=>res.redirect("/"));
});

app.listen(3000,()=>console.log("SOC App running on http://localhost:3000"));

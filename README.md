Here is your **complete, enhanced, research-style README.md** for the topic:

# **Security Monitoring & Incident Response System**

You can copy-paste everything below directly into `README.md`.

---

# 🔐 Security Monitoring & Incident Response System

## Real-Time Detection, Logging & SOC Simulation Platform

---

## 📌 Abstract

The **Security Monitoring & Incident Response System (SMIRS)** is a web-based Security Operations Center (SOC) simulation platform built using **Node.js, Express.js, SQLite, bcrypt, and express-session**.

The system is designed to:

* Monitor authentication events
* Detect suspicious login attempts
* Identify brute-force attack patterns
* Log incidents with severity classification
* Provide administrative review capability
* Simulate structured incident response workflow

This project demonstrates how monitoring logic, detection mechanisms, incident logging, and response actions can be implemented in a secure backend environment aligned with cybersecurity best practices.

---

# 🎯 Project Objectives

✔ Implement secure user authentication
✔ Monitor login activities in real time
✔ Detect suspicious login behavior
✔ Implement brute-force attack detection
✔ Log and classify security incidents
✔ Provide structured incident response workflow
✔ Enforce role-based access control
✔ Document detection logic and research methodology
✔ Define future improvement roadmap

---

# 🏗 System Architecture

User Interface (Browser)
↓
Express.js Server (Detection & Response Engine)
↓
SQLite Database (Event & Incident Storage)

### Security Layers Implemented

* Password Hashing (bcrypt)
* Session-Based Authentication
* Login Attempt Monitoring
* Brute-Force Detection Logic
* Role-Based Authorization
* Incident Logging System
* Incident Status Management

---

# 🔍 Detection Logic & Explanation

The system continuously monitors authentication events and classifies them.

---

## 1️⃣ Successful Login Detection

When a correct password is entered:

* A log entry is created
* Severity: LOW
* Status: Closed

```
addLog(username, "Successful Login", req, "LOW", "Closed")
```

Purpose:

* Maintain audit trail
* Track normal user activity

---

## 2️⃣ Failed Login Attempt Detection

If password verification fails:

* Log entry created
* Severity: HIGH
* Status: Open

```
addLog(username, "Failed Login Attempt", req, "HIGH", "Open")
```

Purpose:

* Detect suspicious activity
* Track potential attack attempts

---

## 3️⃣ Brute Force Attack Detection

The system checks the last 3 failed login attempts:

```
SELECT * FROM logs 
WHERE username=? AND action='Failed Login Attempt'
ORDER BY id DESC LIMIT 3
```

If 3 consecutive failed attempts are found:

* A CRITICAL incident is logged
* Alert popup is triggered
* Status: Open

```
addLog(username, "🚨 BRUTE FORCE ATTACK DETECTED", req, "CRITICAL", "Open")
```

Purpose:

* Identify repeated login abuse
* Simulate SOC alert mechanism

---

## 4️⃣ IP Address Logging

Each incident log includes:

* Username
* Action
* IP Address
* Timestamp
* Severity Level
* Status

This supports:

* Incident investigation
* Source tracking
* Forensic analysis

---

# 🛡 Severity Classification Model

| Severity | Meaning                     | Action Required    |
| -------- | --------------------------- | ------------------ |
| LOW      | Normal activity             | None               |
| MEDIUM   | Suspicious behavior         | Monitor            |
| HIGH     | Confirmed malicious attempt | Investigate        |
| CRITICAL | Active security threat      | Immediate response |

---

# 🚨 Incident Scenarios & Response Steps

---

## Scenario 1: Normal User Login

Detection:

* Successful login event

Response:

* Log recorded
* No further action required

Status:
Closed

---

## Scenario 2: Single Failed Login

Detection:

* Incorrect password
* HIGH severity logged

Response:

1. Monitor further attempts
2. Admin reviews logs if repeated

Status:
Open until reviewed

---

## Scenario 3: Brute Force Attack Detected

Detection:

* 3 consecutive failed login attempts
* CRITICAL alert generated
* Popup warning displayed

Response Steps:

1. Admin reviews security logs
2. Identify suspicious IP
3. Investigate user activity
4. Close incident after validation
5. Optionally disable user account (future enhancement)

---

## Scenario 4: Unauthorized Admin Access Attempt

Detection:

* Non-admin attempts to access `/logs`

Response:

* Access denied
* Incident may be logged (optional enhancement)
* Admin review recommended

---

# 📊 Structured Incident Report Format

Each incident record contains:

* Incident ID
* Username
* Action Performed
* IP Address
* Timestamp
* Severity Level
* Incident Status (Open / Closed)

---

# 🔬 Research & Testing Methodology

---

## 1️⃣ Functional Testing

* Tested user registration
* Verified password hashing
* Tested login process
* Verified dashboard access
* Verified admin log access
* Tested log closing functionality

---

## 2️⃣ Security Testing

### Brute Force Simulation

* Entered incorrect password 3 times
* System generated CRITICAL alert
* Log recorded successfully

Result: Detection logic working correctly

---

### Session Security Testing

* Verified session creation after login
* Verified session destruction after logout
* Attempted route access without login

Result: Route protection enforced

---

### Role-Based Testing

* Tested access to logs without admin role
* Access denied successfully

Result: RBAC functioning correctly

---

## 3️⃣ Manual Attack Simulation

Simulated:

* Login with non-existing user
* Multiple failed login attempts
* Direct URL manipulation
* Unauthorized log access

Result:
System successfully enforced security restrictions.

---

# 📋 Incident Response Workflow

Detection
↓
Log Creation
↓
Severity Assignment
↓
Admin Review
↓
Incident Investigation
↓
Status Update (Closed)

This workflow simulates real SOC monitoring procedures.

---

# 📸 Required Screenshots

Create a folder:

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c127b87d-c0a0-437e-b34d-fc0b5ca03441" />

Save all captured images inside it.

---

## Screenshot 1 — Home Page

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9c43175d-7c95-4da3-bdb0-d71f0a39cc3f" />


## Screenshot 2 — Signup Page

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ef4890ff-6fde-475e-9e84-eb11f8d1eb1f" />


## Screenshot 3 — Login Page

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b0f8ba1a-f61e-49ec-94cd-5ff8bf49e0ec" />


## Screenshot 4 — Failed Login Attempt

Enter wrong password once
Capture page





## Screenshot 6 — Database View

Open `soc.db` in DB Browser for SQLite
Capture logs table
Save as:

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9746dae4-4018-4eb6-a367-0d1a9e9ddf98" />




# ⚙️ Installation Guide

Install required packages:

```
npm install express sqlite3 express-session bcrypt
```

Run application:

```
node app.js
```

Open in browser:

```
http://localhost:3000
```

---

# 📁 Project Structure

```
Security-Monitoring-Incident-Response/
│
├── app.js
├── soc.db
├── package.json
├── README.md
└── screenshots/
```

---

# 🚀 Future Improvement Scope

* Automatic account lockout after repeated failures
* Email alerts for CRITICAL incidents
* IP blacklisting mechanism
* Real-time dashboard statistics
* Rate limiting middleware
* HTTPS enforcement
* Secure cookies
* Two-Factor Authentication
* SIEM integration
* Log export (PDF/CSV)
* Threat intelligence feed integration
* OWASP Top 10 compliance mapping

---

# 🎓 Academic Contribution

This project demonstrates:

* Real-time security monitoring logic
* Intrusion detection simulation
* Structured incident response workflow
* SOC-style log analysis
* Severity classification modeling
* Backend security architecture




# 👨‍💻 Author

Tarun
Course - mca
Institution - Kurukshetra university
Year - 2026

---

This document represents a complete Security Monitoring & Incident Response implementation with structured detection logic, incident classification, and response simulation aligned with cybersecurity operational practices.

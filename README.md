# 🚔 Police Crime Management System

A **full-stack Police Crime Management System** built using **React (frontend)**, **Node.js + Express (backend)**, and **Oracle Database**.  
This project enables secure digital management of **crimes, FIRs, suspects, officers, and case details** — with **JWT authentication** and a modern dashboard UI built with Tailwind CSS.

---

## 🧩 Features

✅ **Role-Based Access**
- 👮‍♂️ *Admin*: Full access to all modules (add/update/delete)
- 👨‍✈️ *Officer*: Limited access to FIRs, cases, and crime updates

✅ **Modules Covered**
- Crimes  
- FIRs (First Information Reports)  
- Suspects  
- Officers  
- Cases  

✅ **Authentication**
- JWT-based login (Admin / Officer)
- Protected routes using middleware

✅ **Dashboard**
- Interactive charts using **Recharts**
- Summary cards for total records
- Recent activity section

✅ **Database**
- Built on **Oracle Database 21c XE / 19c**
- Uses **Sequences** for auto-incrementing IDs

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React, Tailwind CSS, Axios, Vite |
| **Backend** | Node.js, Express.js, JWT, dotenv, oracledb |
| **Database** | Oracle Database |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Charts** | Recharts |

---

## 🏗️ Project Structure

```bash
Police_Crime/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── crimes.js
│   │   ├── firs.js
│   │   ├── suspects.js
│   │   ├── cases.js
│   │   ├── officers.js
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── oracleHelper.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── Pages/
│   │   ├── Component/
│   │   ├── Context/
│   │   ├── Api/
│   │   ├── Utils/
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
│
└── README.md

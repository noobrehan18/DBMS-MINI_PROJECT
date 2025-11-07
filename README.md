# 🚔 Police Crime Management System

A **full-stack Police Crime Management System** built using **React (frontend)**, **Node.js + Express (backend)**, and **Oracle Database**.  
This project enables secure digital management of **crimes, FIRs, suspects, officers, and case details** — with **JWT authentication** and a modern dashboard UI built with Tailwind CSS.

> This project is developed as my **DBMS Mini Project**.
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
```

## 💾 Database Setup (Oracle)

### 1-Create User & Grant Privileges
```sql
CREATE USER police_admin IDENTIFIED BY police123;
GRANT CONNECT, RESOURCE, CREATE SESSION, CREATE TABLE, CREATE SEQUENCE TO police_admin;
```
### 2-Login
```sql
CONNECT police_admin/police123@localhost/XEPDB1;
```
### 3-Create Tables
```sql
CREATE TABLE OFFICERS (
    OFFICER_ID NUMBER PRIMARY KEY,
    NAME VARCHAR2(100),
    RANK VARCHAR2(50),
    CONTACT_NO VARCHAR2(15),
    STATION_ID VARCHAR2(50)
);

CREATE TABLE CRIME (
    CRIME_ID NUMBER PRIMARY KEY,
    CRIME_TYPE VARCHAR2(50),
    CRIME_DATE DATE,
    CRIME_LOCATION VARCHAR2(150),
    DESCRIPTION VARCHAR2(500),
    VICTIM_NAME VARCHAR2(100)
);

CREATE TABLE SUSPECTS (
    SUSPECT_ID NUMBER PRIMARY KEY,
    NAME VARCHAR2(100),
    AGE NUMBER,
    GENDER VARCHAR2(10),
    ADDRESS VARCHAR2(150),
    CRIME_RECORD_STATUS VARCHAR2(50)
);

CREATE TABLE FIRS (
    FIR_NO NUMBER PRIMARY KEY,
    COMPLAINT_ID NUMBER,
    FIR_DATE DATE,
    DETAILS VARCHAR2(1000),
    CRIME_TYPE VARCHAR2(50),
    CRIME_LOCATION VARCHAR2(150),
    DESCRIPTION VARCHAR2(1000),
    COMPLAINANT_NAME VARCHAR2(100),
    COMPLAINANT_CONTACT VARCHAR2(15)
);

CREATE TABLE CASES (
    CASE_ID NUMBER PRIMARY KEY,
    CRIME_ID NUMBER REFERENCES CRIME(CRIME_ID),
    OFFICER_ID NUMBER REFERENCES OFFICERS(OFFICER_ID),
    FIR_NO NUMBER REFERENCES FIRS(FIR_NO),
    DATE_ASSIGNED DATE,
    STATUS VARCHAR2(50)
);

```
### 4-Create Sequences
```sql
CREATE SEQUENCE crime_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE officer_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE suspect_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fir_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE case_seq START WITH 1 INCREMENT BY 1;


```
## 🚀 Run Project Locally
### Install Dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Start Backend
```bash
cd backend
node server.js
```
### Start Frontend
```bash
cd frontend
npm run dev
```


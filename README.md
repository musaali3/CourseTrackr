# GradeTrackr

GradeTrackr is a full-stack course grade and GPA tracking web application built with React, Flask, and SQLite.

I built this project because I noticed that many online course grade calculators were either too temporary, did not save my courses properly, or were not based on the University of Toronto GPA system. As a student, I wanted a simple tool where I could add my courses, enter assessments, track weighted grades, and see my GPA in one place. Instead of relying on calculators that reset or used different grading scales, I decided to build my own.

## About the Project

GradeTrackr allows users to create courses, add assessments with grades and weights, calculate weighted course averages, and view an overall GPA summary. The frontend provides a clean dashboard-style interface, while the backend handles course and assessment data through a Flask REST API.

The goal of this project was to practice full-stack development while also building something useful for students who want a more personalized and persistent grade tracking tool.

Visit the application: https://course-trackr.vercel.app/ 

## Features

- Add and delete courses
- Add and delete assessments for each course
- Enter assessment grades and weight percentages
- Calculate weighted course averages
- Display letter grades and GPA values
- View an overall GPA summary
- Store course and assessment data using a SQLite database
- Connect a React frontend with a Flask backend through REST API routes

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Lucide React icons

### Backend
- Python
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- SQLite

## Project Structure

```txt
course-grade-calculator/
├── backend/
│   ├── config.py
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore

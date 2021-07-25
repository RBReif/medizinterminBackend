# medizintermin-backend application

## Table of content

- [Introduction](#introduction)
- [Frontend](#frontend)
- [Prerequisites](#prerequisites)
- [Run](#run)
- [Credit](#credit)

## Introduction

Medizintermin is an intermediary service to help patients and health care professionals to connect and to easily facilitate the otherwise tedious managment of appointments with automated matching and scheduling.
Patients can easily book their medical appointments with medizintermin. We consider a wide range of needs to find the perfect appointment. Patients receive individually calculated recommendations for e.g. checkups. Patients can edit, cancel and see details of their appointments and the respective health care professionals. They can calculate routes to the respective lcoation.
Health care professionals can offer available time slots to patients, can keep track of previous appointments and can easily manage their schedule and their daily appointments. E.g., they can take notes that get stored and they see important information about their patients.

## Frontend

Please also clone the frontend project from the repository. This project uses React.js for the frontend. The project was realized using the MERN stack. 

## Prerequisites

Both for the backend and frontend application:

* nodejs [official website](https://nodejs.org/en/) - nodejs includes [npm](https://www.npmjs.com/) (node package manager)

Just for the backend application:

* mongodb [official installation guide](https://docs.mongodb.org/manual/administration/install-community/)

### Setup (before first run)

Go to your project root folder via command line
```
cd path/to/workspace/backend
```

**Install node dependencies**

```
npm install
```

**Set up your database**

* Create a new directory where your database will be stored (it's a good idea to separate data and business logic - the data directory should be on a different place than your app)
* Start the database server
```
mongod --dbpath "path/to/database"
```

## Run

### `npm start`

Runs the app in the development mode.\
The backend application will run on [http://localhost:4000](http://localhost:4000)

You will also see any errors in the console.


The application (frontend-side) will run on [http://localhost:3000](http://localhost:3000)

## Credit

This application was developed by Team 52 of the SEBA Master Course at TUM in Summer 2021, namely Christoph Kipfer, Maximilian Pfleger, Roland Reif, Mehul Sethi. 

# CapstoneConnect

A full-stack web platform that connects university students and supervisors 
for managing final year projects. Built as a Bachelor's capstone project at 
DHA Suffa University.

## Features

- **Project Management** — Students can submit projects, track progress, 
  and receive feedback from supervisors
- **Real-Time Communication** — Live chat and notifications between students 
  and supervisors using SignalR
- **AI-Powered Plagiarism Detection** — Analyses submitted project reports 
  using cosine similarity and LLMs, returning similarity scores and flagged content
- **Authentication & Authorization** — Secure JWT-based login with role-based 
  access (Student / Supervisor / Admin)
- **CI/CD Pipeline** — Automated build, test, and deployment via Azure DevOps, 
  hosted on IIS

## Project Structure

### Authentication
Handles user registration, login, and JWT token generation. Manages 
role-based access control to restrict endpoints based on user type 
(Student, Supervisor, Admin).

### CapstoneConnect
The main application layer containing controllers, routing, and API 
endpoints. Acts as the entry point for all incoming requests and 
coordinates between the different modules.

### CapstoneConnect.Model
Contains all database entity models and schema definitions. Defines 
the structure of core data objects such as users, projects, submissions, 
and feedback using Entity Framework.

### CapstoneConnectCommunication
Houses the SignalR hub responsible for managing real-time connections. 
Handles broadcasting live notifications and chat messages to connected 
clients instantly without polling.

### CapstoneConnectLog
Centralised logging service built with log4net and ASP.NET action filters. 
Automatically captures incoming requests, errors, and key application 
events across the platform for monitoring and debugging.

### Communication
Manages messaging between students and supervisors, including real-time 
chat and live status updates. Works alongside the SignalR hub to ensure 
messages and notifications are delivered instantly.

### ProjectRepository
A key responsibility of this repository is powering the plagiarism detection feature when a new project report is submitted, it retrieves all previously submitted FYP reports from the database and makes them available for similarity comparison, enabling the system to evaluate originality against the full historical record of past submissions.

### dataset
Contains the training data used by the Python-based plagiarism detection 
algorithm. Used to train and evaluate the cosine similarity model that 
analyses submitted project reports for academic integrity checks.

## Tech Stack

**Backend:** .NET Core, ASP.NET MVC, SignalR, Entity Framework  
**Frontend:** React.js  
**Database:** SQL Server  
**Logging:** log4net, Action Filters  
**Cloud & DevOps:** Azure DevOps, IIS  
**AI:** Python, Cosine Similarity

## Architecture

Built on a microservices architecture, with independent modules for 
authentication, communication, logging, and project management — enabling 
separate scaling and deployment of each service.

## Getting Started

1. Clone the repository
```bash
   git clone https://github.com/Murtaza513/CapstoneConnect.git
```
2. Open `CapstoneConnect.sln` in Visual Studio
3. Set up your SQL Server connection string in `appsettings.json`
4. Run the solution

## Contributors

- Murtaza Mehdi

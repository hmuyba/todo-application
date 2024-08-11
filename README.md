# Task Management Application

## Overview

This project is a task management application built with **Angular** for the frontend and **Spring Boot** for the backend. It allows users to manage tasks efficiently with functionalities for creating, updating, deleting, and viewing tasks.

### Features

- **Create, Read, Update, Delete (CRUD) Operations**: Manage tasks with ease.
- **Status Management**: Organize tasks into categories like TO DO, IN PROGRESS, and DONE.
- **Responsive Design**: Use Angular Material components for a modern and user-friendly interface.
- **Modular and Layered Architecture**: Ensures maintainability and scalability.

## Architecture

The project follows a **layered architecture**:

1. **Presentation Layer**: Angular components (`TaskListComponent`, `TaskFormComponent`) for the user interface.
2. **Business Logic Layer**: Angular service (`TaskService`) and Spring Boot service (`TaskService`) manage business rules.
3. **Data Access Layer**: Spring Boot repository (`TaskRepository`) for database interactions.

## Design Patterns Used

- **MVC Pattern**: Separates view, controller, and model components.
- **Service Layer Pattern**: Encapsulates business logic.
- **Repository Pattern**: Manages data access.
- **Singleton Pattern**: Ensures single instances of services.
- **Observer Pattern**: Updates UI in response to data changes using `rxjs`.

## Getting Started

### Prerequisites

- **Node.js** and **npm** (for Angular)
- **Java 11** or higher (for Spring Boot)
- **Maven** (for building the backend)
- **MySQL** or another supported database (for backend persistence)

### Setup

#### Frontend (Angular)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>/frontend

# UrbanClap

UrbanClap is a service booking platform where users can book various services like plumbing, electrician, cleaning, etc. The platform supports different user roles such as customers, employees, and admins.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication
- Role-based access control (Customer, Employee, Admin)
- Service booking and management
- Booking status updates and notifications
- Admin dashboard for managing users and bookings
- Employee dashboard for viewing ratings and booking status
- CSV export of service data

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/urbanclap.git
    cd urbanclap
    ```

2. Set up a virtual environment and activate it:
    ```sh
    python -m venv .venv
    source .venv/bin/activate
    ```

3. Install the required dependencies:
    ```sh
    pip install -r req.txt
    ```

4. Set up the database:
    ```sh
    flask db upgrade
    ```

5. Run the application:
    ```sh
    flask run
    ```

6. Start the Celery worker and beat scheduler:
    ```sh
    celery -A app:celery_app worker -l INFO
    celery -A app:celery_app beat
    ```

## Usage

1. Open your browser and navigate to `http://localhost:5000`.
2. Register as a new user or log in with existing credentials.
3. Depending on your role, you can book services, manage bookings, or view the admin dashboard.


## API Endpoints

### Authentication

- `POST /register`: Register a new user
- `POST /login`: Log in a user

### Services

- `GET /api/services`: Get a list of services
- `POST /api/services`: Create a new service (Admin/Employee)
- `PUT /api/service/:id`: Update a service (Admin/Employee)
- `DELETE /api/service/:id`: Delete a service (Admin/Employee)

### Bookings

- `GET /api/bookings`: Get a list of bookings (Admin/Employee/Customer)
- `POST /api/bookings`: Create a new booking (Customer)
- `PUT /api/bookings/:id`: Update a booking status (Admin/Employee/Customer)

### Users

- `GET /api/users`: Get a list of users (Admin)
- `GET /api/customers`: Get a list of customers (Admin)
- `PUT /api/customers/:id`: Update customer status (Admin)


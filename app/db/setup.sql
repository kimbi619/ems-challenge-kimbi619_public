-- This file contains the SQL schema, it drops all tables and recreates them

DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;

-- To add a field to a table do
-- CREATE TABLE table_name (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     nullable_field TEXT,
--     non_nullable_field TEXT NOT NULL,
--     numeric_field INTEGER,
--     unique_field TEXT UNIQUE,
--     unique_non_nullable_field TEXT NOT NULL UNIQUE,
--     date_field DATE,
--     datetime_field DATETIME
-- );

CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NULL,
    last_name TEXT NULL,
    email TEXT NULL,
    phone TEXT NULL,
    hire_date DATE NULL,
    job_title TEXT NULL,
    department TEXT NULL,
    avatar_url TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    manager_id INTEGER NULL,
    date_of_birth DATE NULL,
    initial_salary INTEGER NULL,
    current_salary INTEGER NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    identification_number TEXT NULL,
    id_document_url TEXT NULL,
    cv_url TEXT NULL,
    password_hash TEXT NULL,
    timesheets INTEGER NULL,
    role_id INTEGER NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    FOREIGN KEY (timesheets) REFERENCES timesheets(id),
    UNIQUE (email)
);

CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NULL,
    break_duration INTEGER NULL,
    break_start_time DATETIME NULL,
    break_end_time DATETIME NULL,
    check_in_location TEXT NULL,
    check_out_location TEXT NULL,
    check_in_device TEXT NOT NULL,
    check_out_device TEXT NULL,
    break_pause_location TEXT NULL,
    break_resume_location TEXT NULL,
    break_pause_device TEXT NULL,
    break_resume_device TEXT NULL,
    is_remote BOOLEAN NOT NULL DEFAULT 0,
    is_regularized BOOLEAN NOT NULL DEFAULT 0,
    regularization_reason TEXT NULL,
    regularization_requested_at DATETIME NULL,
    regularization_request_approved_at DATETIME NULL,
    regularization_request_approved_by INTEGER NULL,
    employee_id INTEGER NOT NULL,
    is_absence BOOLEAN NOT NULL,
    absence_reason TEXT NULL,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (regularization_request_approved_by) REFERENCES employees(id)
);

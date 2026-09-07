# 🔐 SecureGate — Login Authentication System

A simple client-side Login Authentication System developed using HTML, CSS, and JavaScript as part of the **Oasis Infobyte Web Development & Designing Internship – Level 2**.

The project provides user registration, password validation, secure password hashing using SHA-256, login authentication, protected dashboard access, and logout functionality.

---

## 📌 Project Overview

The Login Authentication System allows users to create an account and securely access a protected dashboard after successful authentication.

The application uses **localStorage** to store registered user information and maintain the login session.

Passwords are not stored directly. Before storage, passwords are converted into **SHA-256 hash values** using the Web Crypto API.

---

## 🎯 Objective

Build a simple authentication system featuring:

- User registration
- Password validation
- Duplicate username/email detection
- Login validation
- Protected dashboard access
- Session management
- Logout functionality
- Password hashing

---

## ✨ Features

### 👤 User Registration

Users can create an account by providing:

- Username
- Email address
- Password

The registration form validates the submitted information before creating an account.

### 🔑 Password Validation

The password must:

- Contain at least 8 characters
- Contain at least 1 number

Invalid passwords are rejected with a clear validation message.

### 🚫 Duplicate Account Detection

The application checks whether the entered username or email already exists.

If an existing username or email is detected, registration is rejected and an error message is displayed.

### 🔐 Password Hashing

Passwords are never stored as plain text.

The application uses the **SHA-256 hashing algorithm** through the browser's Web Crypto API before storing the password information in localStorage.

### 🧑‍💻 Login Authentication

Users can log in using either:

- Username
- Email address

The entered password is hashed and compared with the stored password hash.

### ⚠️ Incorrect Credential Handling

When incorrect login credentials are entered, the application displays a generic message:

> Invalid username/email or password.

The application does not reveal whether the username/email or password was incorrect.

### 🛡️ Protected Dashboard

The dashboard can only be accessed when a valid login session exists.

If a user attempts to access `dashboard.html` directly without logging in, they are automatically redirected to the login page.

### 🚪 Logout

The dashboard includes a Logout button.

When the user logs out:

- The active session is removed
- The user is redirected to the login page
- Protected dashboard access is no longer available

### 📱 Responsive Design

The interface is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile screens

---

## 🛠️ Technologies Used

- **HTML5** — Page structure
- **CSS3** — Styling and responsive design
- **JavaScript** — Authentication logic and DOM manipulation
- **localStorage** — Client-side user and session storage
- **Web Crypto API** — SHA-256 password hashing

---

## 📂 Project Structure

```text
WebDev-L2-LoginAuthentication/
│
├── index.html
├── register.html
├── dashboard.html
├── style.css
├── script.js
├── README.md
│
└── screenshots/
    ├── login-page.png
    ├── registration-page.png
    ├── dashboard.png
    ├── validation-error.png
    └── responsive-view.png

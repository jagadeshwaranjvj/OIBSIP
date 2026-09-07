"use strict";

/*
    SecureGate
    Front-end Authentication System

    Users are stored in localStorage.
    Passwords are converted to SHA-256 hashes
    before being stored.
*/


// ==========================================
// STORAGE KEYS
// ==========================================

const USERS_KEY = "securegate_users";
const SESSION_KEY = "securegate_session";


// ==========================================
// BASIC STORAGE HELPERS
// ==========================================

function getUsers() {
    try {
        const savedUsers = localStorage.getItem(USERS_KEY);

        if (!savedUsers) {
            return [];
        }

        const users = JSON.parse(savedUsers);

        return Array.isArray(users) ? users : [];

    } catch (error) {
        console.error("Unable to read users:", error);
        return [];
    }
}


function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


// ==========================================
// SHA-256 PASSWORD HASHING
// ==========================================

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const passwordData = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        passwordData
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// ==========================================
// VALIDATION HELPERS
// ==========================================

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


function isValidPassword(password) {

    return password.length >= 8 &&
           /\d/.test(password);
}


function normalizeUsername(username) {
    return username.trim().toLowerCase();
}


function normalizeEmail(email) {
    return email.trim().toLowerCase();
}


// ==========================================
// MESSAGE HELPERS
// ==========================================

function setText(elementId, message) {

    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = message;
    }
}


function clearRegistrationErrors() {

    setText("registerUsernameError", "");
    setText("registerEmailError", "");
    setText("registerPasswordError", "");
    setText("registerMessage", "");
}


function clearLoginErrors() {

    setText("loginIdentityError", "");
    setText("loginPasswordError", "");
    setText("loginMessage", "");
}


// ==========================================
// REGISTRATION
// ==========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearRegistrationErrors();

            const usernameInput =
                document.getElementById("registerUsername");

            const emailInput =
                document.getElementById("registerEmail");

            const passwordInput =
                document.getElementById("registerPassword");


            const username =
                normalizeUsername(usernameInput.value);

            const email =
                normalizeEmail(emailInput.value);

            const password =
                passwordInput.value;


            let hasError = false;


            // Username validation

            if (!username) {

                setText(
                    "registerUsernameError",
                    "Username is required."
                );

                hasError = true;

            } else if (username.length < 3) {

                setText(
                    "registerUsernameError",
                    "Username must contain at least 3 characters."
                );

                hasError = true;
            }


            // Email validation

            if (!email) {

                setText(
                    "registerEmailError",
                    "Email address is required."
                );

                hasError = true;

            } else if (!isValidEmail(email)) {

                setText(
                    "registerEmailError",
                    "Enter a valid email address."
                );

                hasError = true;
            }


            // Password validation

            if (!password) {

                setText(
                    "registerPasswordError",
                    "Password is required."
                );

                hasError = true;

            } else if (!isValidPassword(password)) {

                setText(
                    "registerPasswordError",
                    "Password must contain at least 8 characters and 1 number."
                );

                hasError = true;
            }


            if (hasError) {
                return;
            }


            // Get existing users

            const users = getUsers();


            // Duplicate check

            const duplicateUser = users.some(function (user) {

                return (
                    user.username === username ||
                    user.email === email
                );

            });


            if (duplicateUser) {

                setText(
                    "registerMessage",
                    "An account with this username or email already exists."
                );

                return;
            }


            try {

                // Hash password before storage

                const passwordHash =
                    await hashPassword(password);


                const newUser = {

                    id: crypto.randomUUID(),

                    username: username,

                    email: email,

                    passwordHash: passwordHash,

                    createdAt: new Date().toISOString()

                };


                users.push(newUser);

                saveUsers(users);


                setText(
                    "registerMessage",
                    "Registration successful. Redirecting to login..."
                );


                document
                    .getElementById("registerMessage")
                    .classList
                    .add("success-message");


                registerForm.reset();


                setTimeout(function () {

                    window.location.href = "index.html";

                }, 1200);


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                setText(
                    "registerMessage",
                    "Unable to complete registration. Please try again."
                );
            }

        }
    );
}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearLoginErrors();


            const identityInput =
                document.getElementById("loginIdentity");

            const passwordInput =
                document.getElementById("loginPassword");


            const identity =
                identityInput.value.trim().toLowerCase();

            const password =
                passwordInput.value;


            let hasError = false;


            if (!identity) {

                setText(
                    "loginIdentityError",
                    "Username or email is required."
                );

                hasError = true;
            }


            if (!password) {

                setText(
                    "loginPasswordError",
                    "Password is required."
                );

                hasError = true;
            }


            if (hasError) {
                return;
            }


            const users = getUsers();


            try {

                const enteredPasswordHash =
                    await hashPassword(password);


                const matchingUser =
                    users.find(function (user) {

                        return (
                            user.username === identity ||
                            user.email === identity
                        );

                    });


                const credentialsAreValid =
                    matchingUser &&
                    matchingUser.passwordHash ===
                    enteredPasswordHash;


                if (!credentialsAreValid) {

                    // Generic error intentionally used.
                    // This avoids revealing whether the
                    // username/email or password was incorrect.

                    setText(
                        "loginMessage",
                        "Invalid username/email or password."
                    );

                    return;
                }


                // Create login session

                const session = {

                    userId: matchingUser.id,

                    username: matchingUser.username,

                    loginTime: new Date().toISOString()

                };


                localStorage.setItem(
                    SESSION_KEY,
                    JSON.stringify(session)
                );


                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                setText(
                    "loginMessage",
                    "Unable to complete login. Please try again."
                );
            }

        }
    );
}


// ==========================================
// PROTECTED DASHBOARD
// ==========================================

if (
    window.location.pathname.endsWith(
        "dashboard.html"
    )
) {

    const savedSession =
        localStorage.getItem(SESSION_KEY);


    if (!savedSession) {

        window.location.replace(
            "index.html"
        );

    } else {

        try {

            const session =
                JSON.parse(savedSession);


            const users =
                getUsers();


            const loggedInUser =
                users.find(function (user) {

                    return user.id === session.userId;

                });


            if (!loggedInUser) {

                localStorage.removeItem(
                    SESSION_KEY
                );

                window.location.replace(
                    "index.html"
                );

            } else {

                setText(
                    "dashboardUsername",
                    loggedInUser.username
                );

                setText(
                    "accountUsername",
                    loggedInUser.username
                );

                setText(
                    "accountEmail",
                    loggedInUser.email
                );
            }


        } catch (error) {

            localStorage.removeItem(
                SESSION_KEY
            );

            window.location.replace(
                "index.html"
            );
        }
    }
}


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                SESSION_KEY
            );


            window.location.replace(
                "index.html"
            );

        }
    );
}


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

function setupPasswordToggle(
    inputId,
    buttonId
) {

    const passwordInput =
        document.getElementById(inputId);

    const toggleButton =
        document.getElementById(buttonId);


    if (!passwordInput || !toggleButton) {
        return;
    }


    toggleButton.addEventListener(
        "click",
        function () {

            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword ? "text" : "password";


            toggleButton.textContent =
                isPassword ? "Hide" : "Show";


            toggleButton.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        }
    );
}


setupPasswordToggle(
    "loginPassword",
    "loginPasswordToggle"
);


setupPasswordToggle(
    "registerPassword",
    "registerPasswordToggle"
);

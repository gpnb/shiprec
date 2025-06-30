# Basic User Implementation

The users of the application are stored in the "user" table of the database. The backend handles user data storage and API endpoints, while the frontend manages user interactions and validation. To manage the user's features on the backend, the files `UserEntity`, `UserDto`, `UserRepo`, `UserService` and `UserController` were created. 
`UserEntity` represents the database table.`UserDto` holds data between the frontend and backend or between different backend layers, using only the necessary fields that need to be exposed or received to / from the API. This helps avoid vulnerabilities like password exposure. UserRepo is responsible for the data access layer and is used by the service layer to fetch and save user data. `UserService` handles the operations described below, through methods, acting as a middle layer between the repository and the controller. Finally, `UserController` is the API layer and HTTP request handler, calling methods from the service layer and returning HTTP responses and status messages.

## Session Management and Preventing Unauthorized Access
React's `UseState` and `UseEffect` are used for the implementation. In all the user operations, everytime the application must fetch data, the user information is saved in React's `localStorage` and then retrieved appropriately. Alongside this, a session expiration time with the duration of one day is also stored, to avoid overloading the website. A logged out user is redirected back to the Sign In page. In every user async operation, like API calls and information submission (e.g. the editing of their profile or their current email and password), loading is implemented for better UX , using `setLoading`. A creation timestamp is also calculated and displayed in the user's Settings page.

To avoid a guest user accessing pages like "My Account" or "Settings", even though the fields are hidden in the Guest Map page, Protected Routes were implemented so that these addresses redirect to the Register Page. This can be seen in the file `ProtectedRoute.jsx` under frontend/src/components, and used in `main.jsx`. 

## RESTful API endpoints
The following endpoints are implemented for user actions : 
- POST /register
- POST /login
- PUT /users/:id (for updates to their account information)
- Specific endpoints for email and password changes, as well as account deletion

Users are fetched using `findbyId`, since id is their primary key on the user table. The user's notifications are active by default, with `notificationsActive` set to true. This can be changed in their Settings page. Specific DTOs were created named `EmailChangeDto` and `PasswordChangeDto` to better handle these requests and separate the information needed for the operations to take place.


# Registration and SignIn

Under /frontend/src/pages, `signInPage.jsx` and `registerPage.jsx` can be found. The required fields for registration are the email, password, first and last name and country of the user. Appropriate validation is performed if the user does not input all fields. If their email is not valid or if their password is not secure, client-side validation is done using regular expressions. The password must have minimum 8 characters and must include letters and numbers. 
The data is submitted to the backend endpoint and the errors and handled and displayed using `setError`. After registering or signing in, a user is redirected to the map page. The sign in is handled by simply using the email and password.

The selection of a user's country is done by transforming the `country-list` from React to react-select format. For this, the following installations are needed :
- `npm install react-select`
- `npm install country-list`


# User Account

Under /MyAccount, the user can view their profile by selecting "My Profile". Through the navigation bar - menu, the user can access their Settings.

## User Profile

The profile page allows users to view and edit personal details. These implementations can be found under /frontend/src/pages, in `myProfilePage.jsx` and `editProfilePage.jsx`. A regular expression is also used here, to check the validity of phone number format if a user adds it through their "Edit Profile" feature. The `handleFieldChange` function is used to change only the fields that the user edits, and `handleSubmit` is used to save these changes by sending a PUT request to the backend.

## User Settings

Under /frontend/src/pages, `SettingsPage.jsx` provides :

- An operation to change current email or password. This is implemented with popups / modals (`ChangePasswordPopup.jsx` and `ChangeEmailPopup.jsx` under /frontend/src/components). In order to change their email, the user must input their current password. The same is true for a password change, with an extra verification step for the new password. The user can also choose to hide or show their password as they are typing it. The changes take place by using simple `handleEmailChange` and `handlePasswordChange` functions with PUT request endpoints.
- An operation to delete their account. This is also implemented with a popup, in `DeleteAccountPopup.jsx`, using a simple DELETE endpoint to communicate with the backend. On deleting their account, which is an irreversible action the user is warned about, they are redirected back to the Guest Map page.
- A toggle for notification preferences. On toggling, the field `notificationsActive` in the user's corresponding field in the database is modified and set to true or false, regarding the receiving of emails for every notification.

Appropriate css styles can be found for the frontend of every page and component mentioned above under frontend/src/styles.


# Things Not Implemented (yet)
- User testing automation
- Forgot Password Feature 
- Handling Banned Users
- Actual email validation with the use of tokens in the backend
- Possible use of Cookies 
- JWT implementation improvement
- Dependencies Script
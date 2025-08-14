
Book Review Board — MERN Fullstack Application

Overview

Book Review Board is a MERN (MongoDB, Express, React, Node.js) full-stack application that allows users to:
 Register and log in using secure JWT-based authentication.
 Add, edit, and delete books they own
 Write reviews for books.
 Search for books by title.
 View only the books they’ve added in a My Books section.
 See book details along with reviews from all users.

Features

Authentication
User Registration with name, email, and password.
User Login  with JWT authentication.
- asswords hashed securely with `bcryptjs`.

Books
Add New Book — title, author, description, and cover image.
View All Books — newest first.
Search Books by Title — instant filtering using a search bar.
Edit/Delete Reviews
Add a review to any book (rating + comment).
View all reviews for a book with reviewer names.

Access Control
Only the book owner can edit or delete it.
Other users can view but not modify someone else’s books.

---


Tech Stack
Frontend:
- React + Vite
- Axios for API calls
- React Router for navigation
- Tailwind CSS for styling

Backend:
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation










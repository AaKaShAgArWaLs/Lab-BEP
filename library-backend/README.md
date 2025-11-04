# Library Management System API - Backend

A comprehensive RESTful API for managing a library system with books, members, and borrowing functionality.

## Features

- **API Key Authentication**: Secure all endpoints with API key validation
- **Books Management**: Complete CRUD operations for books
- **Members Management**: Register and manage library members
- **Borrowing System**: Borrow and return books with due date tracking
- **Late Fee Calculation**: Automatic calculation of late fees ($5 per day)
- **Form Validation**: Comprehensive validation for all inputs
- **Error Handling**: Detailed error messages for debugging

## Installation

```bash
npm install
```

## Running the Server

### Production Mode
```bash
npm start
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

Server will start on: `http://localhost:3000`

## API Authentication

All `/api/*` endpoints require API key authentication.

**Header Required:**
```
x-api-key: LIB-API-KEY-2024-SECRET-12345
```

## API Endpoints

### Books

#### Get All Books
```
GET /api/books
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### Get Single Book
```
GET /api/books/:id
```

#### Add New Book
```
POST /api/books
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "isbn": "978-0-547-92822-7",
  "category": "Fantasy",
  "publishYear": 1937,
  "copies": 5
}
```

**Validation Rules:**
- Title: Required, non-empty
- Author: Required, non-empty
- ISBN: Required, unique
- Category: Required
- Publish Year: Between 1000 and current year
- Copies: Minimum 1

#### Update Book
```
PUT /api/books/:id
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "copies": 10
}
```

#### Delete Book
```
DELETE /api/books/:id
```

**Note:** Cannot delete books that are currently borrowed.

---

### Members

#### Get All Members
```
GET /api/members
```

#### Get Single Member
```
GET /api/members/:id
```

#### Register New Member
```
POST /api/members
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@email.com",
  "phone": "5551234567",
  "membershipDate": "2024-11-04"
}
```

**Validation Rules:**
- Name: Required, non-empty
- Email: Required, valid format, unique
- Phone: Required, 10 digits
- Membership Date: Optional (defaults to today)

#### Update Member
```
PUT /api/members/:id
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "name": "Alice Smith",
  "phone": "5559876543"
}
```

#### Delete Member
```
DELETE /api/members/:id
```

**Note:** Cannot delete members with borrowed books.

---

### Borrowing & Returning

#### Borrow a Book
```
POST /api/borrow
Content-Type: application/json
```

**Request Body:**
```json
{
  "memberId": 1,
  "bookId": 2
}
```

**Features:**
- Checks book availability
- Prevents duplicate borrowing
- Sets due date (14 days from borrow date)
- Updates member's borrowed books list

**Response:**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "record": {...},
    "book": {...},
    "member": {...},
    "dueDate": "2024-11-18"
  }
}
```

#### Return a Book
```
POST /api/return
Content-Type: application/json
```

**Request Body:**
```json
{
  "memberId": 1,
  "bookId": 2
}
```

**Features:**
- Calculates if return is late
- Computes late fees ($5 per day)
- Updates book availability
- Marks record as returned

**Response:**
```json
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "record": {...},
    "book": {...},
    "member": {...},
    "isLate": true,
    "daysLate": 3,
    "fine": 15
  }
}
```

#### Get All Borrow Records
```
GET /api/borrow-records
```

Shows all borrowing history with member names and book titles.

---

### Information

#### API Information
```
GET /
```

Returns API information and list of all available endpoints.

---

## Testing with Postman

### Setup
1. Create a new request in Postman
2. Add header:
   - Key: `x-api-key`
   - Value: `LIB-API-KEY-2024-SECRET-12345`

### Sample Test Sequence

1. **Get all books**
   ```
   GET http://localhost:3000/api/books
   ```

2. **Add a new member**
   ```
   POST http://localhost:3000/api/members
   Body: {
     "name": "Test User",
     "email": "test@email.com",
     "phone": "1234567890"
   }
   ```

3. **Borrow a book**
   ```
   POST http://localhost:3000/api/borrow
   Body: {
     "memberId": 3,
     "bookId": 1
   }
   ```

4. **Return the book**
   ```
   POST http://localhost:3000/api/return
   Body: {
     "memberId": 3,
     "bookId": 1
   }
   ```

5. **Check borrow records**
   ```
   GET http://localhost:3000/api/borrow-records
   ```

## Error Handling

The API returns standardized error responses:

**Validation Error (400):**
```json
{
  "success": false,
  "errors": [
    "Title is required",
    "Invalid publish year"
  ]
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Book not found"
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "error": "API key is required",
  "message": "Please provide an API key in the x-api-key header"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is not valid"
}
```

## Sample Data

The API comes pre-loaded with sample data:

**Books:**
- The Great Gatsby by F. Scott Fitzgerald
- To Kill a Mockingbird by Harper Lee
- 1984 by George Orwell

**Members:**
- John Doe (john.doe@email.com)
- Jane Smith (jane.smith@email.com)

**Borrow Records:**
- John Doe has borrowed "The Great Gatsby"

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **In-memory storage**: Simple data storage for demo purposes

## Project Structure

```
library-backend/
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Business Logic

### Borrowing Rules
- Books must be available (availableCopies > 0)
- Members cannot borrow the same book twice
- Borrowing period: 14 days
- Late fee: $5 per day after due date

### Delete Restrictions
- Cannot delete books that are currently borrowed
- Cannot delete members with active borrowed books

### Validation
- All email addresses are converted to lowercase
- Phone numbers must be exactly 10 digits
- Publish years must be between 1000 and current year
- ISBNs must be unique

## Development Tips

1. Use Postman Collections to save all your API requests
2. Check the console output for detailed error logs
3. Test validation by intentionally sending invalid data
4. Use the `/` endpoint to see all available routes
5. Monitor borrow records to track system state

## Common Issues & Solutions

**Issue:** API key error
- **Solution:** Make sure you're adding the header to EVERY request

**Issue:** Cannot delete book/member
- **Solution:** Check if there are active borrow records

**Issue:** Port already in use
- **Solution:** Change PORT variable in server.js or kill the process

**Issue:** Validation errors
- **Solution:** Check the error response for specific field requirements

## For Lab Exam

This backend API demonstrates:
- ✅ Express.js framework usage
- ✅ API key authentication
- ✅ Form handling and validation
- ✅ CRUD operations
- ✅ RESTful API design
- ✅ Error handling
- ✅ Postman testing capability

## License

ISC

---

**Question 3 - Lab Exam Submission**

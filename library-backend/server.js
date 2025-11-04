/**
 * LIBRARY MANAGEMENT SYSTEM API
 *
 * A RESTful API for managing a library system with books and members
 * Includes API key authentication for security
 *
 * Features:
 * - API Key authentication middleware
 * - Book management (CRUD operations)
 * - Member management (CRUD operations)
 * - Book borrowing and returning
 * - Form data handling with validation
 *
 * API KEY: LIB-API-KEY-2024-SECRET-12345
 *
 * To test in Postman:
 * 1. Add header: x-api-key: LIB-API-KEY-2024-SECRET-12345
 * 2. For POST/PUT requests, use x-www-form-urlencoded or JSON body
 */

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Valid API Key
const VALID_API_KEY = 'LIB-API-KEY-2024-SECRET-12345';

// In-memory database
let books = [
    {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        category: 'Fiction',
        publishYear: 1925,
        copies: 5,
        availableCopies: 3
    },
    {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        category: 'Fiction',
        publishYear: 1960,
        copies: 4,
        availableCopies: 4
    },
    {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        category: 'Science Fiction',
        publishYear: 1949,
        copies: 6,
        availableCopies: 2
    }
];

let members = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '1234567890',
        membershipDate: '2024-01-15',
        borrowedBooks: [1]
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '9876543210',
        membershipDate: '2024-02-20',
        borrowedBooks: []
    }
];

let borrowRecords = [
    {
        id: 1,
        memberId: 1,
        bookId: 1,
        borrowDate: '2024-10-01',
        dueDate: '2024-10-15',
        returnDate: null,
        status: 'borrowed'
    }
];

// API Key Authentication Middleware
const authenticateAPIKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API key is required',
            message: 'Please provide an API key in the x-api-key header'
        });
    }

    if (apiKey !== VALID_API_KEY) {
        return res.status(403).json({
            success: false,
            error: 'Invalid API key',
            message: 'The provided API key is not valid'
        });
    }

    next();
};

// Apply API key authentication to all routes
app.use('/api', authenticateAPIKey);

// ============= BOOK ROUTES =============

// Get all books
app.get('/api/books', (req, res) => {
    res.json({
        success: true,
        count: books.length,
        data: books
    });
});

// Get single book by ID
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
        return res.status(404).json({
            success: false,
            error: 'Book not found'
        });
    }

    res.json({
        success: true,
        data: book
    });
});

// Add new book (Form handling)
app.post('/api/books', (req, res) => {
    const { title, author, isbn, category, publishYear, copies } = req.body;

    // Validation
    const errors = [];

    if (!title || title.trim() === '') {
        errors.push('Title is required');
    }

    if (!author || author.trim() === '') {
        errors.push('Author is required');
    }

    if (!isbn || isbn.trim() === '') {
        errors.push('ISBN is required');
    }

    if (!category || category.trim() === '') {
        errors.push('Category is required');
    }

    if (!publishYear) {
        errors.push('Publish year is required');
    } else if (publishYear < 1000 || publishYear > new Date().getFullYear()) {
        errors.push('Invalid publish year');
    }

    if (!copies) {
        errors.push('Number of copies is required');
    } else if (copies < 1) {
        errors.push('Copies must be at least 1');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    // Check if ISBN already exists
    const existingBook = books.find(b => b.isbn === isbn);
    if (existingBook) {
        return res.status(400).json({
            success: false,
            error: 'A book with this ISBN already exists'
        });
    }

    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        category: category.trim(),
        publishYear: parseInt(publishYear),
        copies: parseInt(copies),
        availableCopies: parseInt(copies)
    };

    books.push(newBook);

    res.status(201).json({
        success: true,
        message: 'Book added successfully',
        data: newBook
    });
});

// Update book (Form handling)
app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Book not found'
        });
    }

    const { title, author, isbn, category, publishYear, copies } = req.body;
    const errors = [];

    if (title && title.trim() === '') {
        errors.push('Title cannot be empty');
    }

    if (author && author.trim() === '') {
        errors.push('Author cannot be empty');
    }

    if (publishYear && (publishYear < 1000 || publishYear > new Date().getFullYear())) {
        errors.push('Invalid publish year');
    }

    if (copies && copies < 1) {
        errors.push('Copies must be at least 1');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    // Update book
    const currentBook = books[bookIndex];
    const updatedBook = {
        ...currentBook,
        title: title ? title.trim() : currentBook.title,
        author: author ? author.trim() : currentBook.author,
        isbn: isbn ? isbn.trim() : currentBook.isbn,
        category: category ? category.trim() : currentBook.category,
        publishYear: publishYear ? parseInt(publishYear) : currentBook.publishYear,
        copies: copies ? parseInt(copies) : currentBook.copies
    };

    books[bookIndex] = updatedBook;

    res.json({
        success: true,
        message: 'Book updated successfully',
        data: updatedBook
    });
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Book not found'
        });
    }

    // Check if book is currently borrowed
    const isBorrowed = borrowRecords.some(
        record => record.bookId === bookId && record.status === 'borrowed'
    );

    if (isBorrowed) {
        return res.status(400).json({
            success: false,
            error: 'Cannot delete book as it is currently borrowed'
        });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];

    res.json({
        success: true,
        message: 'Book deleted successfully',
        data: deletedBook
    });
});

// ============= MEMBER ROUTES =============

// Get all members
app.get('/api/members', (req, res) => {
    res.json({
        success: true,
        count: members.length,
        data: members
    });
});

// Get single member by ID
app.get('/api/members/:id', (req, res) => {
    const member = members.find(m => m.id === parseInt(req.params.id));

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Member not found'
        });
    }

    res.json({
        success: true,
        data: member
    });
});

// Add new member (Form handling)
app.post('/api/members', (req, res) => {
    const { name, email, phone, membershipDate } = req.body;

    // Validation
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    if (!phone || phone.trim() === '') {
        errors.push('Phone is required');
    } else if (!/^[0-9]{10}$/.test(phone)) {
        errors.push('Phone must be 10 digits');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    // Check if email already exists
    const existingMember = members.find(m => m.email === email);
    if (existingMember) {
        return res.status(400).json({
            success: false,
            error: 'A member with this email already exists'
        });
    }

    const newMember = {
        id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        membershipDate: membershipDate || new Date().toISOString().split('T')[0],
        borrowedBooks: []
    };

    members.push(newMember);

    res.status(201).json({
        success: true,
        message: 'Member registered successfully',
        data: newMember
    });
});

// Update member (Form handling)
app.put('/api/members/:id', (req, res) => {
    const memberId = parseInt(req.params.id);
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Member not found'
        });
    }

    const { name, email, phone } = req.body;
    const errors = [];

    if (name && name.trim() === '') {
        errors.push('Name cannot be empty');
    }

    if (email && email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
        errors.push('Phone must be 10 digits');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    const currentMember = members[memberIndex];
    const updatedMember = {
        ...currentMember,
        name: name ? name.trim() : currentMember.name,
        email: email ? email.trim().toLowerCase() : currentMember.email,
        phone: phone ? phone.trim() : currentMember.phone
    };

    members[memberIndex] = updatedMember;

    res.json({
        success: true,
        message: 'Member updated successfully',
        data: updatedMember
    });
});

// Delete member
app.delete('/api/members/:id', (req, res) => {
    const memberId = parseInt(req.params.id);
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Member not found'
        });
    }

    const member = members[memberIndex];

    // Check if member has borrowed books
    if (member.borrowedBooks.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Cannot delete member with borrowed books',
            borrowedBooks: member.borrowedBooks
        });
    }

    const deletedMember = members.splice(memberIndex, 1)[0];

    res.json({
        success: true,
        message: 'Member deleted successfully',
        data: deletedMember
    });
});

// ============= BORROW/RETURN ROUTES =============

// Borrow a book (Form handling)
app.post('/api/borrow', (req, res) => {
    const { memberId, bookId } = req.body;

    const errors = [];

    if (!memberId) {
        errors.push('Member ID is required');
    }

    if (!bookId) {
        errors.push('Book ID is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    const member = members.find(m => m.id === parseInt(memberId));
    const book = books.find(b => b.id === parseInt(bookId));

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Member not found'
        });
    }

    if (!book) {
        return res.status(404).json({
            success: false,
            error: 'Book not found'
        });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
        return res.status(400).json({
            success: false,
            error: 'No copies available for this book'
        });
    }

    // Check if member already borrowed this book
    if (member.borrowedBooks.includes(book.id)) {
        return res.status(400).json({
            success: false,
            error: 'Member has already borrowed this book'
        });
    }

    // Create borrow record
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days borrowing period

    const newRecord = {
        id: borrowRecords.length > 0 ? Math.max(...borrowRecords.map(r => r.id)) + 1 : 1,
        memberId: member.id,
        bookId: book.id,
        borrowDate: borrowDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        returnDate: null,
        status: 'borrowed'
    };

    borrowRecords.push(newRecord);

    // Update book availability
    book.availableCopies -= 1;

    // Update member's borrowed books
    member.borrowedBooks.push(book.id);

    res.status(201).json({
        success: true,
        message: 'Book borrowed successfully',
        data: {
            record: newRecord,
            book: {
                title: book.title,
                author: book.author
            },
            member: {
                name: member.name,
                email: member.email
            },
            dueDate: newRecord.dueDate
        }
    });
});

// Return a book (Form handling)
app.post('/api/return', (req, res) => {
    const { memberId, bookId } = req.body;

    const errors = [];

    if (!memberId) {
        errors.push('Member ID is required');
    }

    if (!bookId) {
        errors.push('Book ID is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    const member = members.find(m => m.id === parseInt(memberId));
    const book = books.find(b => b.id === parseInt(bookId));

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Member not found'
        });
    }

    if (!book) {
        return res.status(404).json({
            success: false,
            error: 'Book not found'
        });
    }

    // Find active borrow record
    const recordIndex = borrowRecords.findIndex(
        r => r.memberId === member.id &&
             r.bookId === book.id &&
             r.status === 'borrowed'
    );

    if (recordIndex === -1) {
        return res.status(400).json({
            success: false,
            error: 'No active borrow record found for this member and book'
        });
    }

    // Update record
    const record = borrowRecords[recordIndex];
    record.returnDate = new Date().toISOString().split('T')[0];
    record.status = 'returned';

    // Check if late
    const dueDate = new Date(record.dueDate);
    const returnDate = new Date(record.returnDate);
    const isLate = returnDate > dueDate;
    const daysLate = isLate ? Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24)) : 0;

    // Update book availability
    book.availableCopies += 1;

    // Update member's borrowed books
    member.borrowedBooks = member.borrowedBooks.filter(id => id !== book.id);

    res.json({
        success: true,
        message: 'Book returned successfully',
        data: {
            record: record,
            book: {
                title: book.title,
                author: book.author
            },
            member: {
                name: member.name,
                email: member.email
            },
            isLate: isLate,
            daysLate: daysLate,
            fine: isLate ? daysLate * 5 : 0 // $5 per day late fee
        }
    });
});

// Get all borrow records
app.get('/api/borrow-records', (req, res) => {
    const enrichedRecords = borrowRecords.map(record => {
        const member = members.find(m => m.id === record.memberId);
        const book = books.find(b => b.id === record.bookId);

        return {
            ...record,
            memberName: member ? member.name : 'Unknown',
            bookTitle: book ? book.title : 'Unknown'
        };
    });

    res.json({
        success: true,
        count: enrichedRecords.length,
        data: enrichedRecords
    });
});

// ============= ROOT & INFO ROUTES =============

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Library Management System API',
        version: '1.0.0',
        apiKey: 'Required in x-api-key header',
        validApiKey: 'LIB-API-KEY-2024-SECRET-12345',
        endpoints: {
            books: {
                'GET /api/books': 'Get all books',
                'GET /api/books/:id': 'Get single book',
                'POST /api/books': 'Add new book',
                'PUT /api/books/:id': 'Update book',
                'DELETE /api/books/:id': 'Delete book'
            },
            members: {
                'GET /api/members': 'Get all members',
                'GET /api/members/:id': 'Get single member',
                'POST /api/members': 'Register new member',
                'PUT /api/members/:id': 'Update member',
                'DELETE /api/members/:id': 'Delete member'
            },
            borrowing: {
                'POST /api/borrow': 'Borrow a book',
                'POST /api/return': 'Return a book',
                'GET /api/borrow-records': 'Get all borrow records'
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.path}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║       LIBRARY MANAGEMENT SYSTEM API - SERVER STARTED           ║
╚════════════════════════════════════════════════════════════════╝

Server running on: http://localhost:${PORT}

API Key: LIB-API-KEY-2024-SECRET-12345

POSTMAN TESTING INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Add API Key to Headers:
   Key: x-api-key
   Value: LIB-API-KEY-2024-SECRET-12345

2. Available Endpoints:

   📚 BOOKS:
   • GET    http://localhost:${PORT}/api/books
   • GET    http://localhost:${PORT}/api/books/1
   • POST   http://localhost:${PORT}/api/books
   • PUT    http://localhost:${PORT}/api/books/1
   • DELETE http://localhost:${PORT}/api/books/1

   👥 MEMBERS:
   • GET    http://localhost:${PORT}/api/members
   • GET    http://localhost:${PORT}/api/members/1
   • POST   http://localhost:${PORT}/api/members
   • PUT    http://localhost:${PORT}/api/members/1
   • DELETE http://localhost:${PORT}/api/members/1

   📖 BORROWING:
   • POST   http://localhost:${PORT}/api/borrow
   • POST   http://localhost:${PORT}/api/return
   • GET    http://localhost:${PORT}/api/borrow-records

3. Sample POST Request Body (Add Book):
   {
     "title": "The Hobbit",
     "author": "J.R.R. Tolkien",
     "isbn": "978-0-547-92822-7",
     "category": "Fantasy",
     "publishYear": 1937,
     "copies": 5
   }

4. Sample POST Request Body (Add Member):
   {
     "name": "Alice Johnson",
     "email": "alice@email.com",
     "phone": "5551234567",
     "membershipDate": "2024-11-04"
   }

5. Sample POST Request Body (Borrow Book):
   {
     "memberId": 1,
     "bookId": 2
   }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to accept requests!
    `);
});

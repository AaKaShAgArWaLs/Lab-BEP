import React, { useState } from 'react';
import './StudentRegistrationForm.css';

function StudentRegistrationForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        course: '',
        year: '',
        subjects: [],
        address: '',
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const availableSubjects = [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Computer Science',
        'English'
    ];

    const courses = [
        'Computer Science',
        'Information Technology',
        'Electronics',
        'Mechanical Engineering',
        'Civil Engineering'
    ];

    const years = [
        'First Year',
        'Second Year',
        'Third Year',
        'Fourth Year'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'subjects') {
            const updatedSubjects = checked
                ? [...formData.subjects, value]
                : formData.subjects.filter(subject => subject !== value);

            setFormData(prev => ({
                ...prev,
                subjects: updatedSubjects
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        // Date of Birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        } else {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 16 || age > 100) {
                newErrors.dateOfBirth = 'Age must be between 16 and 100 years';
            }
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = 'Please select your gender';
        }

        // Course validation
        if (!formData.course) {
            newErrors.course = 'Please select a course';
        }

        // Year validation
        if (!formData.year) {
            newErrors.year = 'Please select your year';
        }

        // Subjects validation
        if (formData.subjects.length === 0) {
            newErrors.subjects = 'Please select at least one subject';
        } else if (formData.subjects.length > 6) {
            newErrors.subjects = 'You can select maximum 6 subjects';
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        } else if (formData.address.trim().length < 10) {
            newErrors.address = 'Address must be at least 10 characters';
        }

        // Terms validation
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setSubmittedData(formData);
            setSubmitted(true);
            console.log('Form submitted successfully:', formData);
        } else {
            console.log('Form has errors');
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setSubmittedData(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            gender: '',
            course: '',
            year: '',
            subjects: [],
            address: '',
            agreeTerms: false
        });
        setErrors({});
    };

    if (submitted && submittedData) {
        return (
            <div className="container">
                <div className="success-message">
                    <h3>Registration Successful!</h3>
                    <p>Thank you for registering. Your information has been submitted.</p>

                    <div className="student-data">
                        <h4>Submitted Information:</h4>
                        <p><strong>Name:</strong> {submittedData.firstName} {submittedData.lastName}</p>
                        <p><strong>Email:</strong> {submittedData.email}</p>
                        <p><strong>Phone:</strong> {submittedData.phone}</p>
                        <p><strong>Date of Birth:</strong> {submittedData.dateOfBirth}</p>
                        <p><strong>Gender:</strong> {submittedData.gender}</p>
                        <p><strong>Course:</strong> {submittedData.course}</p>
                        <p><strong>Year:</strong> {submittedData.year}</p>
                        <p><strong>Subjects:</strong> {submittedData.subjects.join(', ')}</p>
                        <p><strong>Address:</strong> {submittedData.address}</p>
                    </div>

                    <button className="reset-btn" onClick={handleReset}>
                        Register Another Student
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Student Registration Form</h1>
            <p className="subtitle">Fill out all required fields to complete your registration</p>

            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={errors.firstName ? 'input-error' : ''}
                        placeholder="Enter your first name"
                    />
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={errors.lastName ? 'input-error' : ''}
                        placeholder="Enter your last name"
                    />
                    {errors.lastName && <span className="error">{errors.lastName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'input-error' : ''}
                        placeholder="student@example.com"
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'input-error' : ''}
                        placeholder="1234567890"
                    />
                    {errors.phone && <span className="error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={errors.dateOfBirth ? 'input-error' : ''}
                    />
                    {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
                </div>

                <div className="form-group">
                    <label>Gender *</label>
                    <div className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={handleChange}
                            />
                            <label htmlFor="male">Male</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={handleChange}
                            />
                            <label htmlFor="female">Female</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="other"
                                name="gender"
                                value="Other"
                                checked={formData.gender === 'Other'}
                                onChange={handleChange}
                            />
                            <label htmlFor="other">Other</label>
                        </div>
                    </div>
                    {errors.gender && <span className="error">{errors.gender}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="course">Course *</label>
                    <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className={errors.course ? 'input-error' : ''}
                    >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                    {errors.course && <span className="error">{errors.course}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="year">Year *</label>
                    <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className={errors.year ? 'input-error' : ''}
                    >
                        <option value="">Select year</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    {errors.year && <span className="error">{errors.year}</span>}
                </div>

                <div className="form-group">
                    <label>Subjects * (Select at least one)</label>
                    <div className="checkbox-group">
                        {availableSubjects.map(subject => (
                            <div key={subject} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={subject}
                                    name="subjects"
                                    value={subject}
                                    checked={formData.subjects.includes(subject)}
                                    onChange={handleChange}
                                />
                                <label htmlFor={subject}>{subject}</label>
                            </div>
                        ))}
                    </div>
                    {errors.subjects && <span className="error">{errors.subjects}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? 'input-error' : ''}
                        rows="4"
                        placeholder="Enter your complete address"
                    />
                    {errors.address && <span className="error">{errors.address}</span>}
                </div>

                <div className="form-group">
                    <div className="checkbox-item">
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                        />
                        <label htmlFor="agreeTerms">
                            I agree to the terms and conditions *
                        </label>
                    </div>
                    {errors.agreeTerms && <span className="error">{errors.agreeTerms}</span>}
                </div>

                <button type="submit">
                    Register Student
                </button>
            </form>
        </div>
    );
}

export default StudentRegistrationForm;

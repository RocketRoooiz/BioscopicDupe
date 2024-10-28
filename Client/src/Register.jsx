
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import './styles/Register.css'

function Register() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        sex: "",
        phoneNumber: "",
        username: "",
        email: "",
        password: "",
        prc: ""
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Custom validation for names
        if (name === "firstName" || name === "middleName" || name === "lastName") {
            if (/^[A-Za-z]{2,}$/.test(value)) {
                e.target.setCustomValidity('');
            } else {
                e.target.setCustomValidity('Please provide a valid name.')
            }
        }

        if (name === "phoneNumber") {
            if (/^09\d{9}$/.test(value)) {
                e.target.setCustomValidity('');
            } else {
                e.target.setCustomValidity('Please provide your phone number.');
            }
        }
    };

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        setValidated(true);

        if (form.checkValidity()) {
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    navigate('/home');
                } else {
                    navigate('/home')
                    console.error('Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            console.log("Form data submitted: ", formData);
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="w-50">
                <h1 className="text-center fw-bold mb-3">Register Account</h1>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name:</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control
                                    required
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">Please provide a valid first name.</Form.Control.Feedback>
                            </Col>
                            <Col>
                                <Form.Control
                                    required
                                    type="text"
                                    name="middleName"
                                    placeholder="Middle Name"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">Please provide a valid middle name.</Form.Control.Feedback>
                            </Col>
                            <Col>
                                <Form.Control
                                    required
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">Please provide a valid last name.</Form.Control.Feedback>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sex</Form.Label>
                        <Form.Control as="select" name="sex" value={formData.sex} onChange={handleChange} required>
                            <option value="">Choose...</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">Please select your sex.</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            required
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Please provide your phone number.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Please provide a username.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            name="email"
                            placeholder="username@bioscopic.com"
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={validated && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)}
                        />
                        <Form.Control.Feedback type="invalid">Please provide a valid email address.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            name="password"
                            minLength="8"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Please provide a password with at least 8 characters.</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>PRC License No. (Optional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="prc"
                            value={formData.prc}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center mb-3">
                        <Button type="submit" className="btn btn-primary btn-lg">REGISTER</Button>
                    </div>
                </Form>
                <div className="text-center mb-3">
                    Already have an account? <a href="/">Login</a>
                </div>
            </div>
        </div>
    );
}
export default Register
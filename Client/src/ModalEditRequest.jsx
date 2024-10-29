import ModalShowPDF from "./modalShowPDF.jsx";

import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

function ModalEditRequest(props) {
  const [show, setShow] = useState(props.show); // Initialize based on props
  const [testOptions, setTestOptions] = useState([]); // State to hold users from MongoDB
  const [users, setUsers] = useState([{ prcno: "" }]); // State to hold users from MongoDB
  
  useEffect(() => {
    const fetchTestOptions = async () => {
        try {
            const response = await fetch('http://localhost:4000/testoptions');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTestOptions(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchTestOptions();
  }, []);
  
  // Fetch user data from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/users'); // Adjust the URL as necessary
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchUsers();
  }, []);

  const handleClose = () => {
    setShow(false);
    props.handleClose(); // Call the passed in handleClose function from parent
  };

  const tests = [];
  const splitTests = props.tests.split(", ");
  for (let i = 0; i < splitTests.length; i++) {
    const matchingTest = testOptions.find(test => test.name === splitTests[i]);
    if (matchingTest) {
      tests.push({ name: splitTests[i], isText: false, options: matchingTest.options});
    } else {
      tests.push({ name: splitTests[i], isText: true});
    }
  }

  const listTests = tests.map((test) => (
    <div key={test.id}>
      <Row>
        <Col>
          {test.isText ? (
            <FloatingLabel label={test.name}>
              <Form.Control type="text" placeholder="" />
            </FloatingLabel>
          ) : (
            <FloatingLabel label={test.name}>
              <Form.Select>
                {test.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          )}
        </Col>
        <Col>
          <Form.Control type="text" placeholder="" className="h-100" readOnly />
        </Col>
      </Row>
      <br />
    </div>
  ));

  const midpoint = Math.ceil(listTests.length / 2);
  const test_col1 = listTests.slice(0, midpoint);
  const test_col2 = listTests.slice(midpoint);

  const listUsers = users.map((user, index) => (
    <option key={index} value={user.name}>
      {user.name}
    </option>
  ));

  const inputRef = useRef(null);

  function handleUserChange(event) {
    const user = users.find((user) => user.name === event.target.value);
    inputRef.current.value = user.prcno;
  }

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose} // Use handleClose to handle closing
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.category}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h4>{props.patient.name}</h4>
        <h5>Patient ID: {props.patient.patientID}</h5>
        <h5>Request ID: {props.patient.requestID}</h5>
        <div>
          <Container className="px-0 my-3">
            <Row>
              <Col>{test_col1}</Col>
              <Col>{test_col2}</Col>
            </Row>
          </Container>
          <FloatingLabel label="Med Tech">
            <Form.Select onChange={handleUserChange}>
              {listUsers}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel label="PRC No" className="my-3">
            <Form.Control type="number" defaultValue={users[0].prcno} ref={inputRef} readOnly />
          </FloatingLabel>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary">Submit</Button>
        <ModalShowPDF />
      </Modal.Footer>
    </Modal>
  );
}

ModalEditRequest.propTypes = {
  patient: PropTypes.shape({
      name: PropTypes.string,
      patientID: PropTypes.number,
      requestID: PropTypes.number,
    }).isRequired,
  category: PropTypes.string.isRequired,
  tests: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired, // Add this prop type for show
  handleClose: PropTypes.func.isRequired, // Add this prop type for handleClose
};

export default ModalEditRequest;

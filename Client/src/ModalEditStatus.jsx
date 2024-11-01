import { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function ModalEditStatus({ patient, show, handleClose }) {
  const [requestStatus, setRequestStatus] = useState(patient?.requestStatus || "");
  const [paymentStatus, setPaymentStatus] = useState(patient?.paymentStatus || "");
  const [remarks, setRemarks] = useState(patient?.remarks || "");

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/requests/${patient.requestID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: requestStatus,
          payStatus: paymentStatus,
          remarks,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update request");
      }
  
      handleClose(); // Close modal after successful save

      window.location.reload(); // Reload the page

    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  return (
    <Modal size="xs" show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {patient && (
          <>
            <h4>{patient.name}</h4>
            <h5>Patient ID: {patient.patientID}</h5>
            <h5>Request ID: {patient.requestID}</h5>
            <Form.Label className="mt-3">Request Status</Form.Label>
            <Form.Select value={requestStatus} onChange={(e) => setRequestStatus(e.target.value)}>
              <option>Requested</option>
              <option>In Progress</option>
              <option>Completed</option>
            </Form.Select>
            <Form.Label className="mt-3">Payment Status</Form.Label>
            <Form.Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option>Paid</option>
              <option>Unpaid</option>
            </Form.Select>
            <Form.Group className="mt-3">
              <Form.Label>Medical Technologist's Remarks</Form.Label>
              <Form.Control as="textarea" rows={5} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalEditStatus.propTypes = {
  patient: PropTypes.shape({
    name: PropTypes.string,
    patientID: PropTypes.number,
    requestID: PropTypes.number,
    requestStatus: PropTypes.string,
    paymentStatus: PropTypes.string,
    remarks: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalEditStatus;

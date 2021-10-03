import React, { useState, useEffect } from "react";
import { Modal, Button, Container, Form } from "react-bootstrap";
import validator from "validator";

function CustomModal({ result, showModal, handleClose }) {
  const [price, setPrice] = useState(0);
  const [showInvalidError, setInvalidError] = useState(false);
  const [showInsufficiantError, setInsufficiantError] = useState(false);
  const [amount, setAmount] = useState("");

  const getPrice = async (symbol) => {
    try {
      const price = await fetch(
        `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_5888b79bda024f418a152333805dab13`
      )
        .then((response) => response.json())
        .then((data) => {
          return data.latestPrice;
        });
      setPrice(price);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPrice(result.symbol);
  }, [result]);

  return (
    <Modal
      key={result.symbol}
      show={showModal}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="d-flex align-items-center justify-content-center flex-column">
        <h6>
          {result.symbol} - {result.name}
        </h6>
        <h6>Price: ${price}</h6>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>

            <Form.Control
              required
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              type="text"
              placeholder="Enter amount"
            />
          </Form.Group>

          <h6
            style={{
              display: showInvalidError ? "block" : "none",
              fontWeight: "bold",
              color: "#DD3544",
            }}
          >
            Please enter a valid amount
          </h6>
          <h6
            style={{
              display: showInsufficiantError ? "block" : "none",
              fontWeight: "bold",
              color: "#DD3544",
            }}
          >
            You do not have sufficient funds
          </h6>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              //Validate amount
              setInsufficiantError(false);
              setInvalidError(false);
              if (!validator.isInt(amount)) {
                setInvalidError(true);
              } else if (parseInt(amount) * price > 10000) {
                setInsufficiantError(true);
              } else {
              }
            }}
            style={{ width: "100%" }}
            type="submit"
          >
            Buy
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CustomModal;

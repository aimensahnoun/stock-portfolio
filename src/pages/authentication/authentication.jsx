import React, { useState } from "react";
import { Card, Container, Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";

import { connect } from "react-redux";
import { setCurrentUser } from "../../redux/user/user.actions";

function Authentication({ setCurrentUser }) {
  const [fullName, setFullName] = useState("");
  const [showError, setShowError] = useState(false);

  const toggleShowError = () => setShowError(!showError);
  return (
    <Container className="pageContainer d-flex justify-content-center align-items-center">
      {/* Changing Tab Title */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Authentication</title>
      </Helmet>

      <Card
        style={{ width: "25rem" }}
        className="shadow p-1  bg-white rounded "
      >
        <Card.Body style={{ width: "100%" }}>
          <Card.Title>Register</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>

              <Form.Control
                required
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                type="text"
                placeholder="Enter full name"
              />
            </Form.Group>
            <h6
              style={{
                display: showError ? "block" : "none",
                fontWeight: "bold",
                color: "#DD3544",
              }}
            >
              Please enter your full Name
            </h6>
            <Button
              variant="primary"
              onClick={(e) => {
                toggleShowError();
                e.preventDefault();
                //Validate full name
                if (
                  fullName === "" ||
                  fullName.split(" ").length < 2 ||
                  fullName.split(" ")[1] === ""
                ) {
                  toggleShowError();
                } else {
                  const userData = {
                    fullName: fullName,
                    budget: "10000",
                  };
                  //Saving data to local storage
                  localStorage.setItem("userData", JSON.stringify(userData));

                  setCurrentUser(userData);
                }
              }}
              type="submit"
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (userData) => dispatch(setCurrentUser(userData)),
});

export default connect(null, mapDispatchToProps)(Authentication);

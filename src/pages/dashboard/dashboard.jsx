import React from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { setCurrentUser } from "../../redux/user/user.actions";

function Dashboard({ currentUser, setCurrentUser }) {
  const logout = () => {
    localStorage.removeItem("userData");
    setCurrentUser(null);
  };

  return (
    <Container className="pageContainer">
      {/* Changing Tab Title */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dashboard</title>
      </Helmet>

      {/* Navbar Section */}
      <Container
        style={{ width: "100%", height: "20vh" }}
        className="d-flex align-items-center justify-content-between "
      >
        <h3>Portfolio</h3>

        <div style={{ textAlign: "center" }}>
          <h6>Total Worth : ${currentUser.budget}</h6>
          <h6>Cash Balance : ${currentUser.budget}</h6>
        </div>

        <div style={{ textAlign: "center" }}>
          <h6>Welcome, {currentUser.fullName}</h6>
          <h6
            style={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={logout}
          >
            Logout
          </h6>
        </div>
      </Container>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (userData) => dispatch(setCurrentUser(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

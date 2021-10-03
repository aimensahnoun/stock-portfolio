import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Authentication from "./pages/authentication/authentication";

import { setCurrentUser } from "./redux/user/user.actions";

import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";

function App({ currentUser, setCurrentUser }) {
  const [isLoading, setIsLoading] = useState(true);

  //Checking if user has an account
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || null;
    if (userData) {
      setCurrentUser(userData);
    }
    setIsLoading(false);
  }, [setCurrentUser]);

  return isLoading ? (
    <Container className="d-flex align-items-center justify-content-center pageContainer">
      <Spinner animation="grow" />
    </Container>
  ) : (
    <Switch>
      <Route
        exact
        path="/"
        render={() =>
          currentUser ? <Redirect to="/dashboard" /> : <Authentication />
        }
      />

      {/* <Route
        exact
        path="/dashboard"
        render={() =>
          !currentUser ? <Redirect to="/authentication" /> : <Dashboard />
        }
      /> */}
    </Switch>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (userData) => dispatch(setCurrentUser(userData)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);

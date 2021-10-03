import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Authentication from "./pages/authentication/authentication";

import { setCurrentUser } from "./redux/user/user.actions";
import { setPortfolio } from "./redux/porfolio/portfolio.actions";

import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import Dashboard from "./pages/dashboard/dashboard";

function App({ currentUser, setCurrentUser, portfolio, setPortfolio }) {
  const [isLoading, setIsLoading] = useState(true);

  const getPrice = async (symbol) => {
    try {
      const price = await fetch(
        `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_5888b79bda024f418a152333805dab13`
      )
        .then((response) => response.json())
        .then((data) => {
          return data.latestPrice;
        });
      return price;
    } catch (e) {
      console.log(e);
    }
  };

  //Updating prices every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const updatePrices = async () => {
    if (currentUser != null) {
      let port = portfolio;
      portfolio.forEach(async (stock) => {
        const price = await getPrice(stock.symbol);

        const existant = portfolio.find(
          (stock) => stock.symbol === stock.symbol
        );
        const index = portfolio.findIndex(
          (stock) => stock.symbol === existant.symbol
        );
        existant.value = (parseInt(stock.amount) * price).toString();

        port[index] = existant;
      });

      var userData = {
        ...currentUser,
        portfolio: port,
      };
      setPortfolio(port);

      localStorage.setItem("userData", JSON.stringify(userData));
    }
  };

  //Checking if user has an account
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || null;
    if (userData) {
      const user = { budget: userData.budget, fullName: userData.fullName };
      setCurrentUser(user);
      setPortfolio(userData.portfolio);
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

      <Route
        exact
        path="/dashboard"
        render={() => (!currentUser ? <Redirect to="/" /> : <Dashboard />)}
      />
    </Switch>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  portfolio: state.portfolio.portfolio,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (userData) => dispatch(setCurrentUser(userData)),
  setPortfolio: (stockData) => dispatch(setPortfolio(stockData)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);

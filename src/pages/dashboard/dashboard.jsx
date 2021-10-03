import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  FormControl,
  InputGroup,
  Table,
  Button,
} from "react-bootstrap";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { setCurrentUser } from "../../redux/user/user.actions";
import { setPortfolio } from "../../redux/porfolio/portfolio.actions";
import CustomModal from "../../components/customModal/custom_modal";

function Dashboard({ currentUser, setCurrentUser, setPortfolio, portfolio }) {
  const logout = () => {
    localStorage.removeItem("userData");
    setCurrentUser(null);
    setPortfolio([]);
  };
  const [searchValue, setSearchValue] = useState("");
  //Used to show the results from the search bar
  const [showResults, setShowResults] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  //Open Search Modal
  const [showModal, setShowModal] = useState(false);
  //Open Portfolio Modal
  const [showPortModal, setShowPortModal] = useState(false);
  //Index for search
  const [dataIndex, setDataIndex] = useState(0);
  //Index for portfolio
  const [portIndex, setPortIndex] = useState("");
  const [totalWorth, setTotalWorth] = useState(0);
  const [isChecked, setIsChecked] = useState("");
  const [isBuy, setIsBuy] = useState(true);

  const getStock = (stockSymbol) => {
    return portfolio.find((stock) => stock.symbol === stockSymbol);
  };

  const calculateTotal = () => {
    let total = portfolio.reduce((acc, stock) => {
      return acc + parseInt(stock.value);
    }, 0);

    setTotalWorth(total + parseInt(currentUser.budget));
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  //Calculates the total worth based on changes in the portfolio
  useEffect(() => {
    calculateTotal();
  }, [portfolio]);

  //Used in order to avoid calling the api everytime the user types a letter
  useEffect(() => {
    if (searchValue.length > 0) {
      try {
        const delayDebounceFn = setTimeout(() => {
          fetch(
            `https://api.nasdaq.com/api/autocomplete/slookup/10?search=${searchValue}`
          )
            .then((response) => response.json())
            .then((data) => setApiResults(data.data));
        }, 200);

        if (apiResults.length > 0) {
          setShowResults(true);
        }
        return () => clearTimeout(delayDebounceFn);
      } catch (err) {
        console.log(err);
      }
    } else {
      setShowResults(false);
    }
  }, [searchValue]);

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
          <h6>Total Worth : ${totalWorth}</h6>
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

      {/* Search Bar */}
      <Container className="position-absolute">
        <Form>
          <InputGroup className="mb-2">
            <InputGroup.Text>🔍</InputGroup.Text>
            <FormControl
              id="inlineFormInputGroup"
              placeholder="Funds"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              on
              onSubmit={(e) => {
                e.preventDefault();
              }}
            />
          </InputGroup>
        </Form>

        {/* Search Results */}
        <Container
          className="overflow-auto"
          style={{
            position: "absolute",
            width: "92%",
            marginTop: "-.5rem",
            left: 0,
            right: 0,
            marginLeft: "auto",
            marginRight: "auto",
            height: "30vh",
            backgroundColor: "#f5f5f5",
            zIndex: "1",
            display: showResults ? "block" : "none",
          }}
        >
          {apiResults.map((result, index) => {
            return (
              <>
                <div
                  className="d-flex justify-content-center"
                  style={{ padding: "1.5rem", cursor: "pointer" }}
                  key={result.symbol}
                  onClick={() => {
                    setDataIndex(index);
                    handleShow();
                  }}
                >
                  <h6>{result.symbol} - </h6>
                  <h6>{result.name}</h6>
                </div>

                <hr
                  style={{
                    width: "100%",
                    marginTop: "-.5rem",
                    marginBottom: "-.5rem",
                  }}
                />
              </>
            );
          })}
        </Container>

        {/* Table Section*/}

        <Container style={{ marginTop: "2rem" }}>
          <Table>
            <thead>
              <tr>
                <th></th>
                <th>Symbol</th>
                <th>Name</th>
                <th>Stocks</th>
                <th>Current Value</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((stock, index) => {
                return (
                  <tr key={stock.symbol}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isChecked === stock.symbol ? true : false}
                        onClick={(e) => {
                          if (e.target.checked) {
                            setIsChecked(stock.symbol);
                          } else {
                            setIsChecked("");
                          }
                        }}
                      />
                    </td>
                    <td>{stock.symbol}</td>
                    <td>{stock.name}</td>
                    <td>{stock.amount}</td>
                    <td>${stock.value}</td>
                    <td>
                      <Button
                        style={{ width: "7rem" }}
                        variant="success"
                        disabled={isChecked != stock.symbol ? true : false}
                        onClick={() => {
                          setPortIndex(stock.symbol);
                          setIsBuy(true);
                          setShowPortModal(true);
                        }}
                      >
                        Buy
                      </Button>
                    </td>
                    <td>
                      <Button
                        style={{ width: "7rem" }}
                        onClick={() => {
                          setPortIndex(stock.symbol);
                          setIsBuy(false);
                          setShowPortModal(true);
                        }}
                        variant="danger"
                        disabled={isChecked != stock.symbol ? true : false}
                      >
                        Sell
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </Container>
      {apiResults.length > 0 ? (
        <CustomModal
          result={apiResults[dataIndex]}
          showModal={showModal}
          handleClose={handleClose}
          isBuy={true}
        />
      ) : null}
      {portfolio.length > 0 && portIndex != "" ? (
        <CustomModal
          result={getStock(portIndex)}
          showModal={showPortModal}
          handleClose={() => {
            setShowPortModal(false);
          }}
          isBuy={isBuy}
        />
      ) : null}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  portfolio: state.portfolio.portfolio,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (userData) => dispatch(setCurrentUser(userData)),
  setPortfolio: (portfolio) => dispatch(setPortfolio(portfolio)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

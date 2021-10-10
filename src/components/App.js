import "../App.css";
import React from "react";
import { Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Cart from "./Cart/Cart";
import Default from "./Default";
import Details from "./Details";
import ProductList from "./ProductList";
import Modal from "./Modal";

function App() {
  return (
    <React.Fragment>
      <Navbar></Navbar>
      <Switch>
        <Route exact path="/" component={ProductList}></Route>
        <Route path="/details" component={Details}></Route>
        <Route path="/cart" component={Cart}></Route>
        <Route component={Default}></Route>
      </Switch>
      <Modal></Modal>
    </React.Fragment>
  );
}

export default App;

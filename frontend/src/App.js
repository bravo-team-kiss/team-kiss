import * as React from "react";
import { Outlet, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      <h1>Bookkeeper!</h1>
      <Link to="/homepage">Homepage</Link>
    </div>
  );
}

export default App;

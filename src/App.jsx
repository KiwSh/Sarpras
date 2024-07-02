// App.js
import React from "react";
import { Toaster } from "react-hot-toast";
import Routes from "./routes/index";

function App() {
  return (
    <div>
      <Routes />
      <Toaster />
    </div>
  );
}

export default App;
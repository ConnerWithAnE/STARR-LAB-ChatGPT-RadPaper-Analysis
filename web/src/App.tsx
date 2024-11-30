import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";

function App() {
    //const [count, setCount] = useState(0);

    return (
    
    <BrowserRouter>
      <Routes>
        <Route 
          path="/upload"
          //element={}
        ></Route>
        <Route
          path="/modify"
          //element={}
        ></Route>   
      </Routes>
    
    </BrowserRouter>
    )
}

export default App;

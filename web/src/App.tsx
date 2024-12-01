import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import CASCallback from "./auth/CASCallback";
import ProtectedRoute from "./auth/ProtectedRoute";
import UploadPage from "./pages/UploadPage";
import ModifyPage from "./pages/ModifyPage";

function App() {
    //const [count, setCount] = useState(0);

    return (
    
    <BrowserRouter>
      <Routes>
        {/* Unprotected routes */}
        <Route path="/cas-callback" element={<CASCallback />} />
	        
        <Route 
          path="/"
          element={
            <ProtectedRoute>
                <div>Hello</div>
            </ProtectedRoute>
          }
        ></Route>
        {/* Protected Routes */}
        <Route 
          path="/upload"
          element={
            <ProtectedRoute>
                <UploadPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/modify"
          element={
            <ProtectedRoute>
                <ModifyPage />
            </ProtectedRoute>
          }
        ></Route>   
      </Routes>
    
    </BrowserRouter>
    )
}

export default App;

import { useState as _useState } from "react";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import CASCallback from "./auth/CASCallback";
import _ProtectedRoute from "./auth/ProtectedRoute";
import UploadPage from "./pages/UploadPage";
import ModifyPage from "./pages/ModifyPage";
import Nav from "./components/nav-bar/nav-bar";
import FrontPage from "./pages/FrontPage";
import UploadSelectionPage from "./pages/UploadSelectionPage";
import DatabaseEntryPreviewPage from "./pages/DatabaseEntryPreviewPage";
import { TableDataFormProvider } from "./DataContext";

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

function Main() {
  const location = useLocation();

  // Check if the current path is `/` (FrontPage)
  const showNav = location.pathname !== "/";

  return (
    <div className="flex flex-col h-screen bg-white">
      {showNav && <Nav />}
      <div className="flex-grow overflow-auto bg-white">
        <Routes>
          {/* Unprotected routes */}
          <Route path="/" element={<FrontPage />} />
          <Route path="/cas-callback" element={<CASCallback />} />

          {/* Protected Routes */}
          <Route
            path="/upload"
            element={
              // <ProtectedRoute>
              <UploadPage />
              // </ProtectedRoute>
            }
          />
          <Route path="/upload-selection" element={<UploadSelectionPage />} />
          <Route
            path="/upload/edit"
            element={
              <TableDataFormProvider>
                <DatabaseEntryPreviewPage />
              </TableDataFormProvider>
            }
          ></Route>
          <Route
            path="/modify"
            element={
              // <ProtectedRoute>
              <ModifyPage />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

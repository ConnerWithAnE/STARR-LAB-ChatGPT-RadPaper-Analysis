import { useState as _useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import CASCallback from "./auth/CASCallback";
import ProtectedRoute from "./auth/ProtectedRoute";
import UploadPage from "./pages/UploadPage";
import ModifyPage from "./pages/ModifyPage";
import Nav from "./components/nav-bar/nav-bar";
import EditEntry from "./pages/edit-entry";

function App() {
    //const [count, setCount] = useState(0);
    return (
        <BrowserRouter>
            <div className="flex flex-col h-screen">
                <Nav />
                <div className="flex-grow overflow-auto">
                    <Routes>
                        {/* Unprotected routes */}
                        <Route path="/cas-callback" element={<CASCallback />} />

                        <Route
                            path="/"
                            element={
                                // <ProtectedRoute>
                                //     <ModifyPage />
                                // </ProtectedRoute>
                                <ModifyPage />
                            }
                        >
                            <Route
                                path="edit-entry"
                                element={<EditEntry paperData={[]} />}
                            />
                        </Route>
                        {/* Protected Routes */}
                        <Route
                            path="/upload"
                            element={
                                //<ProtectedRoute>
                                <UploadPage />
                                //</ProtectedRoute>
                            }
                        ></Route>
                        <Route
                            path="/modify"
                            element={
                                // <ProtectedRoute>
                                <ModifyPage />
                                // </ProtectedRoute>
                            }
                        >
                            <Route
                                path="edit-entry"
                                element={<EditEntry paperData={[]} />}
                            />
                        </Route>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;

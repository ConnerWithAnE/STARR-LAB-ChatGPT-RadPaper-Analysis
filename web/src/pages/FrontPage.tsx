import { useNavigate } from "react-router-dom";
import "../App.css";

function redirectToCAS() {
    const CAS_SERVER = "https://cas.usask.ca/cas";
    const FRONTEND_URL = "https://starr-lab-server.usask.ca";
    const serviceURL = `${FRONTEND_URL}/cas-callback`;

    window.location.href = `${CAS_SERVER}/login?service=${encodeURIComponent(
        serviceURL
    )}`;
}


export default function FrontPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");

    if (token) {
        navigate("/modify");
        return null; // Optional: Display a loading spinner while redirecting
    } 

    const loginClicked = () => {
        redirectToCAS();
        navigate("/modify");
    }

    return (
        <div>
            <div>
                <h1>STARR Lab Rad-Effects Database</h1>
                <p>Login</p>
                <button onClick={loginClicked}>Usask Login</button>
                <p>Unable to login? Contact the system administrator</p>
            </div>
        </div>
    )

}
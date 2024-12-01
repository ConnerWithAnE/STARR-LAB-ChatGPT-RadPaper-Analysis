function redirectToCAS() {
    const CAS_SERVER = "https://cas.usask.ca/cas";
    const FRONTEND_URL = "https://starr-lab-server.usask.ca";
    const serviceURL = `${FRONTEND_URL}/cas-callback`;

    window.location.href = `${CAS_SERVER}/login?service=${encodeURIComponent(
        serviceURL
    )}`;
}

export default function ProtectedRoute({
    children,
}: {
    children: JSX.Element;
}) {
    const token = localStorage.getItem("jwt");

    if (!token) {
        redirectToCAS(); // Redirect to CAS login if no JWT
        return null; // Optional: Display a loading spinner while redirecting
    }

    return children;
}

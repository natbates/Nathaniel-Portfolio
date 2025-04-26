import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found">
            <img src = "/images/logo.svg"></img>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button onClick={() => navigate('/')}>
                Go back to Home
            </button>
        </div>
    );
};

export default NotFound;

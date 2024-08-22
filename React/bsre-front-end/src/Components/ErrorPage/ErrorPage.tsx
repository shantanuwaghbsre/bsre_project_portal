import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Link } from 'react-router-dom';
export const ErrorPage = () => {
    return (
        <>
            <div className="container">
                <SentimentVeryDissatisfiedIcon sx={{ fontSize: 200 }} />
                <span style={{ fontSize: 30 }}>404 - Page Not Found</span>
                <p>Sorry, the page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <p>Return to <Link style={{ color: "blue" }} to={"/"}>Back</Link></p>
            </div>
        </>
    )
}
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-center px-4">
    <h1 className="text-7xl font-extrabold text-accent">404</h1>
    <p className="text-white text-lg mt-4">Page not found</p>
    <Link to="/dashboard" className="mt-6">
      <Button variant="primary">Go to Dashboard</Button>
    </Link>
  </div>
);

export default NotFoundPage;

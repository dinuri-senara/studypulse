import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    university: '',
    degree: '',
    academicYear: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        ...formData,
        academicYear: formData.academicYear ? parseInt(formData.academicYear) : null
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-soft border border-border">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-text">
            Join <span className="text-primary">StudyPulse</span>
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
            Start tracking your productivity today
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-text mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              className="appearance-none rounded-xl relative block w-full px-3 py-2.5 border border-border placeholder-gray-400 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="appearance-none rounded-xl relative block w-full px-3 py-2.5 border border-border placeholder-gray-400 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="student@university.edu"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength="8"
              className="appearance-none rounded-xl relative block w-full px-3 py-2.5 border border-border placeholder-gray-400 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">University</label>
              <input
                type="text"
                name="university"
                className="appearance-none rounded-xl relative block w-full px-3 py-2.5 border border-border placeholder-gray-400 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="MIT"
                value={formData.university}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Year</label>
              <input
                type="number"
                name="academicYear"
                className="appearance-none rounded-xl relative block w-full px-3 py-2.5 border border-border placeholder-gray-400 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="2"
                value={formData.academicYear}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Degree</label>
            <input
              type="text"
              name="degree"
              className="appearance-none rounded-xl relative block w-full px-3 py-2.5 border border-border placeholder-gray-400 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Computer Science"
              value={formData.degree}
              onChange={handleChange}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-sm"
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-text-muted">Already have an account? </span>
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

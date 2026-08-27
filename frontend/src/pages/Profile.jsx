import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, GraduationCap, School, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">My Profile</h1>
        <p className="text-text-muted">Manage your personal information</p>
      </div>

      <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center text-white text-4xl font-bold shadow-md">
            {user.fullName ? user.fullName.charAt(0) : 'U'}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text">{user.fullName}</h2>
            <p className="text-primary font-medium">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b border-border pb-2">Account Details</h3>
            
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-text-muted mr-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-muted">Email Address</p>
                <p className="text-text">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <User className="w-5 h-5 text-text-muted mr-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-muted">Full Name</p>
                <p className="text-text">{user.fullName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b border-border pb-2">Academic Information</h3>
            
            <div className="flex items-start">
              <School className="w-5 h-5 text-text-muted mr-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-muted">University</p>
                <p className="text-text">{user.university || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <GraduationCap className="w-5 h-5 text-text-muted mr-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-muted">Degree</p>
                <p className="text-text">{user.degree || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-text-muted mr-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-muted">Academic Year</p>
                <p className="text-text">{user.academicYear || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <button className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

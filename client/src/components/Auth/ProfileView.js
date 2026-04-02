import { Link } from 'react-router-dom';
import { PrimaryButton, DangerButton } from '../Common/Button';

const ProfileView = ({ user, onLogout }) => (
  <div className="text-center space-y-8 p-8 bg-white/10 backdrop-blur-xl rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
    <div className="space-y-2">
      <h2 className="text-3xl font-black text-white tracking-tight">Nice to see you!</h2>
      <p className="text-slate-400 font-medium">{user.email}</p>
    </div>

    <div className="flex flex-col gap-4">
      <div className="pt-6 space-y-4">
        {user.role === 'admin' && (
          <Link to="/admin" className="block">
            <PrimaryButton>Go to Admin Hub</PrimaryButton>
          </Link>
        )}
        <DangerButton onClick={onLogout}>
          Sign Out
        </DangerButton>
      </div>
    </div>
  </div>
);

export default ProfileView;

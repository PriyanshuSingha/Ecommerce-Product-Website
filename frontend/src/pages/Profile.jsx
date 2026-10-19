import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/authApi';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>
      {profile && (
        <div className="bg-white dark:bg-ink-800 rounded-xl shadow p-6">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
          {profile.address && <p><strong>Address:</strong> {profile.address}</p>}
        </div>
      )}
    </div>
  );
};

export default Profile;

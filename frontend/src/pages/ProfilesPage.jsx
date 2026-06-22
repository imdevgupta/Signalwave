import { useEffect, useState } from "react";

import { getProfiles, deleteProfile } from "../services/profileService";
import CreateProfileModal from "../components/common/CreateProfileModal";
import { useNavigate } from "react-router-dom";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  async function loadProfiles() {
    try {
      const data = await getProfiles();

      setProfiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this profile?");

    if (!confirmed) return;

    try {
      await deleteProfile(id);

      await loadProfiles();
    } catch (error) {
      alert(error?.response?.data?.error || "Delete failed");
    }
  }

  if (loading) {
    return <div>Loading profiles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SMTP Profiles</h1>

          <p className="text-slate-500">Manage SMTP connections</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg"
        >
          Create Profile
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4">Name</th>

              <th className="text-left p-4">Host</th>

              <th className="text-left p-4">Port</th>

              <th className="text-left p-4">Username</th>

              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {profiles.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No SMTP profiles found
                </td>
              </tr>
            )}

            {profiles.map((profile) => (
              <tr key={profile.id} className="border-t">
                <td className="p-4">{profile.name}</td>

                <td className="p-4">{profile.host}</td>

                <td className="p-4">{profile.port}</td>

                <td className="p-4">{profile.username}</td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/profiles/${profile.id}`)}
                      className="px-3 py-1 border rounded"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="px-3 py-1 border rounded text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateProfileModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadProfiles}
      />
    </div>
  );
}

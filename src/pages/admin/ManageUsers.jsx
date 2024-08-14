import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaTrash, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        setFilteredUsers(usersData); // Initially show all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'users', id));
        setUsers(users.filter(user => user.id !== id));
        setFilteredUsers(filteredUsers.filter(user => user.id !== id));
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Error!', 'There was an issue deleting the user.', 'error');
      }
    }
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    if (role === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === role));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Manage Users</h1>
      
      <div className="mb-4">
        <label htmlFor="roleFilter" className="text-lg font-semibold mr-4">Filter by role:</label>
        <select
          id="roleFilter"
          value={selectedRole}
          onChange={(e) => handleRoleFilter(e.target.value)}
          className="p-2 rounded border border-gray-300"
        >
          <option value="all">All</option>
          <option value="student">Students</option>
          <option value="lecturer">Lecturers</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Role</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="border-b">
              <td className="py-3 px-6">{user.displayName}</td>
              <td className="py-3 px-6">{user.email}</td>
              <td className="py-3 px-6">{user.role}</td>
              <td className="py-3 px-6 text-center">
                {/* <button
                  onClick={() => console.log('View user details', user.id)} // Replace with your view logic
                  className="text-blue-600 hover:text-blue-800 mr-4"
                >
                  <FaEye size={20} />
                </button> */}
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { auth, db } from '../../firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import GetStarted from '../../assets/images/GetStarted.jpg';
import { FaSpinner } from 'react-icons/fa6';

const UpdateProfile = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(''); // State for the first name
  const navigate = useNavigate();
  
  // Fetch and populate the user's current data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFirstName(userData.firstName); // Set the first name in the state
            setValue('firstName', userData.firstName);
            setValue('lastName', userData.lastName);
            setValue('email', userData.email);
            setValue('phone', userData.phone);
            setValue('department', userData.department);
          }
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = auth.currentUser;

      if (user) {
        // Update Firebase Authentication profile
        await updateProfile(user, { displayName: `${data.firstName} ${data.lastName}` });

        // Update Firestore with new profile data
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          displayName: `${data.firstName} ${data.lastName}`
        });

        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        title: 'Logged Out',
        text: 'You have successfully logged out.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <section className='m-0 top-0 relative h-screen bottom-0'>
      <div className='fixed m-0 top-0 left-0 bottom-0 -z-20 right-0 h-screen'>
        <img src={GetStarted} alt="" className='h-full w-screen' />
      </div>
      <h1 className='text-center mt-12 font-header font-bold text-2xl text-accent'>
        Welcome, {firstName}! You can update your profile in the form below.
      </h1>
      <form className="max-w-md rounded-xl bg-black bg-opacity-30 border border-accent mx-auto top-10 relative p-6" onSubmit={handleSubmit(onSubmit)}>
        
        {/* First Name Field */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            id="floating_first_name"
            {...register('firstName', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_first_name"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            First Name
          </label>
          {errors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
        </div>

        {/* Last Name Field */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            id="floating_last_name"
            {...register('lastName', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_last_name"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Last Name
          </label>
          {errors.lastName && <p className="text-red-500 text-xs mt-1">Last name is required</p>}
        </div>

        {/* Email Field */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            id="floating_email"
            {...register('email', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email
          </label>
          {errors.email && <p className="text-red-500 text-xs mt-1">Email is required</p>}
        </div>

        {/* Phone Field */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="tel"
            id="floating_phone"
            {...register('phone', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_phone"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Phone
          </label>
          {errors.phone && <p className="text-red-500 text-xs mt-1">Phone number is required</p>}
        </div>

        {/* Department Field */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            id="floating_department"
            {...register('department', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_department"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Department
          </label>
          {errors.department && <p className="text-red-500 text-xs mt-1">Department is required</p>}
        </div>

        <button
          type="submit"
          className="bg-accent text-white px-4 py-2 rounded-lg w-full mt-4 flex items-center justify-center disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            'Update Profile'
          )}
        </button>

        <button
          type="button"
          className="bg-red-600 text-white px-4 py-2 rounded-lg w-full mt-4"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </form>
    </section>
  );
};

export default UpdateProfile;

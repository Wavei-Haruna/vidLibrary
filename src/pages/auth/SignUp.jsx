import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, db, googleAuthProvider } from '../../firebase'; 
import GetStarted from '../../assets/images/GetStarted.jpg';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FaSpinner, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student'); // Default to 'student'
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Concatenate firstName and lastName to create displayName
      const displayName = `${data.firstName} ${data.lastName}`;

      // Update user's profile with displayName
      await updateProfile(user, { displayName });

      // Save user information to Firestore with a timestamp, including email
      await setDoc(doc(db, 'users', user.uid), {
        email: data.email, // Make sure email is saved
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        department: data.department,
        role: userType,
        displayName, // Add displayName to Firestore
        createdAt: new Date().toISOString(),
      });

      Swal.fire({
        title: 'Success!',
        text: 'Account created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Redirect based on user role
      if (userType === 'student') {
       navigate('/student-dashboard');
      } else if (userType === 'lecturer') {
       navigate('/lecturer-dashboard');
      }

      // Reset the form
      setUserType('student');
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      // Save user information to Firestore with a timestamp, including email
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email, // Make sure email is saved
        displayName: user.displayName,
        role: userType,
        createdAt: new Date().toISOString(),
      });

      Swal.fire({
        title: 'Success!',
        text: 'Signed in with Google successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Redirect based on user role
      if (userType === 'student') {
       navigate('/student-dashboard');
      } else if (userType === 'lecturer') {
       navigate('/lecturer-dashboard');
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

  const handlePasswordReset = async (email) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        title: 'Success!',
        text: 'Password reset email sent successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
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

  return (
    <section className='m-0 top-0 relative h-screen bottom-0'>
      <div className='fixed m-0 top-0 left-0 bottom-0 -z-20 right-0 h-screen'>
        <img src={GetStarted} alt="" className='h-full w-screen' />
      </div>
      <h1 className='text-center mt-12 font-header font-bold text-2xl text-accent'>Get Started</h1>
      <form className="max-w-md rounded-xl bg-black bg-opacity-30 border border-accent mx-auto top-10 relative p-6" onSubmit={handleSubmit(onSubmit)}>
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
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
          {errors.email && <p className="text-red-500 text-xs mt-1">Email is required</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            id="floating_password"
            {...register('password', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          {errors.password && <p className="text-red-500 text-xs mt-1">Password is required</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            id="floating_repeat_password"
            {...register('confirmPassword', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_repeat_password"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm password
          </label>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">Confirmation password is required</p>}
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
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
              className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First Name
            </label>
            {errors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
          </div>
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
              className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last Name
            </label>
            {errors.lastName && <p className="text-red-500 text-xs mt-1">Last name is required</p>}
          </div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            id="floating_phone"
            {...register('phone')}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_phone"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Phone Number (Optional)
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            id="floating_department"
            {...register('department')}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_department"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Department (Optional)
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="userType" className="text-white">Register as:</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full text-center p-2.5 text-white font-bold bg-accent rounded-lg flex items-center justify-center disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Sign Up'}
        </button>
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => setShowResetPassword(true)}
            className="text-blue-500 underline"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <FaGoogle /> Sign Up with Google
          </button>
        </div>
      </form>
      {showResetPassword && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-2 w-full mb-4"
              id="resetEmail"
            />
            <button
              onClick={() => handlePasswordReset(document.getElementById('resetEmail').value)}
              className="bg-blue-500 text-white p-2 rounded-lg w-full"
            >
              Send Password Reset Email
            </button>
            <button
              onClick={() => setShowResetPassword(false)}
              className="mt-4 text-blue-500 underline w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignUp;

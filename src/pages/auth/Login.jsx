import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, googleAuthProvider, db } from '../../firebase';
import GetStarted from '../../assets/images/GetStarted.jpg';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaSpinner, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Fetch the user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        Swal.fire({
          title: 'Success!',
          text: 'Logged in successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Redirect based on role
        if (role === 'student') {
          navigate('/student-dashboard');
        } else if (role === 'lecturer') {
          navigate('/lecturer-dashboard');
        } else if (role === 'admin') {
          navigate('/admin');
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        Swal.fire({
          title: 'Success!',
          text: 'Logged in with Google successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Redirect based on role
        if (role === 'student') {
          navigate('/student-dashboard');
        } else if (role === 'lecturer') {
          navigate('/lecturer-dashboard');
        } else if (role === 'admin') {
          navigate('/admin');
        }
      } else {
        // Handle the case where the user is not found in Firestore
        Swal.fire({
          title: 'Error!',
          text: 'User data not found.',
          icon: 'error',
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

  const handleResetPassword = async () => {
    if (!email) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter your email address.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        title: 'Success!',
        text: 'Password reset email sent.',
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
      <h1 className='text-center mt-12 font-header font-bold text-2xl text-accent'>Login</h1>
      <form className="max-w-md rounded-xl bg-black bg-opacity-30 border border-accent mx-auto top-10 relative p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            id="floating_email"
            {...register('email', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={(e) => setEmail(e.target.value)}
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Login'}
        </button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : (
            <>
              <FaGoogle className="mr-2" />
              Sign in with Google
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleResetPassword}
          className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Reset Password'}
        </button>
      </form>
    </section>
  );
};

export default Login;

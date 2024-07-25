import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, db } from '../../firebase'; 
import GetStarted from '../../assets/images/GetStarted.jpg';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student'); // Default to 'student'
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Save user information to Firestore with a timestamp
      await setDoc(doc(db, 'users', user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        department: data.department,
        role: userType,
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

  return (
    <section className='m-0 top-0 relative h-screen bottom-0'>
      <div className='fixed m-0 top-0 left-0 bottom-0 -z-20 right-0 h-screen'>
        <img src={GetStarted} alt="" className='h-full' />
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
              First name
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
              Last name
            </label>
            {errors.lastName && <p className="text-red-500 text-xs mt-1">Last name is required</p>}
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
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
              className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone number
            </label>
            {errors.phone && <p className="text-red-500 text-xs mt-1">Phone number is required</p>}
          </div>
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
              className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Department
            </label>
            {errors.department && <p className="text-red-500 text-xs mt-1">Department name is required</p>}
          </div>
        </div>
        <div className="mb-5">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={userType === 'student'}
              onChange={() => setUserType('student')}
            />
            <span className="ml-2">Student</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              className="form-radio"
              checked={userType === 'lecturer'}
              onChange={() => setUserType('lecturer')}
            />
            <span className="ml-2">Lecturer</span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Sign Up'}
        </button>
      </form>
    </section>
  );
};

export default SignUp;

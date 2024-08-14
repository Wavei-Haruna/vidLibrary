import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
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
      <h1 className='text-center mt-12 font-header font-bold text-2xl text-accent'>Reset Password</h1>
      <form className="max-w-md rounded-xl bg-black bg-opacity-30 border border-accent mx-auto top-10 relative p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            id="reset_email"
            {...register('email', { required: true })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="reset_email"
            className="peer-focus:font-medium absolute text-sm text-white dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
          {errors.email && <p className="text-red-500 text-xs mt-1">Email is required</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Send Reset Email'}
        </button>
      </form>
    </section>
  );
};

export default ResetPassword;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Api from '../utils/Api';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const EditProfileModal = ({ onClose, initialData, refreshKey }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData // Set initial data if provided (e.g., from the current profile)
    });
    const onSubmit = async (data) => {
        try {
            const res = await Api.editUser(data)
            refreshKey((prevKey) => prevKey + 1);
            onClose()
            toast.success('Profile Updated Successfully!')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else if (error.response) {
                    toast.error(`Error ${error.response.status}: ${error.response.statusText}`);
                } else {
                    toast.error('Network error. Please try again.');
                }
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#242628] p-6 rounded-lg w-full max-w-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit Profile</h2>
                    <button className="text-black" onClick={onClose}>X</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">First Name</label>
                        <input
                            type="text"
                            {...register("firstName", { required: "First name is required" })}
                            className="w-full p-2 border rounded-lg text-black"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Last Name</label>
                        <input
                            type="text"
                            {...register("lastName", { required: "Last name is required" })}
                            className="w-full p-2 border rounded-lg text-black"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full p-2 border rounded-lg text-black"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Username</label>
                        <input
                            type="text"
                            {...register("userName", { required: "Username is required" })}
                            className="w-full p-2 border rounded-lg text-black"
                        />
                        {errors.userName && <p className="text-red-500 text-xs">{errors.userName.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full p-2 border rounded-lg text-black"
                        />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-2 bg-[#A27B5C] hover:bg-[#6c3c3c] text-white py-2 px-4 rounded-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <ToastContainer
       position="top-right"
       autoClose={5000}    
       theme="dark"   
       />
        </>
    );
};

export default EditProfileModal;

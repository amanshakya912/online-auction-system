import React, { act, useState } from "react"
import { useEffect } from "react";
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import "react-form-wizard-component/dist/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faLock, faPhone, faPhoneAlt, faStamp, faUser } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Api from "../utils/Api";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  function handleCallbackResponse(response) {
    console.log("Encoded Jet Id Token:" + response.credential);
    var userobject = jwt_decode(response.credential);
    console.log(userobject);
  }

  // useEffect(() => {
  //   /*global google*/
  //   google.accounts.id.initialize({
  //     client_id: "663506327532-9itpuc44nltu4fq0rearva6f8787vkhr.apps.googleusercontent.com",
  //     callback: handleCallbackResponse
  //   });

  //   google.accounts.id.renderButton(
  //     document.getElementById("SignIn"),
  //     { theme: "outline", size: "large" }
  //   )
  // }, []);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      navigate('/')
    }
  })
  const [action, setAction] = useState("Login");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true)
    console.log("Form Data:", data);
    if (action == "Login") {
      signIn(data)
    } else {
      signUp(data)
    }
    setLoading(false)
  };
  const signIn = async (data) => {
    console.log('data in',data)
    try {
        const res = await Api.signIn(data)
        console.log('res',res)
        toast.success(res.message);
        if (res?.token) {
          // Store token in localStorage
          localStorage.setItem('token', res.token);

          // Store the username or other user data (optional)
          localStorage.setItem('username', res.userName);

          localStorage.setItem('id', res.id);
        }
        setTimeout(() => {
          navigate('/');  // Redirect to home page after 3 seconds
        }, 3000);
      } catch (error) {
        console.log('err',error)
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message);
          } else if (error.response) {
              toast.error(`Error ${error.response.status}: ${error.response.statusText}`);
          } else {
              toast.error('Network error. Please try again.');
          }
      } else {
          toast.error('An unexpected error occurred. Please try again.');
      }
    }
    console.log('finish')
  }
const signUp = async (data) => {
    console.log('data up', data);
    try {
        const res = await Api.signUp(data);
        console.log('resp', res);
        toast.success(res.message);
        setAction('Login')
    } catch (error) {
        console.log('err', error);
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
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
      <Header />
      <div className="bg-black">
        <div className="container bg-black mx-auto w-full flex justify-center">
          <form
            className="form-container flex flex-col md:mx-auto mx-5 mt-16 mb-16 w-full md:w-[600px] bg-[#A27B5C] rounded-lg pb-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="header flex flex-col items-center gap-2.5 w-full mt-8">
              <div className="text text-black text-4xl font-bold font-lora">{action}</div>
              <div className="underline w-14 h-1.5 bg-black rounded-lg"></div>
            </div>

            <div className="inputs mt-[55px] flex flex-col gap-[25px] md:mx-10 mx-5">
              {action === "Sign Up" && (
                <>
                <div>
                  <div className="input flex items-center h-[50px] bg-gray-200 rounded-[6px]">
                    <FontAwesomeIcon icon={faUser} className="p-2" />
                    <input
                      {...register("firstName", { required: "First Name is required" })}
                      className="h-[50px] w-full p-5 bg-transparent border-none outline-none text-black text-[19px]"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-lg w-full">{errors.firstName.message}</p>}
                </div>
                <div>
                  <div className="input flex items-center h-[50px] bg-gray-200 rounded-[6px]">
                    <FontAwesomeIcon icon={faUser} className="p-2" />
                    <input
                      {...register("lastName", { required: "Last Name is required" })}
                      className="h-[50px] w-full p-5 bg-transparent border-none outline-none text-black text-[19px]"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-lg w-full">{errors.lastName.message}</p>}
                </div>
                <div>
                  <div className="input flex items-center h-[50px] bg-gray-200 rounded-[6px]">
                    <FontAwesomeIcon icon={faUser} className="p-2" />
                    <input
                      {...register("userName", { required: "Username is required" })}
                      className="h-[50px] w-full p-5 bg-transparent border-none outline-none text-black text-[19px]"
                      type="text"
                      name="userName"
                      placeholder="Username"
                    />
                  </div>
                  {errors.userName && <p className="text-red-500 text-lg w-full">{errors.userName.message}</p>}
                </div>
                <div>
                  <div className="input flex items-center h-[50px] bg-gray-200 rounded-[6px]">
                    <FontAwesomeIcon icon={faPhone} className="p-2" />
                    <input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Invalid phone number",
                        },
                      })}
                      className="h-[50px] w-full p-5 bg-transparent border-none outline-none text-black text-[19px]"
                      type="text"
                      name="phone"
                      placeholder="Phone No."
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-lg w-full">{errors.phone.message}</p>}
                </div>
                </>
              )}
              <div>
                <div className="input flex items-center h-[50px] bg-gray-200 rounded-[6px]">
                  <FontAwesomeIcon icon={faEnvelope} className="p-2" />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                        message: "Invalid email address",
                      },
                    })}
                    className="h-[50px] w-full p-5 bg-transparent border-none outline-none text-black text-[19px]"
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-lg w-full">{errors.email.message}</p>}
              </div>
              <div>
              <div className="input flex items-center h-[50px] bg-gray-200 rounded-[6px]">
                <FontAwesomeIcon icon={faLock} className="p-2" />
                <input
                  {...register("password", { required: "Password is required" })}
                  className="h-[50px] w-full p-5 bg-transparent border-none outline-none text-black text-[19px]"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-lg w-full">{errors.password.message}</p>}
              </div>
            </div>

            {action === "Login" && (
              <div className="forgot-password pl-[187px] mt-[27px] text-black text-[18px]">
                Forgot Password? <span className="hover:text-[#4c00b4] p-2 cursor-pointer">Click Here!</span>
              </div>
            )}

            <div className="submit-container flex md:flex-row flex-col gap-[30px] mx-auto mt-[40px]">
              {/* Submit Button */}
              <button
                type="submit"
                className="submit flex justify-center items-center w-[220px] h-[69px] text-white bg-black hover:bg-[#242628] rounded-full text-[19px] font-bold cursor-pointer"
                disabled={ loading ? true: false}
              >
                {loading ? 'Please Wait' : action}
              </button>

              {/* Toggle Action Buttons */}
              {action == "Sign Up" ? <>
                <button
                type="button"
                className={`submit flex justify-center items-center w-[220px] h-[69px] text-white bg-[#242628] hover:bg-black rounded-full text-[19px] font-bold cursor-pointer ${
                  action === "Login" ? "bg-gray-300" : ""
                }`}
                onClick={() => {
                  setAction("Login");
                  if (action !== "Login") reset(); // Clear form only if switching
                }}
              >
                Login
              </button>
              </> : 
              <>
              <button
                type="button"
                className={`submit flex justify-center items-center w-[220px] h-[69px] text-white bg-[#242628] hover:bg-black rounded-full text-[19px] font-bold cursor-pointer ${
                  action === "Sign Up" ? "bg-gray-300" : ""
                }`}
                onClick={() => {
                  setAction("Sign Up");
                  if (action !== "Sign Up") reset(); // Clear form only if switching
                }}
              >
                Sign Up
              </button>
              </>}
            </div>

          </form>
        </div>
      </div>
      <ToastContainer
       position="top-right"
       autoClose={5000}    
       theme="dark"   
       />
      <Footer />
    </>
  )
}
export default Signup
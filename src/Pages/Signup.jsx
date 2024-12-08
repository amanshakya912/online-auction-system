import React, { useState } from "react"
import { useEffect } from "react";
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import "react-form-wizard-component/dist/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faLock, faPhone, faPhoneAlt, faStamp, faUser } from "@fortawesome/free-solid-svg-icons";


const Signup = () => {

  function handleCallbackResponse(response) {
    console.log("Encoded Jet Id Token:" + response.credential);
    var userobject = jwt_decode(response.credential);
    console.log(userobject);
  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: "663506327532-9itpuc44nltu4fq0rearva6f8787vkhr.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("SignIn"),
      { theme: "outline", size: "large" }
    )
  }, []);

  const [action, setAction] = useState("Login");
  return (
    <>
      <Header />
      <div className="bg-black">
        <div className="container bg-black mx-auto w-full flex justify-center">
          <div className="form-container flex flex-col mx-auto mt-16 mb-16 w-[600px] bg-[#A27B5C] rounded-lg pb-8">
            <div className="header flex flex-col items-center gap-2.5 w-full mt-8">
              <div className="text text-black text-4xl font-bold font-lora">{action}</div>
              <div className="underline w-14 h-1.5 bg-black rounded-lg"></div>
            </div>
            <div className="inputs mt-[55px] flex flex-col gap-[25px]">
              {action === "Login" ? <></> : <>
                <div className="input flex items-center mx-auto w-[480px] h-[50px] bg-gray-200 rounded-[6px]">
                  <FontAwesomeIcon icon={faUser} className="p-2" />
                  <input className="h-[50px] w-[400px] p-5 bg-transparent border-none outline-none text-[#797979] text-[19px]" type="text" placeholder="Username" />
                </div>
                <div className="input flex items-center mx-auto w-[480px] h-[50px] bg-gray-200 rounded-[6px]">
                  <FontAwesomeIcon icon={faPhone} className="p-2" />
                  <input className="h-[50px] w-[400px] p-5 bg-transparent border-none outline-none text-[#797979] text-[19px]" type="number" placeholder="Phone No." />
                </div>

              </>}
              <div className="input flex items-center mx-auto w-[480px] h-[50px] bg-gray-200 rounded-[6px]" >
                <FontAwesomeIcon icon={faEnvelope} className="p-2" />
                <input className="h-[50px] w-[400px] p-5 bg-transparent border-none outline-none text-[#797979] text-[19px]" type="email" placeholder="Email" />
              </div>
              <div className="input flex items-center mx-auto w-[480px] h-[50px] bg-gray-200 rounded-[6px]">
                <FontAwesomeIcon icon={faLock} className="p-2" />
                <input className="h-[50px] w-[400px] p-5 bg-transparent border-none outline-none text-[#797979] text-[19px]" type="password" placeholder="Password" />
              </div>
              <div id="SignIn" className="flex justify-center mt-5   " >

              </div>
            </div>
            {action === "Sign Up" ? <></> : <>
              <div className="forgot-password pl-[187px] mt-[27px] text-black text-[18px]">Forgot Password?<span className="text-[#4c00b4] p-2 cursor-pointer">Click Here!</span></div>
            </>}

            <div className="submit-container flex gap-[30px] mx-auto mt-[60px]">
              <div className={`submit flex justify-center items-center w-[220px] h-[69px] text-[#737373] bg-black rounded-full text-[19px] font-bold cursor-pointer ${action === "Login" ? "bg-gray-300" : " "}`} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
              <div className={`submit flex justify-center items-center w-[220px] h-[69px] text-[#737373] bg-black rounded-full text-[19px] font-bold cursor-pointer ${action === "Sign Up" ? "bg-gray-300" : " "}`} onClick={() => { setAction("Login") }}>Login</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default Signup
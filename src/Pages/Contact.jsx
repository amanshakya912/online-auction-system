import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faUser,faEnvelope} from "@fortawesome/free-solid-svg-icons";


const Contact = () => {

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_6fz34ad', 'template_07zr6dn', form.current, {
                publicKey: 'Rh6z7mvspTAgCMd4r',
            })
            .then(
                () => {
                    console.log('SUCCESS!');
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };

    return (
        <>
            <Header />
            <div className="bg-black">
            <div className="bg-[#A27B5C] relative">
                <div className="w-full container mx-auto relative h-[100px] flex items-center justify-center">
                    <h1 className="text-white text-4xl font-bold font-lora">Contact Us</h1>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            </div>
            <div className="container bg-black mx-auto w-full flex justify-center">
            <form className='flex flex-col  mx-auto mt-8 mb-8 w-[600px] h-[500px] bg-[#A27B5C] rounded-lg pb-2' ref={form} onSubmit={sendEmail}>
                <p className='flex justify-center font-serif font-bold pt-5'>We will get back to you ASAP!</p>
                <div className="input flex items-center mt-5 ml-3 w-[580px] h-[50px] bg-gray-200 rounded-[6px]" >
                <FontAwesomeIcon icon={faUser} className="p-2" />
                <input className='h-[50px] w-[400px] p-5 bg-transparent border-none outline-none text-[#797979] text-[19px] ' type="text" name="user_name" placeholder='Your Name' />
                </div>
                <div className="input flex items-center mt-5 ml-3 w-[580px] h-[50px] bg-gray-200 rounded-[6px]" >
                <FontAwesomeIcon icon={faEnvelope} className="p-2" />
                <input className='h-[50px] w-[400px] p-5 bg-transparent border-none outline-none text-[#797979] text-[19px] ' type="email" name="user_email"  placeholder='Email'/>
                </div>
                <div className="input flex mt-5 ml-3 w-[580px] h-[150px] bg-gray-200 rounded-[6px]" >
                <textarea className='h-[50px] w-[580px]  p-5 bg-transparent border-none outline-none text-[#797979] text-[19px] ' name="message" placeholder='write your message' />
                </div>
                <div className="submit-container flex gap-[30px] mx-auto mt-[20px]">
                <input type="submit" className='submit flex justify-center items-center w-[580px] h-[69px] text-[#737373] bg-black rounded-full text-[19px] font-bold cursor-pointer' value="Send" />
                </div>
                <p className='flex justify-center pt-5 pb-4 font-serif font-bold'>You may also call us at 555-666-7777</p>
            </form>
            </div>
            </div>
            <Footer />
        </>
    )
}
export default Contact
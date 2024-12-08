import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";

const CreateAuction = () => {
    const [step, setStep] = useState(1);
    const handleComplete = () => {
        console.log("Form completed!");
        // Handle form completion logic here
      };
    return (
        <>
            <Header/>
            <div className="bg-[#A27B5C] relative">
                <div className="w-full container mx-auto relative h-[200px] flex items-center justify-center">
                    <h1 className="text-white text-4xl font-bold font-lora">Create New Auction</h1>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            </div>
            <div className="bg-black py-10">
                <div className="container mx-auto p-8 bg-black text-white shadow-lg rounded-lg">
                <FormWizard
                    stepSize="sm"
                    onComplete={handleComplete}
                    color="#A27B5C"
                >
                    <FormWizard.TabContent title="Category" icon="ti-user">
                        <h2 className="text-3xl font-lora">Select a category for your product</h2>
                        <div className="text-start flex flex-col mb-10">
                            <label htmlFor="category" className="text-xl my-5">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                className="w-full bg-[#A27B5C] border-0 text-white py-2 px-3 rounded-lg focus:outline-none"
                                defaultValue=""
                            >
                                <option value="">Select a Category</option>
                                <option value="mobile">Mobile</option>
                                <option value="laptop">Laptop</option>
                            </select>
                        </div>
                    </FormWizard.TabContent>
                    <FormWizard.TabContent title="Product Details" icon="ti-settings">
                        <h2 className="text-3xl font-lora">Provide Your Product Details</h2>
                        <div className="text-start flex flex-col mb-10">
                            <label htmlFor="category" className="text-xl my-5">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                className="w-full bg-[#A27B5C] border-0 text-white py-2 px-3 rounded-lg focus:outline-none"
                                defaultValue=""
                            >
                                <option value="">Select a Category</option>
                                <option value="mobile">Mobile</option>
                                <option value="laptop">Laptop</option>
                            </select>
                        </div>
                    </FormWizard.TabContent>
                    <FormWizard.TabContent title="Auction Details" icon="ti-check">
                        <h3>Last Tab</h3>
                        <p>Some content for the last tab</p>
                    </FormWizard.TabContent>
                    <FormWizard.TabContent title="Auction Details" icon="ti-check">
                        <h3>Last Tab</h3>
                        <p>Some content for the last tab</p>
                    </FormWizard.TabContent>
                </FormWizard>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default CreateAuction;

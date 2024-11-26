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
            <div className="bg-black">
                <div className="w-full container mx-auto relative">
                    <div className="text-center font-lora text-3xl text-white py-10">
                        Create Auction
                    </div>
                    <div className="py-10">
                        <div className="container mx-auto p-8 bg-[#242628] text-white shadow-lg rounded-lg">
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
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default CreateAuction;

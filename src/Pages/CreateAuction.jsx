import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { useForm } from "react-hook-form";
import DateTimePicker from 'react-datetime-picker';
import Api from "../utils/Api";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { useCallback } from "react";

const CreateAuction = () => {
    const { register, handleSubmit, getValues, setValue, watch, trigger, formState: { errors } } = useForm();
    const [step, setStep] = useState(1);
    
    
    const handleComplete = () => {
        const finalData = getValues(); 
        console.log("Form completed!", finalData);
        handleFormSubmit(finalData); 
    };


    const handleFormSubmit = async (data) => {
        console.log('data', data)
        // const imageFileNames = Array.from(data.images).map((file) => file.name);
        const formData = new FormData();
        for (const key in data) {
            if (key !== 'images') {
                formData.append(key, data[key]);
            }
        }
        Array.from(data.images).forEach((file) => {
            formData.append('images', file); // 'image' matches multer field name
        });
        console.log('da', formData)
        try {
            const res = await Api.addProduct(formData)
            console.log('res',res)
        } catch (error) {
            console.log('err',error)
        }
    }
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
                            // onTabChange={(step)=>handleTabChange(step)}
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
                                        {...register("category", { required: "Category is required" })}
                                        className="w-full bg-[#A27B5C] border-0 text-white py-2 px-3 rounded-lg focus:outline-none"
                                        defaultValue=""
                                    >
                                        <option value="">Select a Category</option>
                                        <option value="mobile">Mobile</option>
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 mt-2">{errors.category.message}</p>
                                    )}
                                </div>
                            </FormWizard.TabContent>
                            <FormWizard.TabContent title="Product Details" icon="ti-settings">
                                <h2 className="text-3xl font-lora">Provide Your Product Details</h2>
                                <div className="text-start flex flex-col mb-10">
                                    <label htmlFor="name" className="text-xl my-5">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        placeholder="Enter the name of your product"
                                        type="text"
                                        id="name"
                                        name="name"
                                        {...register("name", { required: "Product Name is required" })}
                                        className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 mt-2">{errors.name.message}</p>
                                    )}
                                    <label htmlFor="description" className="text-xl my-5">
                                        Description <span className="text-red-500"></span>
                                    </label>
                                    <textarea
                                        placeholder="Enter a brief description for your product"
                                        id="description"
                                        name="description"
                                        rows={3}
                                        {...register("description", { required: "Product Name is required" })}
                                        className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 mt-2">{errors.description.message}</p>
                                    )}
                                    <label htmlFor="images" className="text-xl my-5">
                                        Images <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        multiple // Allow multiple file selection
                                        accept="image/*" // Accept only image files
                                        {...register("images", {
                                            required: "At least one image is required",
                                        })}
                                    className="w-full bg-[#A27B5C] border-0 text-white py-2 px-3 rounded-lg focus:outline-none"
                                    />
                                    {errors.images && (
                                    <p className="text-red-500 mt-2">{errors.images.message}</p>
                                    )}
                                    {/* Preview the selected images */}
                                    <div className="flex mt-5 flex-wrap gap-4">
                                    {watch("images") &&
                                        Array.from(watch("images")).map((file, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(file)} // Generate a temporary preview URL
                                            alt={`Preview ${index + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg shadow"
                                        />
                                        ))}
                                    </div>
                                    <label htmlFor="quantity" className="text-xl my-5">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        placeholder="Quantity"
                                        defaultValue={1}
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min={1}
                                        {...register("quantity", { required: "Quantity is required" })}
                                        className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                    />
                                    {errors.quantity && (
                                        <p className="text-red-500 mt-2">{errors.quantity.message}</p>
                                    )}
                                </div>
                            </FormWizard.TabContent>
                            <FormWizard.TabContent title="Product Specifications" icon="ti-check">
                                <h2 className="text-3xl font-lora">Provide The Product Specifications</h2>
                                Coming Soon
                            </FormWizard.TabContent>
                            <FormWizard.TabContent title="Auction Details" icon="ti-check">
                                <h2 className="text-3xl font-lora">Provide The Auction Details</h2>
                                <div className="grid grid-cols-2 text-start space-x-5">
                                    <div className="flex flex-col">
                                        <label htmlFor="startingPrice" className="text-xl my-5">
                                            Starting Price <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            placeholder="Enter the starting price for your product"
                                            type="text"
                                            id="startingPrice"
                                            name="startingPrice"
                                            {...register("startingPrice", { required: "Starting Price is required" })}
                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                        />
                                        {errors.startingPrice && (
                                            <p className="text-red-500 mt-2">{errors.startingPrice.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="buyNowPrice" className="text-xl my-5">
                                            Buy Now Price <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            placeholder="Enter the Buy Now price for your product"
                                            type="text"
                                            id="buyNowPrice"
                                            name="buyNowPrice"
                                            {...register("buyNowPrice", { required: "Buy Now Price is required" })}
                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                        />
                                        {errors.buyNowPrice && (
                                            <p className="text-red-500 mt-2">{errors.buyNowPrice.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 text-start space-x-5">
                                    <div className="flex flex-col">
                                        <label htmlFor="bidIncrement" className="text-xl my-5">
                                            Bid Increment <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            placeholder="Enter the bid increment for your product"
                                            type="text"
                                            id="bidIncrement"
                                            name="bidIncrement"
                                            {...register("bidIncrement", { required: "Bid Increment is required" })}
                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                        />
                                        {errors.bidIncrement && (
                                            <p className="text-red-500 mt-2">{errors.bidIncrement.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="auctionStartTime" className="text-xl my-5">
                                            Auction Start Time <span className="text-red-500">*</span>
                                        </label>
                                        <div className="bg-white w-full rounded-lg focus:outline-none text-black px-2">
                                            <DateTimePicker
                                                id="auctionStartTime"
                                                name="auctionStartTime"
                                                onChange={(value) => setValue("auctionStartTime", value, { shouldValidate: true })} // Update React Hook Form value
                                                value={watch("auctionStartTime")}
                                                format="y-MM-dd HH:mm:ss"
                                                className={'w-full py-2 border-0'}
                                                hourPlaceholder="hh"
                                                minutePlaceholder="mm"
                                                secondPlaceholder="ss"
                                                yearPlaceholder="yyyy"
                                                monthPlaceholder="mm"
                                                dayPlaceholder="dd"
                                            />
                                        </div>
                                        {errors.auctionStartTime && (
                                            <p className="text-red-500 mt-2">{errors.auctionStartTime.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 text-start space-x-5 mb-5">
                                    <div className="flex flex-col">
                                        <label htmlFor="auctionEndTime" className="text-xl my-5">
                                            Auction End Time <span className="text-red-500">*</span>
                                        </label>
                                        <div className="bg-white w-full rounded-lg focus:outline-none text-black px-2">
                                            <DateTimePicker
                                                id="auctionEndTime"
                                                name="auctionEndTime"
                                                onChange={(value) => setValue("auctionEndTime", value, { shouldValidate: true })} // Update React Hook Form value
                                                value={watch("auctionEndTime")}
                                                format="y-MM-dd HH:mm:ss"
                                                className={'w-full py-2 border-0'}
                                                hourPlaceholder="hh"
                                                minutePlaceholder="mm"
                                                secondPlaceholder="ss"
                                                yearPlaceholder="yyyy"
                                                monthPlaceholder="mm"
                                                dayPlaceholder="dd"
                                            />
                                        </div>
                                        {errors.auctionEndTime && (
                                            <p className="text-red-500 mt-2">{errors.auctionEndTime.message}</p>
                                        )}
                                    </div>
                                </div>
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

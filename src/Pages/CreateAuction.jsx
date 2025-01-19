import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Box, Button, Typography } from "@mui/material";
import Helper from "../utils/Helper";
import axios from "axios";


const CreateAuction = () => {
    const steps = ['Category', 'Product Details', 'Product Specifications', 'Price Prediction', 'Auction Details'];
    const [activeStep, setActiveStep] = useState(0);
    const [isUser, setIsUser] = useState(false)
    const [loading, setLoading] = useState(true)
    const [productDetail, setProductDetail] = useState()
    const [productDetailId, setProductDetailId] = useState()
    const [product, setProduct] = useState()
    const [priceRange, setPriceRange] = useState()
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
          setIsUser(true)
        }
    },[])
    const { register, handleSubmit, getValues, setValue, watch, trigger, formState: { errors } } = useForm();
    const handleComplete = () => {
        const finalData = getValues(); 
        console.log("Form completed!", finalData);
        handleFormSubmit(finalData); 
    };

    const handleSubmitForProductSpecifications = async () => {
        setLoading(true)
        const productSpecs = [getValues('battery_power'),getValues('blue'),getValues('clock_speed'),getValues('dual_sim'),getValues('fc'),getValues('four_g'),getValues('int_memory'),getValues('m_dep'),getValues('mobile_wt'),getValues('n_cores'),getValues('pc'),getValues('px_height'),getValues('px_width'),getValues('ram'),getValues('sc_h'),getValues('sc_w'),getValues('talk_time'),getValues('three_g'),getValues('touch_screen'),getValues('wifi')]
        console.log(productSpecs)
        const features = productSpecs.map(item => parseFloat(item));
        console.log('nm',features)
        try {
            const res = await Api.addProductDetail(features)
            console.log(res)
            setProductDetail(res.productDetail)
            setProductDetailId(res.productDetail._id)
            setPriceRange(res.productDetail.price_range)
            setLoading(false)
        } catch(e){
            console.log(e)
        }
    }
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
        formData.append('productDetailId',productDetailId)
        console.log('da', formData)
        try {
            const res = await Api.addProduct(formData)
            console.log('res',res)
            setProduct(res.data)
            toast.success(res.message);
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
    }
    const handleNext = async () => {
        if(activeStep == 3){
            loading ? '' : setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep === steps.length -1) {
            handleComplete()
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }else {
        const isValid = await trigger();
        if (isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            if (activeStep == 2){
                    await handleSubmitForProductSpecifications();
            }
        }
        }
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
                            {isUser ? 
                            <>
                            <Box sx={{width: '100%'}}>
                                <Stepper activeStep={activeStep} alternativeLabel
                                 sx={{
                                    '& .MuiStepLabel-root .Mui-completed': {
                                      color: '#A27B5C', // Completed step circle color
                                    },
                                    '& .MuiStepLabel-root .Mui-active': {
                                      color: '#A27B5C', // Active step circle color
                                    },
                                    '& .MuiStepLabel-label': {
                                      color: 'white', // Default text color
                                      fontSize: '16px',
                                      fontFamily: 'Lora'
                                    },
                                    '& .MuiStepLabel-label.Mui-active': {
                                      color: 'white', // Active text color
                                    },
                                    '& .MuiStepLabel-label.Mui-completed': {
                                      color: 'white', // Completed text color
                                    },
                                    '& .MuiStepConnector-line': {
                                      borderColor: '#A27B5C', // Line color
                                    },
                                  }}
                                >
                                    {steps.map((label,index)=>{
                                         return (
                                            <Step key={label}>
                                              <StepLabel>{label}</StepLabel>
                                            </Step>
                                          );
                                    })}
                                </Stepper>
                                {activeStep === steps.length ? (
                                    <React.Fragment>
                                        {product ? 
                                        <>
                                            <div className="text-3xl font-lora text-center mt-3">Auction Summary</div>
                                            <div className="mt-5 grid grid-cols-2 gap-5">
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Product Name:</div>
                                                    <div className="text-xl text-white">{product.name}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Description:</div>
                                                    <div className="text-xl text-white">{product.description || "No description available"}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Quantity:</div>
                                                    <div className="text-xl text-white">{product.quantity}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Starting Price:</div>
                                                    <div className="text-xl text-white">Rs.{product.startingPrice}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Buy Now Price:</div>
                                                    <div className="text-xl text-white">Rs.{product.buyNowPrice}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Bid Increment:</div>
                                                    <div className="text-xl text-white">Rs.{product.bidIncrement}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Auction Start Time:</div>
                                                    <div className="text-xl text-white">{new Date(product.auctionStartTime).toLocaleString()}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Auction End Time:</div>
                                                    <div className="text-xl text-white">{new Date(product.auctionEndTime).toLocaleString()}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Category:</div>
                                                    <div className="text-xl text-white">{product.category}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Status:</div>
                                                    <div className="text-xl text-white">{product.status}</div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="text-lg font-medium">Images:</div>
                                                    <div className="flex space-x-3">
                                                        {product.images.map((image, index) => (
                                                        <img key={index} src={`${Helper.BASE_URL}${image}`} alt={`Product Image ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </> :
                                        <>
                                            <Loader/>
                                        </>}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <form onSubmit={handleSubmit(handleComplete)}>
                                            <Box sx={{ mt: 2, mb: 1 }}>
                                            {activeStep === 0 && (
                                                <div>
                                                    <h2 className="text-3xl font-lora text-center">Select a category for your product</h2>
                                                    <div className="text-start flex flex-col mb-10">
                                                        <label htmlFor="category" className="text-xl my-5">
                                                        Category
                                                        </label>
                                                        <select
                                                        id="category"
                                                        name="category"
                                                        {...register('category', { required: 'Category is required' })}
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
                                                </div>
                                            )}

                                            {activeStep === 1 && (
                                                <>
                                                    <h2 className="text-3xl font-lora text-center">Provide Your Product Details</h2>
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
                                                            {...register("description", { required: false })}
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
                                                </>
                                            )}

                                            {activeStep === 2 && (
                                                <>
                                                    <h2 className="text-3xl font-lora text-center">Provide The Product Specifications</h2>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="battery_power" className="text-xl my-5">
                                                            Battery Power (mAh) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="battery_power"
                                                            name="battery_power"
                                                            {...register('battery_power', { required: 'Battery Power is required' })}
                                                            //   defaultValue={productDetails?.battery_power || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.battery_power && <p className="text-red-500 mt-2">{errors.battery_power.message}</p>}
                                                        </div>
                                                        
                                                        <div className="flex flex-col">
                                                            <label htmlFor="blue" className="text-xl my-5">
                                                            Bluetooth <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                            id="blue"
                                                            name="blue"
                                                            {...register('blue', { required: 'Bluetooth status is required' })}
                                                            //   defaultValue={productDetails?.blue || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            >
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                            </select>
                                                            {errors.blue && <p className="text-red-500 mt-2">{errors.blue.message}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="clock_speed" className="text-xl my-5">
                                                            Clock Speed (GHz) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="clock_speed"
                                                            name="clock_speed"
                                                            {...register('clock_speed', { required: 'Clock Speed is required' })}
                                                            //   defaultValue={productDetails?.clock_speed || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.clock_speed && <p className="text-red-500 mt-2">{errors.clock_speed.message}</p>}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label htmlFor="dual_sim" className="text-xl my-5">
                                                            Dual SIM <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                            id="dual_sim"
                                                            name="dual_sim"
                                                            {...register('dual_sim', { required: 'Dual SIM status is required' })}
                                                            //   defaultValue={productDetails?.dual_sim || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            >
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                            </select>
                                                            {errors.dual_sim && <p className="text-red-500 mt-2">{errors.dual_sim.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="fc" className="text-xl my-5">
                                                            Front Camera (Mega Pixels) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="fc"
                                                            name="fc"
                                                            {...register('fc', { required: 'Front Camera (Mega Pixels) is required' })}
                                                            //   defaultValue={productDetails?.ram || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.fc && <p className="text-red-500 mt-2">{errors.fc.message}</p>}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label htmlFor="four_g" className="text-xl my-5">
                                                            4G Support <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                            id="four_g"
                                                            name="four_g"
                                                            {...register('four_g', { required: '4G status is required' })}
                                                            //   defaultValue={productDetails?.four_g || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            >
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                            </select>
                                                            {errors.four_g && <p className="text-red-500 mt-2">{errors.four_g.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="int_memory" className="text-xl my-5">
                                                            Internal Memory (GB) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="int_memory"
                                                            name="int_memory"
                                                            {...register('int_memory', { required: 'Internal memory size is required' })}
                                                            //   defaultValue={productDetails?.int_memory || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.int_memory && <p className="text-red-500 mt-2">{errors.int_memory.message}</p>}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label htmlFor="m_dep" className="text-xl my-5">
                                                                Mobile Depth (cm) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="m_dep"
                                                            name="m_dep"
                                                            {...register('m_dep', { required: 'Mobile Depth is required' })}
                                                            //   defaultValue={productDetails?.m_dep || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.m_dep && <p className="text-red-500 mt-2">{errors.m_dep.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="mobile_wt" className="text-xl my-5">
                                                            Weight of Mobile Phone <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="mobile_wt"
                                                            name="mobile_wt"
                                                            {...register('mobile_wt', { required: 'Mobile weight is required' })}
                                                            //   defaultValue={productDetails?.mobile_wt || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.mobile_wt && <p className="text-red-500 mt-2">{errors.mobile_wt.message}</p>}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label htmlFor="n_cores" className="text-xl my-5">
                                                                Number of cores of processor <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="n_cores"
                                                            name="n_cores"
                                                            {...register('n_cores', { required: 'No. of cores is required' })}
                                                            //   defaultValue={productDetails?.n_cores || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.n_cores && <p className="text-red-500 mt-2">{errors.n_cores.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="pc" className="text-xl my-5">
                                                            Primary Camera (MegaPixels) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="pc"
                                                            name="pc"
                                                            {...register('pc', { required: 'Primary Camera is required' })}
                                                            //   defaultValue={productDetails?.pc || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.pc && <p className="text-red-500 mt-2">{errors.pc.message}</p>}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label htmlFor="px_height" className="text-xl my-5">
                                                                Pixel Resolution Height <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="px_height"
                                                            name="px_height"
                                                            {...register('px_height', { required: 'Pixel Resolution Height is required' })}
                                                            //   defaultValue={productDetails?.px_height || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.px_height && <p className="text-red-500 mt-2">{errors.px_height.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="px_width" className="text-xl my-5">
                                                            Pixel Resolution Width <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="px_width"
                                                            name="px_width"
                                                            {...register('px_width', { required: 'Pixel Resolution Width size is required' })}
                                                            //   defaultValue={productDetails?.px_width || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.px_width && <p className="text-red-500 mt-2">{errors.px_width.message}</p>}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label htmlFor="ram" className="text-xl my-5">
                                                            RAM (MB) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="ram"
                                                            name="ram"
                                                            {...register('ram', { required: 'RAM size is required' })}
                                                            //   defaultValue={productDetails?.ram || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.ram && <p className="text-red-500 mt-2">{errors.ram.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="sc_h" className="text-xl my-5">
                                                            Screen Height (cm) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="sc_h"
                                                            name="sc_h"
                                                            {...register('sc_h', { required: 'Screen height is required' })}
                                                            //   defaultValue={productDetails?.sc_h || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.sc_h && <p className="text-red-500 mt-2">{errors.sc_h.message}</p>}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label htmlFor="sc_w" className="text-xl my-5">
                                                            Screen Width (cm) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="sc_w"
                                                            name="sc_w"
                                                            {...register('sc_w', { required: 'Screen width is required' })}
                                                            //   defaultValue={productDetails?.sc_w || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.sc_w && <p className="text-red-500 mt-2">{errors.sc_w.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="talk_time" className="text-xl my-5">
                                                            Talk Time (hours) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                            type="number"
                                                            id="talk_time"
                                                            name="talk_time"
                                                            {...register('talk_time', { required: 'Talk time is required' })}
                                                            //   defaultValue={productDetails?.talk_time || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            />
                                                            {errors.talk_time && <p className="text-red-500 mt-2">{errors.talk_time.message}</p>}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label htmlFor="three_g" className="text-xl my-5">
                                                            3G Support <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                            id="three_g"
                                                            name="three_g"
                                                            {...register('three_g', { required: '3G status is required' })}
                                                            //   defaultValue={productDetails?.three_g || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            >
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                            </select>
                                                            {errors.three_g && <p className="text-red-500 mt-2">{errors.three_g.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 text-start space-x-5">
                                                        <div className="flex flex-col">
                                                            <label htmlFor="touch_screen" className="text-xl my-5">
                                                            Touch Screen (hours) <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                            id="touch_screen"
                                                            name="touch_screen"
                                                            {...register('touch_screen', { required: '3G status is required' })}
                                                            //   defaultValue={productDetails?.touch_screen || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            >
                                                                <option value="1">Yes</option>
                                                                <option value="0">No</option>
                                                            </select>
                                                            {errors.touch_screen && <p className="text-red-500 mt-2">{errors.touch_screen.message}</p>}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label htmlFor="wifi" className="text-xl my-5">
                                                            WiFi Support <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                            id="wifi"
                                                            name="wifi"
                                                            {...register('wifi', { required: 'WiFi status is required' })}
                                                            //   defaultValue={productDetails?.wifi || ''}
                                                            className="w-full border-0 py-2 px-3 rounded-lg focus:outline-none text-black"
                                                            >
                                                            <option value="1">Yes</option>
                                                            <option value="0">No</option>
                                                            </select>
                                                            {errors.wifi && <p className="text-red-500 mt-2">{errors.wifi.message}</p>}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {activeStep === 3 && (
                                                <>
                                                    <div className="flex flex-col">
                                                        {loading ? 
                                                        <>
                                                        <div className="text-center font-lora text-3xl text-white py-10">
                                                            Please wait, your Product Specifications are being analyzed and price range is being predicted!!
                                                        </div>
                                                        <Loader/>
                                                        </> : 
                                                        <>
                                                        <div className="text-center font-lora text-3xl text-white py-10">
                                                            Your price range has been predicted as, Rs. 
                                                            {(() => {
                                                                switch (priceRange) {
                                                                case 0:
                                                                    return "5000-15000";
                                                                case 1:
                                                                    return "15000-25000";
                                                                case 2:
                                                                    return "25000-50000";
                                                                case 3:
                                                                    return "50000+";
                                                                default:
                                                                    return "Invalid price range";
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="text-center font-lora text-3xl text-white py-10">
                                                            You can proceed to the next step!
                                                        </div>
                                                        </>}
                                                    </div>
                                                </>
                                            )}
                                            {activeStep === 4 && (
                                                <>
                                                    <h2 className="text-3xl font-lora text-center">Provide The Auction Details</h2>
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
                                                </>
                                            )}
                                            </Box>
                                        </form>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                            <Button
                                            color="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{
                                                backgroundColor: '#A27B5C',
                                                color: 'white',
                                                '&:hover': {
                                                backgroundColor: '#8D6547', // Darker shade for hover
                                                },
                                            }}
                                            >
                                            Back
                                            </Button>
                                            <Box sx={{ flex: '1 1 auto' }} />
                                            <Button onClick={handleNext} 
                                            sx={{
                                                backgroundColor: '#A27B5C',
                                                color: 'white',
                                                '&:hover': {
                                                backgroundColor: '#8D6547', // Darker shade for hover
                                                },
                                            }}>
                                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </Box>
                                    </React.Fragment>
                                )}
                            </Box>
                            </>
                            : 
                            <>
                            <div className="flex items-center justify-center gap-10">
                                <div className="text-center font-lora text-3xl text-white py-10">You need to be logged in to create an auction!</div>
                                <Link to={'/sign-up'}><button className="flex items-center border-0 rounded-md px-6 py-1 hover:bg-white hover:text-[#6c3c3c] cursor-pointer bg-[#6c3c3c] text-white">Sign Up</button></Link>
                                {/* <Link to={'/sign-up'}>
                                    <div className="flex items-center border-0 rounded-md px-6 py-1 hover:bg-white hover:text-[#6c3c3c] cursor-pointer bg-[#6c3c3c] text-white">
                                        Sign Up
                                    </div>
                                </Link> */}
                            </div>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}    
                theme="dark"   
            />
            <Footer/>
        </>
    );
};

export default CreateAuction;

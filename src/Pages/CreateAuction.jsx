import React, { useEffect, useState, forwardRef } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { useForm } from "react-hook-form";
import DateTimePicker from 'react-datetime-picker';
import Api from "../utils/Api";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import Helper from "../utils/Helper";
import axios from "axios";

// ─── Step config ─────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Category",        icon: "⊞", desc: "What are you selling?" },
  { label: "Product Details", icon: "◈", desc: "Name, images, quantity" },
  { label: "Specifications",  icon: "◎", desc: "Technical details" },
  { label: "Price Prediction",icon: "◆", desc: "AI-estimated range" },
  { label: "Auction Details", icon: "◉", desc: "Pricing & schedule" },
];

// ─── Field component ──────────────────────────────────────────────────────────
const Field = forwardRef(({ label, required, error, children, hint }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-[11px] font-semibold uppercase tracking-widest text-[#A27B5C]/70">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-[11px] text-white/25 pl-0.5">{hint}</p>}
    {error && (
      <p className="text-[11px] text-red-400/90 pl-0.5 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
));
Field.displayName = "Field";

const inputCls = (error) =>
  `w-full h-11 px-4 rounded-xl border text-[14px] text-white bg-[rgba(162,123,92,0.06)] placeholder:text-white/20
   outline-none transition-all duration-200
   ${error
     ? "border-red-500/50 bg-[rgba(220,38,38,0.04)]"
     : "border-[rgba(162,123,92,0.18)] focus:border-[#A27B5C]/60 focus:bg-[rgba(162,123,92,0.10)]"
   }`;

const selectCls = (error) =>
  `w-full h-11 px-4 rounded-xl border text-[14px] text-white bg-[#1a1208] appearance-none
   outline-none transition-all duration-200 cursor-pointer
   ${error
     ? "border-red-500/50"
     : "border-[rgba(162,123,92,0.18)] focus:border-[#A27B5C]/60"
   }`;

// ─── Custom stepper ───────────────────────────────────────────────────────────
const CustomStepper = ({ steps, activeStep }) => (
  <div className="relative flex items-start justify-between mb-10">
    {/* connector line */}
    <div className="absolute top-5 left-0 right-0 h-px bg-[rgba(162,123,92,0.15)]" style={{ zIndex: 0 }} />
    <div
      className="absolute top-5 left-0 h-px bg-gradient-to-r from-[#A27B5C] to-[#c4a47a] transition-all duration-500"
      style={{ width: `${(activeStep / (steps.length - 1)) * 100}%`, zIndex: 1 }}
    />
    {steps.map((step, i) => {
      const done = i < activeStep;
      const active = i === activeStep;
      return (
        <div key={step.label} className="flex flex-col items-center gap-2 relative z-10" style={{ flex: 1 }}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
            ${done
              ? "bg-[#A27B5C] border-[#A27B5C] text-white"
              : active
              ? "bg-[#1a1208] border-[#A27B5C] text-[#A27B5C] shadow-[0_0_16px_rgba(162,123,92,0.4)]"
              : "bg-[#1a1208] border-[rgba(162,123,92,0.2)] text-white/25"
            }`}
          >
            {done
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <span className="text-xs">{i + 1}</span>
            }
          </div>
          <div className="text-center hidden sm:block">
            <div className={`text-[11px] font-semibold tracking-wide transition-colors duration-200 ${active ? "text-[#A27B5C]" : done ? "text-white/60" : "text-white/25"}`}>
              {step.label}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────
const StepHeader = ({ step }) => (
  <div className="pb-5 border-b border-[rgba(162,123,92,0.12)]">
    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A27B5C]/60 mb-1">
      Step {STEPS.indexOf(step) + 1} of {STEPS.length}
    </div>
    <h2 className="font-lora text-2xl text-white font-semibold">{step.label}</h2>
    <p className="text-white/35 text-[13px] mt-1">{step.desc}</p>
  </div>
);

// ─── Price range label ────────────────────────────────────────────────────────
const priceLabel = (range) => {
  switch (range) {
    case 0: return { label: "Rs. 5,000 – 15,000",  tier: "Budget" };
    case 1: return { label: "Rs. 15,000 – 25,000", tier: "Mid-range" };
    case 2: return { label: "Rs. 25,000 – 50,000", tier: "Premium" };
    case 3: return { label: "Rs. 50,000+",          tier: "Flagship" };
    default: return { label: "Unknown",              tier: "" };
  }
};

// ─── Summary row ──────────────────────────────────────────────────────────────
const SummaryRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 p-4 rounded-xl bg-[rgba(162,123,92,0.05)] border border-[rgba(162,123,92,0.1)]">
    <div className="text-[10px] uppercase tracking-widest font-semibold text-[#A27B5C]/60">{label}</div>
    <div className="text-white text-[15px] font-medium">{value}</div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const CreateAuction = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isUser, setIsUser]         = useState(false);
  const [loading, setLoading]       = useState(true);
  const [product, setProduct]       = useState();
  const [priceRange, setPriceRange] = useState();
  const [productDetailId, setProductDetailId] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsUser(true);
    setLoading(false);
  }, []);

  const { register, handleSubmit, getValues, setValue, watch, trigger, formState: { errors } } = useForm();

  const handleSubmitForProductSpecifications = async () => {
    setLoading(true);
    const specs = [
      getValues("battery_power"), getValues("blue"), getValues("dual_sim"),
      getValues("fc"), getValues("int_memory"), getValues("ram"),
      getValues("wifi"), getValues("pc"), getValues("n_cores"),
      getValues("px_height"), getValues("px_width"),
    ];
    const features = specs.map((item) => parseFloat(item));
    try {
      const res = await Api.addProductDetail(features);
      setProductDetailId(res.productDetail._id);
      setPriceRange(res.productDetail.price_range);
    } catch (e) {
      toast.error("Failed to analyze specifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key !== "images") {
        const val = data[key];
        formData.append(key, val instanceof Date ? val.toISOString() : val);
      }
    }
    Array.from(data.images).forEach((file) => formData.append("images", file));
    formData.append("productDetailId", productDetailId);
    try {
      const res = await Api.addProduct(formData);
      setProduct(res.data);
      toast.success(res.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || `Error ${error.response?.status}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleNext = async () => {
    if (activeStep === 3) {
      if (!loading) setActiveStep((p) => p + 1);
      return;
    }
    if (activeStep === STEPS.length - 1) {
      const data = getValues();
      handleFormSubmit(data);
      setActiveStep((p) => p + 1);
      return;
    }
    const isValid = await trigger();
    if (isValid) {
      if (activeStep === 2) await handleSubmitForProductSpecifications();
      setActiveStep((p) => p + 1);
    }
  };

  const handleBack = () => setActiveStep((p) => p - 1);

  const priceInfo = priceLabel(priceRange);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap');
        .auction-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #130e0a inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        .select-arrow { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A27B5C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }
        .dtp-override .react-datetime-picker__wrapper { border: none; background: transparent; color: white; }
        .dtp-override .react-datetime-picker__inputGroup__input { color: white !important; }
        .dtp-override .react-datetime-picker__button svg { stroke: #A27B5C; }
      `}</style>

      <div className="bg-[#0c0905] min-h-screen">
        <Header />

        <div className="max-w-3xl mx-auto px-4 py-12">

          {/* Page title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#A27B5C]/60 text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">
              <div className="w-6 h-px bg-[#A27B5C]/30" />
              Marketplace
              <div className="w-6 h-px bg-[#A27B5C]/30" />
            </div>
            <h1 className="font-lora text-3xl md:text-4xl text-white font-bold tracking-tight">
              Create Auction
            </h1>
            <p className="text-white/35 text-[13px] mt-2">List your product and let buyers compete for the best price.</p>
          </div>

          {/* Main card */}
          <div
            className="rounded-2xl border border-[rgba(162,123,92,0.14)] overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #18100a 0%, #120d08 100%)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(162,123,92,0.05) inset",
            }}
          >
            {/* Top shimmer bar */}
            <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #5a3d28, #A27B5C, #d4a574, #A27B5C, #5a3d28)" }} />

            <div className="p-6 md:p-10">
              {!isUser ? (
                /* ── Not logged in ── */
                <div className="flex flex-col items-center justify-center py-16 gap-6">
                  <div className="w-16 h-16 rounded-2xl border border-[rgba(162,123,92,0.2)] flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #1e150e 0%, #2a1c12 100%)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A27B5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-lora text-xl text-white mb-2">Sign in to continue</h3>
                    <p className="text-white/35 text-sm">You need an account to create and manage auctions.</p>
                  </div>
                  <Link to="/sign-up">
                    <button className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg, #A27B5C 0%, #8a6548 100%)", boxShadow: "0 4px 20px rgba(162,123,92,0.3)" }}>
                      Create an account →
                    </button>
                  </Link>
                </div>
              ) : activeStep === STEPS.length ? (
                /* ── Complete / Summary ── */
                <div>
                  {product ? (
                    <>
                      <div className="text-center mb-8 pb-6 border-b border-[rgba(162,123,92,0.12)]">
                        <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h2 className="font-lora text-2xl text-white font-semibold">Auction created!</h2>
                        <p className="text-white/35 text-sm mt-1">Your listing is live and accepting bids.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SummaryRow label="Product Name"      value={product.name} />
                        <SummaryRow label="Category"          value={product.category} />
                        <SummaryRow label="Quantity"          value={product.quantity} />
                        <SummaryRow label="Status"            value={product.status} />
                        <SummaryRow label="Starting Price"    value={`Rs. ${product.startingPrice}`} />
                        <SummaryRow label="Buy Now Price"     value={`Rs. ${product.buyNowPrice}`} />
                        <SummaryRow label="Bid Increment"     value={`Rs. ${product.bidIncrement}`} />
                        <SummaryRow label="Description"       value={product.description || "—"} />
                        <SummaryRow label="Auction Start"     value={new Date(product.auctionStartTime).toLocaleString()} />
                        <SummaryRow label="Auction End"       value={new Date(product.auctionEndTime).toLocaleString()} />
                        {product.images?.length > 0 && (
                          <div className="sm:col-span-2 p-4 rounded-xl bg-[rgba(162,123,92,0.05)] border border-[rgba(162,123,92,0.1)]">
                            <div className="text-[10px] uppercase tracking-widest font-semibold text-[#A27B5C]/60 mb-3">Images</div>
                            <div className="flex flex-wrap gap-3">
                              {product.images.map((img, i) => (
                                <img key={i} src={`${Helper.BASE_URL}${img}`} alt={`Product ${i + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border border-[rgba(162,123,92,0.15)]" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="py-10"><Loader fullScreen={false} /></div>
                  )}
                </div>
              ) : (
                /* ── Steps ── */
                <>
                  <CustomStepper steps={STEPS} activeStep={activeStep} />

                  <form onSubmit={(e) => e.preventDefault()} noValidate>

                    {/* ── Step 0: Category ── */}
                    {activeStep === 0 && (
                      <div>
                        <StepHeader step={STEPS[0]} />
                        <Field label="Category" required error={errors.category?.message}>
                          <div className="relative">
                            <select
                              {...register("category", { required: "Select a category to continue" })}
                              defaultValue=""
                              className={`${selectCls(errors.category)} select-arrow auction-input`}
                            >
                              <option value="" disabled>Choose a category…</option>
                              <option value="mobile">Mobile</option>
                            </select>
                          </div>
                        </Field>
                      </div>
                    )}

                    {/* ── Step 1: Product Details ── */}
                    {activeStep === 1 && (
                      <div className="flex flex-col gap-5">
                        <StepHeader step={STEPS[1]} />
                        <Field label="Product Name" required error={errors.name?.message}>
                          <input
                            type="text"
                            placeholder="e.g. Samsung Galaxy S24 Ultra"
                            {...register("name", { required: "Product name is required" })}
                            className={`${inputCls(errors.name)} auction-input`}
                          />
                        </Field>
                        <Field label="Description" error={errors.description?.message} hint="Optional — describe condition, accessories, or notable features.">
                          <textarea
                            placeholder="Describe the product's condition and any key details…"
                            rows={3}
                            {...register("description")}
                            className={`${inputCls(errors.description)} auction-input !h-auto py-3 resize-none`}
                          />
                        </Field>
                        <Field label="Images" required error={errors.images?.message} hint="Upload clear photos. First image is the cover.">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            {...register("images", { required: "At least one image is required" })}
                            className="w-full text-[13px] text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[13px] file:font-semibold file:bg-[#A27B5C]/20 file:text-[#A27B5C] hover:file:bg-[#A27B5C]/30 file:cursor-pointer cursor-pointer transition-all"
                          />
                          {watch("images") && Array.from(watch("images")).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Array.from(watch("images")).map((file, i) => (
                                <img key={i} src={URL.createObjectURL(file)} alt={`Preview ${i + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-[rgba(162,123,92,0.2)]" />
                              ))}
                            </div>
                          )}
                        </Field>
                        <Field label="Quantity" required error={errors.quantity?.message}>
                          <input
                            type="number"
                            min={1}
                            defaultValue={1}
                            {...register("quantity", { required: "Quantity is required" })}
                            className={`${inputCls(errors.quantity)} auction-input`}
                          />
                        </Field>
                      </div>
                    )}

                    {/* ── Step 2: Specifications ── */}
                    {activeStep === 2 && (
                      <div className="flex flex-col gap-5">
                        <StepHeader step={STEPS[2]} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field label="Battery Power (mAh)" required error={errors.battery_power?.message}>
                            <input type="number" placeholder="e.g. 4500" {...register("battery_power", { required: "Required" })} className={`${inputCls(errors.battery_power)} auction-input`} />
                          </Field>
                          <Field label="RAM (MB)" required error={errors.ram?.message}>
                            <input type="number" placeholder="e.g. 8192" {...register("ram", { required: "Required" })} className={`${inputCls(errors.ram)} auction-input`} />
                          </Field>
                          <Field label="Internal Memory (GB)" required error={errors.int_memory?.message}>
                            <input type="number" placeholder="e.g. 128" {...register("int_memory", { required: "Required" })} className={`${inputCls(errors.int_memory)} auction-input`} />
                          </Field>
                          <Field label="Processor Cores" required error={errors.n_cores?.message}>
                            <input type="number" placeholder="e.g. 8" {...register("n_cores", { required: "Required" })} className={`${inputCls(errors.n_cores)} auction-input`} />
                          </Field>
                          <Field label="Front Camera (MP)" required error={errors.fc?.message}>
                            <input type="number" placeholder="e.g. 12" {...register("fc", { required: "Required" })} className={`${inputCls(errors.fc)} auction-input`} />
                          </Field>
                          <Field label="Primary Camera (MP)" required error={errors.pc?.message}>
                            <input type="number" placeholder="e.g. 50" {...register("pc", { required: "Required" })} className={`${inputCls(errors.pc)} auction-input`} />
                          </Field>
                          <Field label="Pixel Height" required error={errors.px_height?.message}>
                            <input type="number" placeholder="e.g. 2400" {...register("px_height", { required: "Required" })} className={`${inputCls(errors.px_height)} auction-input`} />
                          </Field>
                          <Field label="Pixel Width" required error={errors.px_width?.message}>
                            <input type="number" placeholder="e.g. 1080" {...register("px_width", { required: "Required" })} className={`${inputCls(errors.px_width)} auction-input`} />
                          </Field>
                        </div>
                        {/* Toggle fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          {[
                            { name: "blue",     label: "Bluetooth" },
                            { name: "dual_sim", label: "Dual SIM"  },
                            { name: "wifi",     label: "WiFi"      },
                          ].map(({ name, label }) => (
                            <Field key={name} label={label} required error={errors[name]?.message}>
                              <div className="relative">
                                <select {...register(name, { required: "Required" })} className={`${selectCls(errors[name])} select-arrow auction-input`}>
                                  <option value="1">Yes</option>
                                  <option value="0">No</option>
                                </select>
                              </div>
                            </Field>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Step 3: Price Prediction ── */}
                    {activeStep === 3 && (
                      <div>
                        <StepHeader step={STEPS[3]} />
                        {loading ? (
                          <div className="flex flex-col items-center justify-center py-16 gap-6">
                            <div className="relative w-14 h-14">
                              <div className="absolute inset-0 rounded-full border-2 border-[rgba(162,123,92,0.15)]" />
                              <div className="absolute inset-0 rounded-full border-2 border-t-[#A27B5C] animate-spin" />
                            </div>
                            <div className="text-center">
                              <div className="font-lora text-lg text-white mb-1">Analyzing specifications…</div>
                              <div className="text-white/35 text-sm">{'Our model is predicting your product\'s market value.'}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-10 gap-6">
                            <div className="text-center p-8 rounded-2xl border border-[rgba(162,123,92,0.2)] w-full max-w-sm"
                              style={{ background: "linear-gradient(135deg, rgba(162,123,92,0.08) 0%, rgba(162,123,92,0.03) 100%)" }}>
                              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A27B5C]/60 font-semibold mb-2">Predicted Range</div>
                              <div className="font-lora text-3xl text-white font-bold mb-1">{priceInfo.label}</div>
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A27B5C]/15 border border-[#A27B5C]/25 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#A27B5C]" />
                                <span className="text-[#A27B5C] text-xs font-semibold">{priceInfo.tier}</span>
                              </div>
                            </div>
                            <p className="text-white/35 text-sm text-center max-w-xs">
                              Use this as a guide when setting your starting price. You can go above or below based on your preference.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Step 4: Auction Details ── */}
                    {activeStep === 4 && (
                      <div className="flex flex-col gap-5">
                        <StepHeader step={STEPS[4]} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field label="Starting Price (Rs.)" required error={errors.startingPrice?.message}>
                            <input type="number" placeholder="e.g. 15000" {...register("startingPrice", { required: "Starting price is required" })} className={`${inputCls(errors.startingPrice)} auction-input`} />
                          </Field>
                          <Field label="Buy Now Price (Rs.)" required error={errors.buyNowPrice?.message}>
                            <input type="number" placeholder="e.g. 45000" {...register("buyNowPrice", { required: "Buy now price is required" })} className={`${inputCls(errors.buyNowPrice)} auction-input`} />
                          </Field>
                          <Field label="Bid Increment (Rs.)" required error={errors.bidIncrement?.message} hint="Minimum amount each new bid must exceed the last.">
                            <input type="number" placeholder="e.g. 500" {...register("bidIncrement", { required: "Bid increment is required" })} className={`${inputCls(errors.bidIncrement)} auction-input`} />
                          </Field>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                          <Field label="Auction Start Time" required error={errors.auctionStartTime?.message}>
                            <div className={`h-11 px-4 flex items-center rounded-xl border transition-all duration-200 dtp-override
                              ${errors.auctionStartTime ? "border-red-500/50" : "border-[rgba(162,123,92,0.18)] focus-within:border-[#A27B5C]/60"}`}
                              style={{ background: "rgba(162,123,92,0.06)" }}>
                              <DateTimePicker
                                onChange={(v) => setValue("auctionStartTime", v, { shouldValidate: true })}
                                value={watch("auctionStartTime")}
                                format="y-MM-dd HH:mm:ss"
                                className="w-full"
                                hourPlaceholder="hh" minutePlaceholder="mm" secondPlaceholder="ss"
                                yearPlaceholder="yyyy" monthPlaceholder="MM" dayPlaceholder="dd"
                              />
                            </div>
                          </Field>
                          <Field label="Auction End Time" required error={errors.auctionEndTime?.message}>
                            <div className={`h-11 px-4 flex items-center rounded-xl border transition-all duration-200 dtp-override
                              ${errors.auctionEndTime ? "border-red-500/50" : "border-[rgba(162,123,92,0.18)] focus-within:border-[#A27B5C]/60"}`}
                              style={{ background: "rgba(162,123,92,0.06)" }}>
                              <DateTimePicker
                                onChange={(v) => setValue("auctionEndTime", v, { shouldValidate: true })}
                                value={watch("auctionEndTime")}
                                format="y-MM-dd HH:mm:ss"
                                className="w-full"
                                hourPlaceholder="hh" minutePlaceholder="mm" secondPlaceholder="ss"
                                yearPlaceholder="yyyy" monthPlaceholder="MM" dayPlaceholder="dd"
                              />
                            </div>
                          </Field>
                        </div>
                      </div>
                    )}
                  </form>

                  {/* ── Navigation ── */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-[rgba(162,123,92,0.12)]">
                    <button
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold border transition-all duration-200
                        ${activeStep === 0
                          ? "border-[rgba(162,123,92,0.1)] text-white/20 cursor-not-allowed"
                          : "border-[rgba(162,123,92,0.25)] text-[#A27B5C] hover:bg-[rgba(162,123,92,0.08)] cursor-pointer"
                        }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                      Back
                    </button>

                    <div className="flex items-center gap-2">
                      {STEPS.map((_, i) => (
                        <div key={i} className={`rounded-full transition-all duration-300 ${i === activeStep ? "w-4 h-1.5 bg-[#A27B5C]" : i < activeStep ? "w-1.5 h-1.5 bg-[#A27B5C]/50" : "w-1.5 h-1.5 bg-white/10"}`} />
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={activeStep === 3 && loading}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200
                        ${activeStep === 3 && loading
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:brightness-110 active:scale-[0.98] cursor-pointer"
                        }`}
                      style={{
                        background: "linear-gradient(135deg, #A27B5C 0%, #8a6548 100%)",
                        boxShadow: "0 4px 16px rgba(162,123,92,0.3)",
                      }}
                    >
                      {activeStep === STEPS.length - 1 ? "Create Auction" : "Continue"}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <Footer />
    </>
  );
};

export default CreateAuction;
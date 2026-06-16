import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Api from "../utils/Api";

const CheckoutForm = ({ product, onSuccess }) => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateAddress = () => {
    const errors = {};
    const fields = ["street", "city", "state", "postalCode", "country"];
    fields.forEach((f) => {
      if (!address[f].trim()) {
        errors[f] = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`;
      }
    });
    return errors;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (addressErrors[name]) {
      setAddressErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await Api.completeCheckout({
        productId: product._id,
        ...address,
      });
      onSuccess();
    } catch (err) {
      setAddressErrors({ form: err?.response?.data?.error || "Checkout failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#A27B5C] transition-colors";
  const labelClass = "block text-sm text-gray-400 mb-1";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="bg-[#212121] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#A27B5C]">
          Shipping Address
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Street Address</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
              placeholder="123 Main St"
              className={inputClass}
            />
            {addressErrors.street && (
              <p className={errorClass}>{addressErrors.street}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="New York"
                className={inputClass}
              />
              {addressErrors.city && (
                <p className={errorClass}>{addressErrors.city}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>State / Province</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="NY"
                className={inputClass}
              />
              {addressErrors.state && (
                <p className={errorClass}>{addressErrors.state}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressChange}
                placeholder="10001"
                className={inputClass}
              />
              {addressErrors.postalCode && (
                <p className={errorClass}>{addressErrors.postalCode}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                placeholder="United States"
                className={inputClass}
              />
              {addressErrors.country && (
                <p className={errorClass}>{addressErrors.country}</p>
              )}
            </div>
          </div>
        </div>
        {addressErrors.form && (
          <p className="text-red-400 text-sm mt-3">{addressErrors.form}</p>
        )}
      </div>

      <div className="bg-[#212121] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#A27B5C]">
          Demo Checkout
        </h2>
        <p className="text-gray-400 mb-4">
          This is a demo checkout. No real payment will be processed.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#A27B5C] hover:bg-[#8a6548] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          "Place Order (Demo)"
        )}
      </button>
    </form>
  );
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [success, setSuccess] = useState(false);

  const imageBase = import.meta.env.VITE_IMAGE_URL || "";

  useEffect(() => {
    const productId =
      searchParams.get("productId") || location.state?.productId;

    if (!productId) {
      setError("No product specified for checkout.");
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const checkoutData = await Api.initiateCheckout(productId);
        setProduct({ _id: productId, ...checkoutData });
      } catch (err) {
        const msg =
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load checkout.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [searchParams, location.state?.productId]);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => navigate("/user/" + localStorage.getItem("username")), 3000);
  };

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen font-lora text-white">
        <div className="container mx-auto py-10 px-4 max-w-4xl">
          <h1 className="text-3xl text-center mb-8">Checkout</h1>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <svg
                className="animate-spin h-10 w-10 text-[#A27B5C]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-gray-400">Loading checkout...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-900/30 border border-red-500 rounded-xl p-6 text-center">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="bg-[#A27B5C] hover:bg-[#8a6548] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-500 rounded-xl p-8 text-center">
              <svg
                className="w-16 h-16 text-green-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-green-400 mb-2">
                Order Placed! (Demo)
              </h2>
              <p className="text-gray-400">
                Redirecting to your profile...
              </p>
            </div>
          )}

          {!loading && !error && !success && product && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CheckoutForm product={product} onSuccess={handleSuccess} />
              </div>
              <div className="bg-[#212121] rounded-xl p-6 h-fit">
                <h2 className="text-xl font-semibold mb-4 text-[#A27B5C]">
                  Order Summary
                </h2>

                {product.image && (
                  <img
                    src={`${imageBase}${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                <h3 className="text-lg font-medium mb-2">
                  {product.name || "Auction Item"}
                </h3>

                <div className="border-t border-[#3a3a3a] pt-4 mt-4">
                  <div className="flex justify-between text-gray-400 mb-2">
                    <span>Final Bid</span>
                    <span className="text-white">
                      Rs.{" "}
                      {product.finalPrice != null
                        ? Number(product.finalPrice).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-3">
                    <span>Total</span>
                    <span className="text-[#A27B5C]">
                      Rs.{" "}
                      {product.finalPrice != null
                        ? Number(product.finalPrice).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools } from "@fortawesome/free-solid-svg-icons";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

const Checkout = () => {
  return (
    <>
      <Header />
      <div className="bg-black min-h-screen font-lora text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <FontAwesomeIcon icon={faTools} className="text-5xl text-primary mb-6" />
          <h1 className="text-3xl font-bold mb-4">Checkout — Coming Soon</h1>
          <p className="text-text-secondary mb-8">
            The checkout feature is under development and will be available shortly.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-150"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
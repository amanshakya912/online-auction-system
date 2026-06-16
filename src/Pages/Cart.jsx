import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

const Cart = () => {
  return (
    <>
    <Header/>
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-center text-white font-lora px-6">
        <h1 className="text-4xl font-bold mb-6">Shopping Cart</h1>
        <p className="text-lg text-text-secondary mb-8">Cart feature coming soon</p>
        <Link
          to="/browse-auction/all"
          className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-150"
        >
          Browse Products
        </Link>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Cart;

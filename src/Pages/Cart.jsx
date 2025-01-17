import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Samsung Galaxyy",
      price: 30000,
      quantity: 1,
      img: "../images/mobile1.png",
    },
    {
      id: 2,
      name: "iPhone 14",
      price: 70000,
      quantity: 2,
      img: "../images/mobile2.png",
    },
  ];

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
    <Header/>
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-10 text-white font-lora">
        <h1 className="text-3xl text-center mb-10">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 bg-[#212121] p-5 rounded-xl shadow-md">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-[#AD8B73] p-4 mb-4 rounded-xl"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 rounded-md"
                />
                <div className="flex flex-col items-start ml-4">
                  <h3 className="text-xl">{item.name}</h3>
                  <p className="text-lg">Rs. {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 bg-[#A27B5C] rounded-md hover:bg-[#6c3c3c]">
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button className="p-2 bg-[#A27B5C] rounded-md hover:bg-[#6c3c3c]">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <button className="p-2 text-red-500 hover:text-red-700">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
          {/* Summary Section */}
          <div className="bg-[#212121] p-5 rounded-xl shadow-md">
            <h2 className="text-2xl mb-5">Summary</h2>
            <div className="flex justify-between text-lg mb-3">
              <span>Subtotal:</span>
              <span>Rs. {calculateTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg mb-3">
              <span>Shipping:</span>
              <span>Rs. 500</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-5">
              <span>Total:</span>
              <span>Rs. {(calculateTotal() + 500).toLocaleString()}</span>
            </div>
            <button className="w-full bg-[#A27B5C] text-white py-2 rounded-md hover:bg-[#6c3c3c]">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Cart;

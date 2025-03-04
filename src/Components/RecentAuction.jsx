import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Api from "../utils/Api";
import img1 from "../images/mobile1.png";
import Helper from "../utils/Helper";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const RecentAuction = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const productData = async () => {
      try {
        setLoading(true);
        const res = await Api.getProducts(); // Fetch product data from API
        const currentTime = new Date();

        const recentProducts = res.filter((product) => {
          const startTime = new Date(product.auctionStartTime);
          const endTime = new Date(product.auctionEndTime);
          return (
            currentTime > endTime ||
            ["Sold", "Withdrawn"].includes(product.status)
          );
        });

        console.log("Recent Products:", recentProducts);
        setProducts(recentProducts);
        setLoading(false);
      } catch (e) {
        console.log("Error fetching products:", e);
      }
    };
    productData();
  }, []);

  return (
    <div className="bg-black">
      <div className="w-full container mx-auto relative">
        <div className="text-center font-lora text-3xl text-white py-10">
          Recent Auctions
        </div>

        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-5 mx-5 md:mx-0">
              {products.length > 0 ? 
              (products.slice(0, 4).map((product) => (
                  <div key={product.id}>
                    <div className="bg-[#AD8B73] border-0 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 h-full">
                      <img
                        src={Helper.BASE_URL + product.images[0] || img1}
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300 h-full w-full flex justify-center items-center">
                        <Link to={`/${product.slug}`}>
                          <div className="cursor-pointer border-0 rounded-md bg-[#A27B5C] hover:bg-[#6c3c3c] text-white text-[15px] py-2 px-5">
                            View Details
                          </div>
                        </Link>
                      </div>
                      <div className="bg-[#212121] w-full px-5 py-3 text-white flex justify-between">
                        <div className="flex flex-col">
                          <div className="text-base">{product.name}</div>
                          {/* <div className="text-sm">Sold At: Rs. {product.price}</div> */}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-base">
                            No. of Bids: {product.bids ? product.bids : "0"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white text-center py-10">
                  No recent auctions available.
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-center items-center py-10">
          <Link to="/browse-auction/recent">
            <div className="flex items-center border-0 rounded-md px-6 py-2 bg-white text-black cursor-pointer hover:bg-[#6c3c3c] hover:text-white">
              Show All
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentAuction;

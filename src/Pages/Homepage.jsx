import Banner from "../Components/Banner"
import Footer from "../Components/Footer"
import Header from "../Components/Header"
import LiveAuction from "../Components/LiveAuction"
import RecentAuction from "../Components/RecentAuction"
import UpcomingAuction from "../Components/UpcomingAuction"

const Homepage = () => {
    return (
        <>
            <Header/>
                <Banner />
                <LiveAuction /> 
                <UpcomingAuction />   
                <RecentAuction />    
                <UpcomingAuction />       
            <Footer/>
        </>
    )
}
export default Homepage
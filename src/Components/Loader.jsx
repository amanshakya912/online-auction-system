import { MutatingDots } from 'react-loader-spinner';
const Loader = () => {
    return (
        <>
            <div className='w-full flex justify-center items-center'>
                <MutatingDots
                    visible={true}
                    height="100"
                    width="100"
                    color="#6c3c3c"
                    secondaryColor="#6c3c3c"
                    radius="12.5"
                    ariaLabel="mutating-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        </>
    )
}
export default Loader
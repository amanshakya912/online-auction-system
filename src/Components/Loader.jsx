import { MutatingDots } from 'react-loader-spinner';

const Loader = ({ fullScreen = true }) => {
    const spinner = (
        <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="#A27B5C"
            secondaryColor="#A27B5C"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary">
                {spinner}
            </div>
        );
    }

    return <div className="w-full flex justify-center items-center py-10">{spinner}</div>;
};

export default Loader
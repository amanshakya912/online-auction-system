import { useState } from 'react';
import Api from '../utils/Api';

const EmailVerificationBanner = ({ onDismiss }) => {
    const [sendStatus, setSendStatus] = useState('idle'); // 'idle' | 'loading' | 'sent' | 'error'
    const [errorMsg, setErrorMsg] = useState('');

    const handleResend = async () => {
        setSendStatus('loading');
        setErrorMsg('');
        try {
            await Api.resendVerification();
            setSendStatus('sent');
        } catch (error) {
            setSendStatus('error');
            setErrorMsg(error?.response?.data?.message || 'Failed to send. Please try again.');
        }
    };

    return (
        <></>
        // <div className="bg-[#A27B5C] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        //     <span className="text-sm font-medium">
        //         Please verify your email address to access all features.
        //     </span>
        //     <div className="flex items-center gap-3">
        //         {sendStatus === 'idle' && (
        //             <button
        //                 onClick={handleResend}
        //                 className="text-sm underline hover:text-gray-200 transition-colors"
        //             >
        //                 Resend Verification Email
        //             </button>
        //         )}
        //         {sendStatus === 'loading' && (
        //             <span className="text-sm opacity-80">Sending...</span>
        //         )}
        //         {sendStatus === 'sent' && (
        //             <span className="text-sm font-medium">Verification email sent!</span>
        //         )}
        //         {sendStatus === 'error' && (
        //             <>
        //                 <span className="text-sm text-red-200">{errorMsg}</span>
        //                 <button
        //                     onClick={handleResend}
        //                     className="text-sm underline hover:text-gray-200 transition-colors"
        //                 >
        //                     Retry
        //                 </button>
        //             </>
        //         )}
        //         <button
        //             onClick={onDismiss}
        //             aria-label="Dismiss"
        //             className="ml-2 text-white hover:text-gray-200 transition-colors text-lg leading-none"
        //         >
        //             ×
        //         </button>
        //     </div>
        // </div>
    );
};

export default EmailVerificationBanner;

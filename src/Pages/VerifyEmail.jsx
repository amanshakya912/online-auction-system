import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Api from '../utils/Api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verify = async () => {
            try {
                const res = await Api.verifyEmail(token);
                localStorage.setItem('emailVerified', 'true');
                setStatus('success');
                setMessage(res?.message || 'Your email has been verified successfully.');
            } catch (error) {
                setStatus('error');
                setMessage(
                    error?.response?.data?.message || 'Verification failed. The link may be expired or invalid.'
                );
            }
        };

        verify();
    }, []);

    return (
        <div className="bg-black min-h-screen flex items-center justify-center px-4">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-12 h-12 border-4 border-[#A27B5C] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <p className="text-gray-300 text-lg">Verifying your email...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-[#A27B5C] text-6xl mb-6">✓</div>
                        <h1 className="text-white text-2xl font-bold mb-3">Email Verified</h1>
                        <p className="text-gray-400 mb-8">{message}</p>
                        <Link
                            to="/"
                            className="inline-block bg-[#A27B5C] hover:bg-[#8D6547] text-white font-medium px-6 py-2.5 rounded-md transition-colors"
                        >
                            Go to Homepage
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-6xl mb-6">✗</div>
                        <h1 className="text-white text-2xl font-bold mb-3">Verification Failed</h1>
                        <p className="text-gray-400 mb-8">{message}</p>
                        <Link
                            to="/"
                            className="inline-block bg-[#A27B5C] hover:bg-[#8D6547] text-white font-medium px-6 py-2.5 rounded-md transition-colors"
                        >
                            Go to Homepage
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;

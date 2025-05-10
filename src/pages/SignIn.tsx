import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { CreditCard, PiggyBank, ChevronRight } from 'lucide-react';
import logo from './../assets/images/logo.svg';
// import backgroundImage from '../assets/images/Background_1.png';
import backgroundImage from '../assets/images/auth-banner.jpg';

const SignIn: React.FC = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
        } catch (error) {
            setError('Failed to sign in. Please check your credentials.');
            console.error('Error signing in:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className='h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-auto'
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className='absolute inset-0 bg-black opacity-30'></div>
            <div className='relative z-10'>
                <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                    <div className='bg-white/60 py-8 px-4 shadow sm:rounded-lg sm:px-10 backdrop-blur-sm'>
                        <div className='sm:mx-auto sm:w-full sm:max-w-md mb-4'>
                            <div className='flex justify-center mb-2'>
                                <div className='h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center text-white overflow-hidden'>
                                    <img src={logo} alt='logo' className='size-full' />
                                </div>
                            </div>
                            <h2 className='text-center text-3xl font-bold text-gray-900'>Ghar Kharcha</h2>
                            <p className='mt-2 text-center text-gray-600 text-base'>Ab kharche pe full control, AI banaye smart goal</p>
                        </div>
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            {error && (
                                <div className='rounded-md bg-error-50 p-4'>
                                    <div className='flex'>
                                        <div className='text-sm text-error-700'>{error}</div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                    Email
                                </label>
                                <div className='mt-1'>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        autoComplete='email'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='input-field'
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                                    Password
                                </label>
                                <div className='mt-1'>
                                    <input
                                        id='password'
                                        name='password'
                                        type='password'
                                        autoComplete='current-password'
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='input-field'
                                    />
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <input
                                        id='remember-me'
                                        name='remember-me'
                                        type='checkbox'
                                        className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
                                    />
                                    <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                                        Remember me
                                    </label>
                                </div>

                                <div className='text-sm'>
                                    <a href='#' className='font-medium text-primary-600 hover:text-primary-500'>
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </form>

                        <div className='mt-6'>
                            <div className='relative'>
                                <div className='relative flex justify-center text-sm gap-3 items-center'>
                                    <div className='border-b border-gray w-full'></div>
                                    <span className='px-2 text-gray'>OR</span>
                                    <div className='border-b border-gray w-full'></div>
                                </div>
                            </div>

                            <div className='mt-6'>
                                <p className='text-center text-sm text-gray-600'>
                                    Don't have an account?{' '}
                                    <Link to='/signup' className='font-medium text-primary-600 hover:text-primary-500'>
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                {/* <div className='mt-10 mx-auto max-w-2xl'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-0'>
                        <div className='bg-white p-5 rounded-lg shadow-sm'>
                            <div className='flex items-start'>
                                <div className='bg-primary-50 p-2 rounded-lg'>
                                    <CreditCard size={20} className='text-primary-600' />
                                </div>
                                <div className='ml-3'>
                                    <h3 className='text-sm font-medium text-gray-900'>Track Expenses</h3>
                                    <p className='mt-1 text-xs text-gray-500'>Log planned vs unplanned expenses for better financial control</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-5 rounded-lg shadow-sm'>
                            <div className='flex items-start'>
                                <div className='bg-primary-50 p-2 rounded-lg'>
                                    <PiggyBank size={20} className='text-primary-600' />
                                </div>
                                <div className='ml-3'>
                                    <h3 className='text-sm font-medium text-gray-900'>Smart Suggestions</h3>
                                    <p className='mt-1 text-xs text-gray-500'>Receive personalized tips to optimize your family's spending</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-5 rounded-lg shadow-sm'>
                            <div className='flex items-start'>
                                <div className='bg-primary-50 p-2 rounded-lg'>
                                    <ChevronRight size={20} className='text-primary-600' />
                                </div>
                                <div className='ml-3'>
                                    <h3 className='text-sm font-medium text-gray-900'>Start Today</h3>
                                    <p className='mt-1 text-xs text-gray-500'>Sign up for free and take control of your family finances</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default SignIn;

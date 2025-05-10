import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from './../assets/images/logo.svg';
import backgroundImage from '../assets/images/auth-banner.jpg';

const SignUp: React.FC = () => {
    const { signUp } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        setLoading(true);

        try {
            await signUp(email, password, displayName);
            setSuccess(true);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setError('Email is already in use. Please try a different email or sign in.');
            } else {
                setError('Failed to create an account. Please try again.');
            }
            console.error('Error signing up:', error);
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
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white/60 py-8 px-4 shadow sm:rounded-lg sm:px-10 backdrop-blur-sm'>
                    {success ? (
                        <div className='rounded-md bg-success-50 p-4 mb-4'>
                            <div className='flex'>
                                <div className='ml-3'>
                                    <h3 className='text-sm font-medium text-success-800'>Account created successfully!</h3>
                                    <p className='mt-2 text-sm text-success-700'>
                                        You are now signed in. Start by adding your family members and tracking expenses.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='sm:mx-auto sm:w-full sm:max-w-md mb-4'>
                                <div className='flex justify-center mb-2'>
                                    <div className='h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center text-white overflow-hidden'>
                                        <img src={logo} alt='logo' className='size-full' />
                                    </div>
                                </div>
                                <h2 className='text-center text-3xl font-bold text-gray-900'>Ghar Kharcha</h2>
                                <p className='mt-2 text-center text-gray-600 text-base'>Paise udte hain? Hum pakad ke bithaayenge!</p>
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
                                    <label htmlFor='displayName' className='block text-sm font-medium text-gray-700'>
                                        Name
                                    </label>
                                    <div className='mt-1'>
                                        <input
                                            id='displayName'
                                            name='displayName'
                                            type='text'
                                            autoComplete='name'
                                            required
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className='input-field'
                                        />
                                    </div>
                                </div>

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
                                            autoComplete='new-password'
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className='input-field'
                                        />
                                        <p className='mt-1 text-xs text-gray-500'>Password must be at least 6 characters long</p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor='passwordConfirm' className='block text-sm font-medium text-gray-700'>
                                        Confirm Password
                                    </label>
                                    <div className='mt-1'>
                                        <input
                                            id='passwordConfirm'
                                            name='passwordConfirm'
                                            type='password'
                                            autoComplete='new-password'
                                            required
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            className='input-field'
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                                    >
                                        {loading ? 'Creating account...' : 'Sign up'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

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
                                Already have an account?{' '}
                                <Link to='/signin' className='font-medium text-primary-600 hover:text-primary-500'>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

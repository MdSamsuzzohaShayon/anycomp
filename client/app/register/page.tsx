'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import FormField from '../../components/ul/FormField';
import Button from '../../components/ul/Button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/ToastContext';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading } = useAuth();
    const { toasts, success, error, removeToast } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        company: '',
        role: 'admin',
    });
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        company: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = { email: '', password: '', confirmPassword: '', fullName: '', company: '' };
        let isValid = true;

        if (!formData.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!formData.fullName) {
            errors.fullName = 'Full name is required';
            isValid = false;
        }

        if (!formData.company) {
            errors.company = 'Company name is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const { confirmPassword, fullName, company, ...registerData } = formData;

        const result = await register(registerData);

        if (result.success) {
            success('Account created successfully! Welcome aboard!');
        } else {
            error(result.error || 'Registration failed. Please try again.');
        }
    };
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            router.push('/specialists');
        }
      }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-blue-600 mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-600 mt-2">Join us and get started with your journey</p>
                </div>

                {/* Register Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="Full Name"
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={formErrors.fullName}
                            required
                            autoComplete="name"
                        />

                        <FormField
                            label="Company Name"
                            type="text"
                            name="company"
                            placeholder="Enter your company name"
                            value={formData.company}
                            onChange={handleChange}
                            error={formErrors.company}
                            required
                            autoComplete="organization"
                        />

                        <FormField
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            error={formErrors.email}
                            required
                            autoComplete="email"
                        />

                        <FormField
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            required
                            autoComplete="new-password"
                        />

                        <FormField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={formErrors.confirmPassword}
                            required
                            autoComplete="new-password"
                        />

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link href="/terms" className="text-blue-600 hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-blue-600 hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Register (Optional) */}
                    <div className="space-y-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => console.log('Google register')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Sign up with Google</span>
                            </div>
                        </Button>
                    </div>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                    <p className="mt-2">© 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
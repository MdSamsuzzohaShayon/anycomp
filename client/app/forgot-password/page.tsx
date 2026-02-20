'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ul/Button';
import FormField from '../../components/ul/FormField';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/ToastContext';


export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuth();
  const { success, error } = useToast();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    const result = await forgotPassword(email);
    
    if (result.success) {
      success('Reset link sent! Check your email for instructions.');
      setIsSubmitted(true);
    } else {
      error(result.error || 'Failed to send reset link. Please try again.');
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
        {/* Back to Login */}
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-red-600 mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            {isSubmitted 
              ? "We've sent you an email with reset instructions" 
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        {/* Reset Form / Success Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isSubmitted ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-600 mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">Check Your Email</h3>
                <p className="text-gray-600">
                  We've sent password reset instructions to:
                </p>
                <p className="font-medium text-gray-900">{email}</p>
                <p className="text-sm text-gray-500">
                  If you don't see the email, check your spam folder.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    setEmail('');
                    setIsSubmitted(false);
                  }}
                >
                  Resend Reset Link
                </Button>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    Still having trouble?{' '}
                    <Link
                      href="/support"
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                  required
                  autoComplete="email"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    You'll receive an email with a link to reset your password. 
                    The link will expire in 1 hour for security.
                  </p>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Send Reset Link
                </Button>
              </form>

              {/* Additional Help */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">Need help?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Ensure you're entering the email associated with your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Check your spam or junk folder if you don't see the email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>
                        Contact{' '}
                        <Link href="/support" className="text-blue-600 hover:underline">
                          support
                        </Link>{' '}
                        if you continue to have issues
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Remember your password?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
              Sign in here
            </Link>
          </p>
          <p className="mt-2">© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
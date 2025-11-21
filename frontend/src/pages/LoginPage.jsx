import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Hand } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Navigate ke dashboard setelah login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Purple Section */}
      <div className="hidden lg:flex w-1/2 bg-[#3b2f6e] p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        <div className="z-10 relative">
           <h1 className="text-6xl font-bold mb-6 tracking-tight">Halo👋</h1>
           <p className="text-2xl font-light leading-relaxed opacity-90">
             Selamat datang di platform<br/>
             <span className="font-semibold">AI Learning Insight!</span>
           </p>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fc] p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#3b2f6e]">Halo, User!</h2>
                <p className="text-gray-600 mb-8">Login to your Account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-900 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-white border-gray-300 h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-900 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 bg-white border-gray-300 h-12"
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#5b4d98] hover:bg-[#4a3e7d] text-white h-12 text-lg font-medium"
              >
                Submit
              </Button>
            </form>

            <p className="text-center mt-6 text-gray-700">
              Belum punya akun?{' '}
              <Link 
                to="/register"
                className="text-[#3b2f6e] font-bold hover:underline"
              >
                Register
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
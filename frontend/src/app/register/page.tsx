'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/context/auth-context';
import { UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!, $role: Role!, $country: Country!) {
    signup(input: { email: $email, password: $password, name: $name, role: $role, country: $country }) {
      accessToken
      user {
        id
        email
        name
        role
        country
      }
    }
  }
`;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'MEMBER',
    country: 'INDIA'
  });
  const { login } = useAuth();
  
  const [signupMutation, { loading, error }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      login(data.signup.accessToken, data.signup.user);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signupMutation({ variables: formData });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-600 mb-6">
            <UserPlus size={40} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Create Account</h2>
          <p className="mt-3 text-gray-500 font-medium">Join FoodFlow today</p>
        </div>
        
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
              <input
                type="text"
                required
                className="block w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
              <input
                type="email"
                required
                className="block w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Password</label>
              <input
                type="password"
                required
                className="block w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Role</label>
                <select 
                  className="block w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="MEMBER">Member</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Country</label>
                <select 
                  className="block w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all appearance-none"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                >
                  <option value="INDIA">India</option>
                  <option value="AMERICA">America</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-3 rounded-xl font-bold">
              {error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 bg-orange-600 text-white text-lg font-black rounded-xl hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:opacity-50 transition-all shadow-lg shadow-orange-600/30"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Get Started'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 font-medium">
            Already a member?{' '}
            <Link href="/login" className="text-orange-600 font-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

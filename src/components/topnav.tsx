'use client';

import React, { useState } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaShoppingCart } from "react-icons/fa"; 

export function TopNav() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          PC Prime Parts
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-1/2 max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="p-2 pl-8 border rounded-md w-full"
        />
        <AiOutlineSearch className="absolute left-2 top-1/2 transform -translate-y-1/2" size={20} />
        <button type="submit" className="hidden">Search</button>
      </form>

      <div className="flex flex-row gap-4 items-center">
        <Link className="flex items-center text-gray-800 hover:text-black" href="/cart">
            <FaShoppingCart size={24} /> {/* Cart icon */}
        </Link>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
} 
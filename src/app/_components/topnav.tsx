import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { FaShoppingCart } from "react-icons/fa"; // Import the cart icon from react-icons
import Link from "next/link"; // Import Link for navigation

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <Link href="/">
        <div className="text-3xl font-bold text-gray-800 hover:text-black" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          PC Prime Parts
        </div>
      </Link>

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
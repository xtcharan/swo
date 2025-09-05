import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms & Conditions
          </Link>
        </div>
        <p className="text-center text-sm mt-2">
          © 2025 SWO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderConfirmation() {

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold font-clash mb-4">Thank you for your order!</h1>
        <p className="text-gray-600 font-clash mb-8">
          Your order has been processed successfully.
        </p>
        <Link href={'/'}>
        <Button
          className="rounded-none bg-[#2A254B] px-8 hover:bg-[#2A254B]/90 font-clash"
        >
          Continue Shopping
        </Button>
        </Link>
      </div>
    </div>
  );
}
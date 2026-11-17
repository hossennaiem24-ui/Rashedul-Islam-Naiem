import React, { useState } from 'react';
import { CheckCircle2, Lock, X } from 'lucide-react';
import type { CartItem, Order } from '../types';

interface CheckoutModalProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  items,
  onClose,
  onOrderCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!open) return null;

  const subtotal = items.reduce((s, item) => s + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 120;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setError('Please complete your name, phone number, and delivery address.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          address,
          city,
          paymentMethod,
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            sku: i.product.sku,
            price: i.product.price,
            quantity: i.quantity,
            selectedSize: i.selectedSize,
            image: i.product.image,
          })),
        }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || 'Could not place order.');
      }
      const order = (await response.json()) as Order;
      setConfirmedOrder(order);
      onOrderCreated(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-[1px]" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white border border-neutral-200 max-h-[92vh] overflow-y-auto">
        <div className="h-14 px-6 bg-[#0A0A0A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
            <Lock className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Naiem Arong Checkout</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close checkout"
            className="text-neutral-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-8 md:p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#DC2626] mx-auto mb-4" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">
              ORDER CONFIRMED
            </p>
            <h2 className="font-serif text-3xl font-semibold text-[#0A0A0A] mb-2">
              Order #{confirmedOrder.orderNumber} Confirmed
            </h2>
            <p className="text-sm text-neutral-600 max-w-md mx-auto mb-6">
              Thank you, <strong className="text-[#0A0A0A]">{confirmedOrder.customerName}</strong>.
              Our Dhaka fulfillment studio is preparing your order via{' '}
              <strong className="text-[#0A0A0A]">{confirmedOrder.paymentMethod}</strong>.
            </p>

            <div className="max-w-md mx-auto border border-neutral-200 bg-neutral-50 p-5 text-left space-y-2 mb-8">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Delivery To</span>
                <span className="font-semibold text-[#0A0A0A]">
                  {confirmedOrder.address}, {confirmedOrder.city}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Contact Phone</span>
                <span className="font-mono font-semibold text-[#0A0A0A]">
                  {confirmedOrder.phone}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-neutral-200">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-[#DC2626]">
                  ৳{confirmedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="bg-[#0A0A0A] hover:bg-[#DC2626] text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5">
            {/* Customer Details */}
            <div className="md:col-span-3 p-6 space-y-4 border-b md:border-b-0 md:border-r border-neutral-200">
              <h3 className="font-serif text-xl font-semibold text-[#0A0A0A]">
                Delivery Verification
              </h3>

              {error && (
                <div className="p-3 bg-red-50 border border-[#DC2626] text-xs font-medium text-[#B91C1C]">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ayesha Siddiqua"
                  className="w-full h-10 px-3 border border-neutral-300 text-sm focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Block / Area"
                  className="w-full h-10 px-3 border border-neutral-300 text-sm focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    City / District
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-3 border border-neutral-300 text-sm bg-white focus:outline-none focus:border-[#0A0A0A]"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Outside Bangladesh">International</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as Order['paymentMethod'])
                    }
                    className="w-full h-10 px-3 border border-neutral-300 text-sm bg-white focus:outline-none focus:border-[#0A0A0A]"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="bKash / Nagad">bKash / Nagad</option>
                    <option value="Card Payment">Card Payment</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-2 p-6 bg-neutral-50 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A0A0A] pb-3 border-b border-neutral-200">
                  Order Summary
                </h4>
                <div className="divide-y divide-neutral-200 max-h-56 overflow-y-auto my-2">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="py-2.5 flex justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0A0A0A] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-neutral-500">
                          {item.selectedSize} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono font-semibold text-[#0A0A0A] tabular-nums shrink-0">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Delivery Fee</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? 'Free' : `৳${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0A0A0A] pt-2 border-t border-neutral-200">
                  <span>Total Payable</span>
                  <span className="font-mono tabular-nums text-[#DC2626]">
                    ৳{total.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 mt-3 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors"
                >
                  {submitting ? 'Confirming Order...' : 'PLACE ORDER'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

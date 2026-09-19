import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShippingAddress, MpesaMethod, Order } from '../types';
import { formatKSh, normalizeKenyanPhone, formatDate } from '../utils/formatters';
import { 
  X, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Store, 
  Lock, 
  ArrowRight, 
  Receipt, 
  Copy, 
  Check, 
  ExternalLink,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export const MpesaCheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotalKsh,
    deliveryFeeKsh,
    cartTotalKsh,
    user,
    placeMpesaOrder,
    setIsProfileModalOpen,
    setProfileModalTab,
  } = useStore();

  if (!isCheckoutModalOpen) return null;

  // Form State
  const [step, setStep] = useState<'details' | 'payment' | 'processing_stk' | 'confirmed'>('details');
  const [fullName, setFullName] = useState(user?.name || 'Dennis Opiyo');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '0712984532');
  const [county, setCounty] = useState(user?.county || 'Nairobi');
  const [town, setTown] = useState(user?.town || 'Westlands');
  const [address, setAddress] = useState(user?.defaultAddress || 'Rhapta Road, Westlands, Nairobi');
  const [deliveryMethod, setDeliveryMethod] = useState<'nairobi_express' | 'countrywide_courier' | 'cbd_pickup'>('nairobi_express');
  
  // M-Pesa method selection
  const [mpesaMethod, setMpesaMethod] = useState<MpesaMethod>('stk_push');
  const [manualTransactionCode, setManualTransactionCode] = useState('');
  const [stkSimulatedPin, setStkSimulatedPin] = useState('');
  const [stkPromptVisible, setStkPromptVisible] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Initiating Daraja STK Push to Safaricom network...');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const kenyaCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 
    'Machakos', 'Uasin Gishu (Eldoret)', 'Kajiado', 'Kilifi', 'Nyeri'
  ];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneVal = normalizeKenyanPhone(phoneInput);
    if (!phoneVal.isValid) {
      setPhoneError('Please enter a valid Kenyan Safaricom number (e.g., 0712 345 678 or +254 7...)');
      return;
    }
    setPhoneError('');
    setStep('payment');
  };

  const startStkPushFlow = () => {
    setStep('processing_stk');
    setProcessingMessage('Sending Lipa Na M-Pesa STK Push prompt to your phone...');
    setStkPromptVisible(false);

    // Simulate Daraja API STK Push delay (1.2 seconds)
    setTimeout(() => {
      setStkPromptVisible(true);
    }, 1200);
  };

  const confirmStkPinSubmission = () => {
    setStkPromptVisible(false);
    setProcessingMessage('Verifying M-Pesa PIN & executing Daraja settlement callback...');

    setTimeout(() => {
      completeOrderPlacement();
    }, 1600);
  };

  const handleManualCodeSubmit = () => {
    if (!manualTransactionCode || manualTransactionCode.length < 8) {
      alert('Please enter a valid 10-character M-Pesa transaction code (e.g. QK8923KL90).');
      return;
    }
    completeOrderPlacement(manualTransactionCode.toUpperCase());
  };

  const completeOrderPlacement = (customCode?: string) => {
    const shipping: ShippingAddress = {
      fullName,
      phone: phoneInput,
      county,
      town,
      deliveryAddress: address,
      deliveryMethod,
    };

    const newOrder = placeMpesaOrder(shipping, {
      method: mpesaMethod,
      phoneNumber: normalizeKenyanPhone(phoneInput).raw,
      amountKsh: cartTotalKsh,
    });

    if (customCode) {
      newOrder.mpesaDetails.receiptNumber = customCode;
    }

    setConfirmedOrder(newOrder);
    setStep('confirmed');
  };

  const copyReceiptCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const openOrderHistory = () => {
    setIsCheckoutModalOpen(false);
    setProfileModalTab('orders');
    setIsProfileModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with M-Pesa Badge */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Lipa Na M-Pesa Checkout</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  KENYA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Total to Pay: <strong className="text-emerald-400 font-black">{formatKSh(cartTotalKsh)}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Stages */}
        <div className="p-6">
          {/* STEP 1: SHIPPING & CONTACT DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>1. Delivery Destination &amp; Contact</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dennis Opiyo"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Safaricom M-Pesa Phone</span>
                    <span className="text-[10px] text-emerald-600 font-mono">+254 / 07...</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none font-mono font-semibold"
                  />
                </div>
              </div>

              {phoneError && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{phoneError}</span>
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">County</label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none bg-white font-medium"
                  >
                    {kenyaCounties.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Town / Area</label>
                  <input
                    type="text"
                    required
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Westlands, Kilimani, Nyali"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Street Address / Apartment / Landmark
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Rhapta Road, Mirage Plaza, 4th Floor"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:outline-none"
                />
              </div>

              {/* Delivery Option */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700 block">Shipping Speed:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    onClick={() => setDeliveryMethod('nairobi_express')}
                    className={`p-2.5 rounded-xl border cursor-pointer flex flex-col justify-between text-xs transition-all ${
                      deliveryMethod === 'nairobi_express'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Nairobi Express</span>
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">2-4 Hours Dispatch</span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('countrywide_courier')}
                    className={`p-2.5 rounded-xl border cursor-pointer flex flex-col justify-between text-xs transition-all ${
                      deliveryMethod === 'countrywide_courier'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Upcountry Courier</span>
                      <Truck className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">1-2 Days Countrywide</span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('cbd_pickup')}
                    className={`p-2.5 rounded-xl border cursor-pointer flex flex-col justify-between text-xs transition-all ${
                      deliveryMethod === 'cbd_pickup'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">CBD Store Pickup</span>
                      <Store className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">Pick up today free</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-600 font-mono">
                  Order Total: <strong className="text-emerald-600 font-black text-sm">{formatKSh(cartTotalKsh)}</strong>
                </div>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Continue to M-Pesa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SELECT M-PESA PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>2. Select M-Pesa Payment Option</span>
                </h4>
                <button
                  onClick={() => setStep('details')}
                  className="text-xs text-slate-500 hover:underline font-mono cursor-pointer"
                >
                  ← Edit Address
                </button>
              </div>

              {/* M-Pesa Options Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMpesaMethod('stk_push')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    mpesaMethod === 'stk_push'
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>M-Pesa STK Push</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Instant popup on phone</p>
                </button>

                <button
                  onClick={() => setMpesaMethod('till_number')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    mpesaMethod === 'till_number'
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Buy Goods (Till)</span>
                    <Store className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Till No: 938210</p>
                </button>

                <button
                  onClick={() => setMpesaMethod('paybill')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    mpesaMethod === 'paybill'
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Paybill</span>
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Business No: 400200</p>
                </button>
              </div>

              {/* METHOD 1: STK PUSH (RECOMMENDED) */}
              {mpesaMethod === 'stk_push' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Lipa Na M-Pesa Online (Daraja STK Push)</h5>
                      <p className="text-[11px] text-slate-500">
                        An automatic Safaricom authorization prompt will be sent to your phone.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Phone Number to Prompt:</span>
                      <strong className="font-mono text-slate-900">{normalizeKenyanPhone(phoneInput).formatted}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Amount to Deduct:</span>
                      <strong className="font-mono text-emerald-600 font-bold">{formatKSh(cartTotalKsh)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Payee:</span>
                      <span className="text-slate-900 font-medium">FOOTWEAR STORE KENYA</span>
                    </div>
                  </div>

                  <button
                    onClick={startStkPushFlow}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Send M-Pesa STK Prompt to {normalizeKenyanPhone(phoneInput).formatted}</span>
                  </button>
                </div>
              )}

              {/* METHOD 2: BUY GOODS TILL NUMBER */}
              {mpesaMethod === 'till_number' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="font-bold text-slate-900">Follow these steps on your phone:</div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                      <li>Go to <strong>M-Pesa</strong> menu on your phone</li>
                      <li>Select <strong>Lipa na M-PESA</strong> &gt; <strong>Buy Goods and Services</strong></li>
                      <li>Enter Till Number: <strong className="text-emerald-700 font-mono text-xs">938210</strong> (Footwear Store Kenya)</li>
                      <li>Enter Amount: <strong className="font-mono">{formatKSh(cartTotalKsh)}</strong></li>
                      <li>Enter your M-Pesa PIN and press OK</li>
                      <li>Paste the 10-character confirmation code below</li>
                    </ol>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      M-Pesa SMS Confirmation Code:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. QK8912X45P"
                        value={manualTransactionCode}
                        onChange={(e) => setManualTransactionCode(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono uppercase font-bold tracking-wider"
                      />
                      <button
                        onClick={handleManualCodeSubmit}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Verify &amp; Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 3: PAYBILL */}
              {mpesaMethod === 'paybill' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Business Number (Paybill):</span>
                      <strong className="font-mono text-slate-900">400200</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Number:</span>
                      <strong className="font-mono text-emerald-700">SHOES-{normalizeKenyanPhone(phoneInput).raw.substring(7)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount:</span>
                      <strong className="font-mono">{formatKSh(cartTotalKsh)}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Enter Paybill M-Pesa Code:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. QK9239KL10"
                        value={manualTransactionCode}
                        onChange={(e) => setManualTransactionCode(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono uppercase font-bold tracking-wider"
                      />
                      <button
                        onClick={handleManualCodeSubmit}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Complete Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: INTERACTIVE SAFARICOM M-PESA STK PUSH DIALOG */}
          {step === 'processing_stk' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-5">
              {!stkPromptVisible ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      {processingMessage}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">
                      Target Phone: {normalizeKenyanPhone(phoneInput).formatted}
                    </p>
                  </div>
                </div>
              ) : (
                /* Authentic Safaricom SIM ToolKit (STK) Push Screen */
                <div className="w-full max-w-sm bg-slate-900 text-white rounded-2xl p-5 border-2 border-emerald-500 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider">
                      SAFARICOM M-PESA (STK)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="text-left space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <p className="text-slate-300 font-mono">
                      Do you want to pay <strong>{formatKSh(cartTotalKsh)}</strong> to{' '}
                      <strong className="text-emerald-400">FOOTWEAR STORE KENYA</strong>?
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Account: <strong>FW-KE-ONLINE</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 block text-left font-mono">
                      Enter M-PESA 4-digit PIN:
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="• • • •"
                      value={stkSimulatedPin}
                      onChange={(e) => setStkSimulatedPin(e.target.value)}
                      className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setStep('payment')}
                      className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmStkPinSubmission}
                      className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                    >
                      Authorize Payment
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono">
                    Test Mode: Click &quot;Authorize Payment&quot; with any PIN to simulate live Safaricom confirmation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMATION & M-PESA RECEIPT */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Payment Successful! Order Confirmed
                </h3>
                <p className="text-xs text-slate-500">
                  Order Number: <strong className="font-mono text-slate-800">{confirmedOrder.orderNumber}</strong>
                </p>
              </div>

              {/* Official Safaricom SMS Receipt Simulator Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs border border-slate-800 space-y-2.5 relative">
                <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>M-PESA OFFICIAL RECEIPT</span>
                  </span>
                  <span>{formatDate(confirmedOrder.mpesaDetails.timestamp)}</span>
                </div>

                <div className="text-slate-200 text-xs leading-relaxed">
                  <strong className="text-emerald-400">{confirmedOrder.mpesaDetails.receiptNumber}</strong> Confirmed.
                  Ksh {confirmedOrder.totalKsh.toLocaleString('en-KE')} paid to{' '}
                  <strong>FOOTWEAR STORE KENYA</strong> on{' '}
                  {new Date(confirmedOrder.mpesaDetails.timestamp).toLocaleDateString('en-KE')} at{' '}
                  {new Date(confirmedOrder.mpesaDetails.timestamp).toLocaleTimeString('en-KE')}.
                  New M-PESA balance: Ksh 48,250.00. Transaction fee: Ksh 0.00.
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-800">
                  <span className="text-slate-400">Transaction Code:</span>
                  <button
                    onClick={() => copyReceiptCode(confirmedOrder.mpesaDetails.receiptNumber)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Order Items & Destination Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">Delivery Information:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Recipient:</span>
                    <strong className="text-slate-800">{confirmedOrder.shippingAddress.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone:</span>
                    <strong className="text-slate-800 font-mono">{confirmedOrder.shippingAddress.phone}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Destination:</span>
                    <span className="text-slate-800">
                      {confirmedOrder.shippingAddress.deliveryAddress}, {confirmedOrder.shippingAddress.town}, {confirmedOrder.shippingAddress.county} County
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Status: {confirmedOrder.estimatedDelivery}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={openOrderHistory}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Track in Profile Order History</span>
                </button>

                <button
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back to Store
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

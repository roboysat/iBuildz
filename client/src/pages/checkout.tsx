import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Language, useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { ShoppingCart, CreditCard, Smartphone, Shield, Truck, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ amount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?success=true`,
      },
    });

    setIsProcessing(false);

    if (error) {
      onError(error.message || "Payment failed");
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-off-white rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-emerald-green" />
          Payment Details
        </h3>
        <PaymentElement className="mb-4" />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-emerald-green hover:bg-emerald-700 text-white py-3 text-lg font-medium"
      >
        {isProcessing ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}
      </Button>
    </form>
  );
}

function UPIPaymentForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [upiId, setUpiId] = useState('');
  const { toast } = useToast();

  const handleUPIPayment = () => {
    if (!upiId) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID to proceed",
        variant: "destructive",
      });
      return;
    }

    // Mock UPI payment process
    toast({
      title: "UPI Payment",
      description: "UPI payment functionality is in development. Redirecting to demo success...",
    });
    
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-off-white rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-emerald-green" />
          UPI Payment
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              type="text"
              placeholder="your-upi-id@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 border border-soft-tan rounded-lg hover:bg-cream cursor-pointer">
              <div className="text-blue-600 font-bold text-lg">GPay</div>
              <div className="text-xs text-slate-gray">Google Pay</div>
            </div>
            <div className="text-center p-3 border border-soft-tan rounded-lg hover:bg-cream cursor-pointer">
              <div className="text-purple-600 font-bold text-lg">PhonePe</div>
              <div className="text-xs text-slate-gray">PhonePe</div>
            </div>
            <div className="text-center p-3 border border-soft-tan rounded-lg hover:bg-cream cursor-pointer">
              <div className="text-blue-800 font-bold text-lg">Paytm</div>
              <div className="text-xs text-slate-gray">Paytm</div>
            </div>
          </div>
        </div>
      </div>
      
      <Button
        onClick={handleUPIPayment}
        className="w-full bg-emerald-green hover:bg-emerald-700 text-white py-3 text-lg font-medium"
      >
        Pay ₹{amount.toLocaleString()} via UPI
      </Button>
    </div>
  );
}

export default function Checkout() {
  const [language, setLanguage] = useState<Language>('en');
  const [isUserPortal, setIsUserPortal] = useState(true);
  const [, setLocation] = useLocation();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const t = useTranslation(language);

  // Form state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    pincode: '',
    state: 'Telangana'
  });

  // Payment state
  const [clientSecret, setClientSecret] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Get product ID from URL params
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  // Check authorization
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, toast]);

  // Check for success parameter
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setOrderSuccess(true);
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!",
      });
    }
  }, [searchParams, toast]);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['/api/furniture-products', productId],
    enabled: !!productId && isAuthenticated,
    retry: false,
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { amount });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/furniture-orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      setOrderSuccess(true);
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (product && paymentMethod === 'card') {
      const totalAmount = parseFloat(product.discountPrice || product.price) * quantity;
      createPaymentIntentMutation.mutate(totalAmount);
    }
  }, [product, paymentMethod, quantity]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handlePortalToggle = () => {
    setIsUserPortal(!isUserPortal);
    if (!isUserPortal) {
      setLocation('/merchant-portal');
    } else {
      setLocation('/');
    }
  };

  const handlePaymentSuccess = () => {
    if (product) {
      const orderData = {
        providerId: product.providerId,
        totalAmount: (parseFloat(product.discountPrice || product.price) * quantity).toString(),
        paymentMethod: paymentMethod,
        paymentStatus: 'completed',
        shippingAddress: shippingAddress,
        customerName: shippingAddress.fullName,
        customerPhone: shippingAddress.phone,
        customerEmail: shippingAddress.email,
      };

      createOrderMutation.mutate(orderData);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  const isFormValid = () => {
    return shippingAddress.fullName && 
           shippingAddress.phone && 
           shippingAddress.email && 
           shippingAddress.address && 
           shippingAddress.city && 
           shippingAddress.pincode;
  };

  if (!isAuthenticated) {
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-cream">
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          isUserPortal={isUserPortal}
          onPortalToggle={handlePortalToggle}
        />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-green mb-6">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
              <p className="text-slate-gray mb-6">
                Thank you for your purchase. You will receive an email confirmation shortly.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setLocation('/services')}
                  className="bg-emerald-green hover:bg-emerald-700 mr-4"
                >
                  Continue Shopping
                </Button>
                <Button 
                  onClick={() => setLocation('/')}
                  variant="outline"
                  className="border-emerald-green text-emerald-green hover:bg-emerald-50"
                >
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream">
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          isUserPortal={isUserPortal}
          onPortalToggle={handlePortalToggle}
        />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
              <p className="text-slate-gray mb-6">
                The product you're trying to purchase could not be found.
              </p>
              <Button 
                onClick={() => setLocation('/services')}
                className="bg-emerald-green hover:bg-emerald-700"
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalAmount = parseFloat(product.discountPrice || product.price) * quantity;

  return (
    <div className="min-h-screen bg-cream">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        isUserPortal={isUserPortal}
        onPortalToggle={handlePortalToggle}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            onClick={() => setLocation('/services')}
            variant="ghost"
            className="text-slate-gray hover:text-emerald-green"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-slate-gray">Quantity: {quantity}</p>
                      <div className="flex items-center space-x-2">
                        {product.discountPrice && (
                          <span className="text-sm text-slate-gray line-through">
                            ₹{product.price}
                          </span>
                        )}
                        <span className="text-emerald-green font-semibold">
                          ₹{product.discountPrice || product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="text-emerald-green">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>Included</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="House number, street name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select 
                      value={shippingAddress.city} 
                      onValueChange={(value) => setShippingAddress(prev => ({ ...prev, city: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L.B. Nagar">L.B. Nagar</SelectItem>
                        <SelectItem value="B.N. Reddy">B.N. Reddy</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="500000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => setPaymentMethod('card')}
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      className={`flex-1 ${paymentMethod === 'card' ? 'bg-emerald-green hover:bg-emerald-700' : 'border-emerald-green text-emerald-green hover:bg-emerald-50'}`}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Card Payment
                    </Button>
                    <Button
                      onClick={() => setPaymentMethod('upi')}
                      variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                      className={`flex-1 ${paymentMethod === 'upi' ? 'bg-emerald-green hover:bg-emerald-700' : 'border-emerald-green text-emerald-green hover:bg-emerald-50'}`}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      UPI Payment
                    </Button>
                  </div>

                  {!isFormValid() && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Please fill in all shipping address fields before proceeding with payment.
                      </p>
                    </div>
                  )}

                  {isFormValid() && (
                    <>
                      {paymentMethod === 'card' && clientSecret && (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <CheckoutForm
                            amount={totalAmount}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                          />
                        </Elements>
                      )}

                      {paymentMethod === 'upi' && (
                        <UPIPaymentForm
                          amount={totalAmount}
                          onSuccess={handlePaymentSuccess}
                        />
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <div className="bg-off-white p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-emerald-green mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Secure Payment</h3>
                  <p className="text-sm text-slate-gray">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption 
                    to protect your personal and financial data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

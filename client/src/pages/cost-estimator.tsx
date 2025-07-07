import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Language, useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, Home, Wrench, DollarSign, Building, Bed, ChefHat, Zap, Briefcase } from "lucide-react";
import { useLocation } from "wouter";

interface CostEstimate {
  id: number;
  roomType: string;
  roomSize: number;
  serviceType: string;
  qualityLevel: string;
  materialCost: string;
  laborCost: string;
  totalCost: string;
  location: string;
  createdAt: string;
}

export default function CostEstimator() {
  const [language, setLanguage] = useState<Language>('en');
  const [isUserPortal, setIsUserPortal] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const t = useTranslation(language);

  // Form state
  const [roomType, setRoomType] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [qualityLevel, setQualityLevel] = useState('');
  const [location, setLocationValue] = useState('');

  // Estimate result
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);

  const createEstimateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/cost-estimates", data);
      return response.json();
    },
    onSuccess: (data) => {
      setEstimate(data);
      toast({
        title: "Success",
        description: "Cost estimate calculated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to calculate cost estimate. Please try again.",
        variant: "destructive",
      });
    },
  });

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

  const handleCalculateEstimate = () => {
    if (!roomType || !roomSize || !serviceType || !qualityLevel) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createEstimateMutation.mutate({
      roomType,
      roomSize: parseInt(roomSize),
      serviceType,
      qualityLevel,
      location: location || 'L.B. Nagar',
    });
  };

  const handleBookService = () => {
    setLocation('/services');
  };

  const handleGetDetailedQuote = () => {
    toast({
      title: "Contact Required",
      description: "Please contact our team for a detailed quote. Redirecting to services...",
    });
    setTimeout(() => {
      setLocation('/services');
    }, 2000);
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'living_room':
        return <Home className="h-5 w-5" />;
      case 'bedroom':
        return <Bed className="h-5 w-5" />;
      case 'kitchen':
        return <ChefHat className="h-5 w-5" />;
      case 'bathroom':
        return <Zap className="h-5 w-5" />;
      case 'office':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        isUserPortal={isUserPortal}
        onPortalToggle={handlePortalToggle}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Calculator className="h-8 w-8 mr-3 text-emerald-green" />
            {t('costEstimator')}
          </h1>
          <p className="text-slate-gray text-lg">{t('costEstimatorDescription')}</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-off-white shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Project Details</CardTitle>
              <p className="text-slate-gray">Provide information about your project for accurate estimation</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="roomType" className="text-sm font-medium text-slate-gray">
                    {t('roomType')} *
                  </Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger className="bg-white border-soft-tan focus:ring-emerald-green">
                      <SelectValue placeholder={`Select ${t('roomType').toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="living_room">
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-2" />
                          {t('livingRoom')}
                        </div>
                      </SelectItem>
                      <SelectItem value="bedroom">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-2" />
                          {t('bedroom')}
                        </div>
                      </SelectItem>
                      <SelectItem value="kitchen">
                        <div className="flex items-center">
                          <ChefHat className="h-4 w-4 mr-2" />
                          {t('kitchen')}
                        </div>
                      </SelectItem>
                      <SelectItem value="bathroom">
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-2" />
                          {t('bathroom')}
                        </div>
                      </SelectItem>
                      <SelectItem value="office">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {t('office')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roomSize" className="text-sm font-medium text-slate-gray">
                    {t('roomSize')} *
                  </Label>
                  <Input
                    id="roomSize"
                    type="number"
                    placeholder={t('enterRoomSize')}
                    value={roomSize}
                    onChange={(e) => setRoomSize(e.target.value)}
                    className="bg-white border-soft-tan focus:ring-emerald-green"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceType" className="text-sm font-medium text-slate-gray">
                    {t('serviceType')} *
                  </Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger className="bg-white border-soft-tan focus:ring-emerald-green">
                      <SelectValue placeholder={`Select ${t('serviceType').toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior_design">
                        <div className="flex items-center">
                          <Wrench className="h-4 w-4 mr-2" />
                          {t('interiorDesignOnly')}
                        </div>
                      </SelectItem>
                      <SelectItem value="furniture">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          {t('furnitureOnly')}
                        </div>
                      </SelectItem>
                      <SelectItem value="complete_package">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {t('completePackage')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qualityLevel" className="text-sm font-medium text-slate-gray">
                    {t('qualityLevel')} *
                  </Label>
                  <Select value={qualityLevel} onValueChange={setQualityLevel}>
                    <SelectTrigger className="bg-white border-soft-tan focus:ring-emerald-green">
                      <SelectValue placeholder={`Select ${t('qualityLevel').toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">{t('premium')}</SelectItem>
                      <SelectItem value="standard">{t('standard')}</SelectItem>
                      <SelectItem value="budget">{t('budget')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location" className="text-sm font-medium text-slate-gray">
                    {t('location')} (Optional)
                  </Label>
                  <Select value={location} onValueChange={setLocationValue}>
                    <SelectTrigger className="bg-white border-soft-tan focus:ring-emerald-green">
                      <SelectValue placeholder="Select location (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L.B. Nagar">{t('lbNagar')}</SelectItem>
                      <SelectItem value="B.N. Reddy">{t('bnReddy')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  onClick={handleCalculateEstimate}
                  disabled={createEstimateMutation.isPending}
                  size="lg"
                  className="bg-emerald-green text-white hover:bg-emerald-700 px-8 py-3 text-lg font-medium"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  {createEstimateMutation.isPending ? "Calculating..." : t('calculateEstimate')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Estimate Result */}
          {estimate && (
            <Card className="bg-white border-emerald-green border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  {getRoomIcon(estimate.roomType)}
                  <span className="ml-2">{t('estimatedCost')}</span>
                </CardTitle>
                <p className="text-slate-gray">
                  {t(estimate.roomType)} • {estimate.roomSize} sq ft • {t(estimate.serviceType)} • {t(estimate.qualityLevel)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <p className="text-sm text-slate-gray mb-2">{t('materialCost')}</p>
                    <p className="text-2xl font-bold text-emerald-green">
                      {formatCurrency(estimate.materialCost)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-cream rounded-lg">
                    <p className="text-sm text-slate-gray mb-2">{t('laborCost')}</p>
                    <p className="text-2xl font-bold text-emerald-green">
                      {formatCurrency(estimate.laborCost)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-emerald-green rounded-lg">
                    <p className="text-sm text-white mb-2">{t('totalEstimate')}</p>
                    <p className="text-3xl font-bold text-white">
                      {formatCurrency(estimate.totalCost)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-cream p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Cost Breakdown Details</h3>
                  <ul className="text-sm text-slate-gray space-y-1">
                    <li>• Material costs include all furniture, fixtures, and design elements</li>
                    <li>• Labor costs cover professional installation and design services</li>
                    <li>• Prices may vary based on specific requirements and market conditions</li>
                    <li>• This is an estimated cost. Final pricing may differ based on actual scope</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleBookService}
                    size="lg"
                    className="bg-emerald-green text-white hover:bg-emerald-700"
                  >
                    {t('bookService')}
                  </Button>
                  <Button
                    onClick={handleGetDetailedQuote}
                    variant="outline"
                    size="lg"
                    className="border-emerald-green text-emerald-green hover:bg-emerald-50"
                  >
                    {t('getDetailedQuote')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Why Choose Our Estimator?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-gray">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Accurate pricing based on current market rates
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Quality-level pricing for different budgets
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Location-based cost adjustments
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Comprehensive material and labor breakdown
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-gray">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Browse our verified service providers
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Schedule a consultation with experts
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Get personalized design recommendations
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-emerald-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Book services with transparent pricing
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

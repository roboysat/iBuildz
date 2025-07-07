import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Language, useTranslation } from "@/lib/i18n";
import { MapPin, Star, Phone, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  images: string[];
  category: string;
  provider: {
    name: string;
    rating: number;
    reviewCount: number;
    location: string;
  };
}

interface FurnitureProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice?: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export default function Services() {
  const [language, setLanguage] = useState<Language>('en');
  const [isUserPortal, setIsUserPortal] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [location, setLocationFilter] = useState<string>('all');
  const [, setLocation] = useLocation();
  const t = useTranslation(language);

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services', category !== 'all' ? category : undefined],
    enabled: category !== 'furniture',
  });

  const { data: furnitureProducts, isLoading: furnitureLoading } = useQuery<FurnitureProduct[]>({
    queryKey: ['/api/furniture-products'],
    enabled: category === 'furniture' || category === 'all',
  });

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handlePortalToggle = () => {
    setIsUserPortal(!isUserPortal);
    if (!isUserPortal) {
      setLocation('/merchant-portal');
    }
  };

  const handleBookService = (serviceId: number) => {
    setLocation(`/book-service/${serviceId}`);
  };

  const handleBuyFurniture = (productId: number) => {
    setLocation(`/checkout?productId=${productId}`);
  };

  const handleContactProvider = (providerId: string) => {
    console.log('Contact provider:', providerId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const isLoading = servicesLoading || furnitureLoading;

  return (
    <div className="min-h-screen bg-cream">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        isUserPortal={isUserPortal}
        onPortalToggle={handlePortalToggle}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('services')}</h1>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48 bg-white border-soft-tan">
                <SelectValue placeholder={t('serviceType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allServices')}</SelectItem>
                <SelectItem value="interior_design">{t('interiorDesign')}</SelectItem>
                <SelectItem value="furniture">{t('furniture')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={location} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-48 bg-white border-soft-tan">
                <SelectValue placeholder={t('location')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('bothAreas')}</SelectItem>
                <SelectItem value="L.B. Nagar">{t('lbNagar')}</SelectItem>
                <SelectItem value="B.N. Reddy">{t('bnReddy')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Interior Design Services */}
            {(category === 'all' || category === 'interior_design') && services?.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={service.images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-emerald-green text-white">
                    {t('interiorDesign')}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <p className="text-slate-gray text-sm line-clamp-2">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(service.provider.rating)}
                      </div>
                      <span className="text-sm text-slate-gray">
                        ({service.provider.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center text-slate-gray text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {service.provider.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-gray">{t('startingFrom')}</p>
                      <p className="text-xl font-bold text-emerald-green">₹{service.price}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleContactProvider(service.id.toString())}
                        variant="outline"
                        size="sm"
                        className="border-emerald-green text-emerald-green hover:bg-emerald-50"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {t('contact')}
                      </Button>
                      <Button
                        onClick={() => handleBookService(service.id)}
                        size="sm"
                        className="bg-emerald-green hover:bg-emerald-700"
                      >
                        {t('bookService')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Furniture Products */}
            {(category === 'all' || category === 'furniture') && furnitureProducts?.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                    {t('furniture')}
                  </Badge>
                  {!product.inStock && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-slate-gray text-sm line-clamp-2">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-slate-gray">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discountPrice && (
                        <p className="text-sm text-slate-gray line-through">₹{product.price}</p>
                      )}
                      <p className="text-xl font-bold text-emerald-green">
                        ₹{product.discountPrice || product.price}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleBuyFurniture(product.id)}
                      disabled={!product.inStock}
                      size="sm"
                      className="bg-emerald-green hover:bg-emerald-700 disabled:bg-gray-300"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {product.inStock ? t('shopNow') : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!services?.length && !furnitureProducts?.length) && (
          <div className="text-center py-12">
            <p className="text-slate-gray text-lg">No services or products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Hero } from "@/components/hero";
import { ServiceSearch, SearchFilters } from "@/components/service-search";
import { FeaturedServices } from "@/components/featured-services";
import { ServiceProviders } from "@/components/service-providers";
import { Header } from "@/components/header";
import { Language } from "@/lib/i18n";
import { useLocation } from "wouter";

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [isUserPortal, setIsUserPortal] = useState(true);
  const [, setLocation] = useLocation();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handlePortalToggle = () => {
    setIsUserPortal(!isUserPortal);
    if (!isUserPortal) {
      setLocation('/merchant-portal');
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    console.log('Search filters:', filters);
    setLocation('/services');
  };

  const handleFindServices = () => {
    setLocation('/services');
  };

  const handleJoinAsProvider = () => {
    setLocation('/merchant-portal');
  };

  const handleViewAllInteriorDesign = () => {
    setLocation('/services?category=interior_design');
  };

  const handleShopFurniture = () => {
    setLocation('/services?category=furniture');
  };

  const handleContactProvider = (providerId: string) => {
    console.log('Contact provider:', providerId);
    // Implementation would handle provider contact
  };

  const handleViewProfile = (providerId: string) => {
    console.log('View profile:', providerId);
    setLocation(`/providers/${providerId}`);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        isUserPortal={isUserPortal}
        onPortalToggle={handlePortalToggle}
      />
      
      <Hero
        language={language}
        onFindServices={handleFindServices}
        onJoinAsProvider={handleJoinAsProvider}
      />
      
      <ServiceSearch
        language={language}
        onSearch={handleSearch}
      />
      
      <FeaturedServices
        language={language}
        onViewAllInteriorDesign={handleViewAllInteriorDesign}
        onShopFurniture={handleShopFurniture}
      />
      
      <ServiceProviders
        language={language}
        onContactProvider={handleContactProvider}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
}

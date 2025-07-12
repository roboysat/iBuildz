import React from "react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Language, useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Home, Award, MapPin } from "lucide-react";

export default function About() {
  const [language, setLanguage] = useState<Language>("en");
  const t = useTranslation(language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const stats = [
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      number: "500+",
      label: "Service Providers",
    },
    {
      icon: <Home className="h-8 w-8 text-emerald-600" />,
      number: "2000+",
      label: "Projects Completed",
    },
    {
      icon: <Award className="h-8 w-8 text-emerald-600" />,
      number: "98%",
      label: "Customer Satisfaction",
    },
    {
      icon: <MapPin className="h-8 w-8 text-emerald-600" />,
      number: "25+",
      label: "Service Locations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white">
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange}
        isUserPortal={true}
        onPortalToggle={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-charcoal mb-4">
              About iBuildz
            </h1>
            <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
              Your trusted partner in connecting homeowners with verified construction professionals across L.B. Nagar and B.N. Reddy areas.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-charcoal mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-charcoal/60">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-charcoal/80 leading-relaxed">
                To bridge the gap between homeowners and reliable service providers, ensuring quality, transparency, and trust in every project. We are committed to transforming how people find and hire construction professionals.
              </p>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">
                Our Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Interior Design & Decoration",
                  "Furniture & Home Furnishing", 
                  "Architecture & Planning",
                  "Plumbing Services",
                  "Electrical Installation",
                  "Carpentry & Woodwork",
                ].map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-center p-3">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">
                Service Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-charcoal/80 mb-4">
                We proudly serve the following areas with our comprehensive network of verified professionals and quality services.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">L.B. Nagar</Badge>
                <Badge variant="outline">B.N. Reddy</Badge>
                <Badge variant="outline">Hyderabad</Badge>
                <Badge variant="outline">Telangana</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
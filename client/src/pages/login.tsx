import { useState } from "react";
import { useLocation } from "wouter";
import { Language, useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useToast } from "@/hooks/use-toast";
import { Home, User, Store } from "lucide-react";

export default function Login() {
  const [language, setLanguage] = useState<Language>("en");
  const t = useTranslation(language);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  });

  const [merchantForm, setMerchantForm] = useState({
    email: "",
    password: "",
    businessName: "",
    serviceType: "",
    location: "",
  });

  const [isRegistering, setIsRegistering] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.email || !userForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Simple demo login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', 'user');
    
    toast({
      title: "Success",
      description: "Logged in successfully!",
    });

    navigate("/");
  };

  const handleMerchantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!merchantForm.email || !merchantForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (isRegistering && (!merchantForm.businessName || !merchantForm.serviceType || !merchantForm.location)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simple demo login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', 'merchant');
    
    toast({
      title: "Success",
      description: isRegistering ? "Account created successfully!" : "Logged in successfully!",
    });

    navigate("/merchant-portal");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Home className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-charcoal">iBuildz</h1>
          </div>
          <p className="text-charcoal/60">
            {t.login.subtitle}
          </p>
          <div className="mt-4">
            <LanguageSwitcher 
              language={language} 
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{t.login.user}</span>
            </TabsTrigger>
            <TabsTrigger value="merchant" className="flex items-center space-x-2">
              <Store className="h-4 w-4" />
              <span>{t.login.merchant}</span>
            </TabsTrigger>
          </TabsList>

          {/* User Login */}
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>{t.login.user} {t.login.title}</CardTitle>
                <CardDescription>
                  {t.login.userDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="user-email">{t.login.email}</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-password">{t.login.password}</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t.login.signin}
                  </Button>
                </form>
                <div className="mt-4 text-sm text-charcoal/60">
                  <p>Demo credentials: user@demo.com / password123</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Merchant Login */}
          <TabsContent value="merchant">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t.login.merchant} {isRegistering ? t.login.register : t.login.title}
                </CardTitle>
                <CardDescription>
                  {isRegistering ? t.login.merchantRegisterDescription : t.login.merchantDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMerchantLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="merchant-email">{t.login.email}</Label>
                    <Input
                      id="merchant-email"
                      type="email"
                      value={merchantForm.email}
                      onChange={(e) => setMerchantForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="merchant@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="merchant-password">{t.login.password}</Label>
                    <Input
                      id="merchant-password"
                      type="password"
                      value={merchantForm.password}
                      onChange={(e) => setMerchantForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>

                  {isRegistering && (
                    <>
                      <div>
                        <Label htmlFor="business-name">{t.login.businessName}</Label>
                        <Input
                          id="business-name"
                          type="text"
                          value={merchantForm.businessName}
                          onChange={(e) => setMerchantForm(prev => ({ ...prev, businessName: e.target.value }))}
                          placeholder="Your Business Name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="service-type">{t.login.serviceType}</Label>
                        <Select onValueChange={(value) => setMerchantForm(prev => ({ ...prev, serviceType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="interior-design">Interior Design</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="architecture">Architecture</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="carpentry">Carpentry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="location">{t.login.location}</Label>
                        <Select onValueChange={(value) => setMerchantForm(prev => ({ ...prev, location: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lb-nagar">L.B. Nagar</SelectItem>
                            <SelectItem value="bn-reddy">B.N. Reddy</SelectItem>
                            <SelectItem value="hyderabad">Hyderabad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full">
                    {isRegistering ? t.login.register : t.login.signin}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    {isRegistering ? t.login.hasAccount : t.login.noAccount}
                  </button>
                </div>

                {!isRegistering && (
                  <div className="mt-4 text-sm text-charcoal/60">
                    <p>Demo credentials: merchant@demo.com / password123</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
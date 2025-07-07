import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuth } from "@/hooks/useAuth";
import { Language, useTranslation } from "@/lib/i18n";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  isUserPortal: boolean;
  onPortalToggle: () => void;
}

export function Header({ language, onLanguageChange, isUserPortal, onPortalToggle }: HeaderProps) {
  const { isAuthenticated, user } = useAuth();
  const t = useTranslation(language);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-off-white shadow-sm border-b border-warm-beige">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-800">iBuildz</h1>
              <p className="text-xs text-slate-gray">Real Estate Services</p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-800 hover:text-emerald-green px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/services" className="text-slate-gray hover:text-emerald-green px-3 py-2 rounded-md text-sm font-medium">
                Services
              </Link>
              <Link href="/about" className="text-slate-gray hover:text-emerald-green px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/contact" className="text-slate-gray hover:text-emerald-green px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
            
            {isAuthenticated && (
              <div className="flex bg-warm-beige rounded-lg p-1">
                <button
                  onClick={onPortalToggle}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    isUserPortal 
                      ? "bg-white text-gray-800 shadow-sm" 
                      : "text-slate-gray hover:bg-white hover:text-gray-800"
                  }`}
                >
                  User Portal
                </button>
                <button
                  onClick={onPortalToggle}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    !isUserPortal 
                      ? "bg-white text-gray-800 shadow-sm" 
                      : "text-slate-gray hover:bg-white hover:text-gray-800"
                  }`}
                >
                  Merchant Portal
                </button>
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-gray">
                  {user?.firstName || user?.email}
                </span>
                <Button
                  onClick={() => window.location.href = "/api/logout"}
                  variant="outline"
                  size="sm"
                  className="border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = "/login"}
                className="bg-emerald-green text-white hover:bg-emerald-700"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-gray-800 hover:text-emerald-green"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-off-white border-t border-warm-beige">
              <Link href="/" className="text-gray-800 hover:text-emerald-green block px-3 py-2 rounded-md text-base font-medium">
                {t('home')}
              </Link>
              <Link href="/services" className="text-slate-gray hover:text-emerald-green block px-3 py-2 rounded-md text-base font-medium">
                {t('services')}
              </Link>
              <Link href="/about" className="text-slate-gray hover:text-emerald-green block px-3 py-2 rounded-md text-base font-medium">
                {t('about')}
              </Link>
              <Link href="/contact" className="text-slate-gray hover:text-emerald-green block px-3 py-2 rounded-md text-base font-medium">
                {t('contact')}
              </Link>
              
              {isAuthenticated && (
                <div className="pt-4 border-t border-warm-beige">
                  <div className="flex bg-warm-beige rounded-lg p-1 mb-3">
                    <button
                      onClick={onPortalToggle}
                      className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        isUserPortal 
                          ? "bg-white text-gray-800 shadow-sm" 
                          : "text-slate-gray hover:bg-white hover:text-gray-800"
                      }`}
                    >
                      {t('userPortal')}
                    </button>
                    <button
                      onClick={onPortalToggle}
                      className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        !isUserPortal 
                          ? "bg-white text-gray-800 shadow-sm" 
                          : "text-slate-gray hover:bg-white hover:text-gray-800"
                      }`}
                    >
                      {t('merchantPortal')}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-warm-beige">
                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      localStorage.removeItem('user');
                      window.location.href = "/";
                    }}
                    variant="outline"
                    className="w-full border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-white"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => window.location.href = "/login"}
                    className="w-full bg-emerald-green text-white hover:bg-emerald-700"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

import { ReactNode } from "react";
import logo from "@/assets/swatimanish-logo.png";

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function OnboardingLayout({ children, title, subtitle }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="SwatiManish" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Secure OAuth authentication • Your data is protected</p>
        </div>
      </div>
    </div>
  );
}
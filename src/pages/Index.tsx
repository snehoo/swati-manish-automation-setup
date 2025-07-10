import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OAuthDialog } from "@/components/OAuthDialog";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Settings, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type ConnectionStatus = {
  gmail: boolean;
  instagram: boolean;
};

type LoadingStatus = {
  gmail: boolean;
  instagram: boolean;
  finalizing: boolean;
};

const WEBHOOK_ENDPOINT = "https://your-webhook-endpoint.com/oauth-complete"; // User will provide this

const Index = () => {
  const [connections, setConnections] = useState<ConnectionStatus>({
    gmail: false,
    instagram: false,
  });
  
  const [loading, setLoading] = useState<LoadingStatus>({
    gmail: false,
    instagram: false,
    finalizing: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      title: "Connect Gmail",
      description: "Authorize email automation"
    },
    {
      title: "Connect Instagram", 
      description: "Authorize social media automation"
    },
    {
      title: "Complete Setup",
      description: "Finalize your automation"
    }
  ];

  const handleOAuthSuccess = (provider: 'gmail' | 'instagram', token: string) => {
    setConnections(prev => ({ ...prev, [provider]: true }));
    
    toast({
      title: `${provider === 'gmail' ? 'Gmail' : 'Instagram'} Connected!`,
      description: "Your account has been successfully connected.",
    });

    // Update step progress
    if (provider === 'gmail' && currentStep === 1) {
      setCurrentStep(2);
    } else if (provider === 'instagram' && currentStep === 2) {
      setCurrentStep(3);
    }
    
    // Store token for webhook submission
    console.log(`${provider} token:`, token);
  };

  const handleFinishSetup = async () => {
    setLoading(prev => ({ ...prev, finalizing: true }));
    
    try {
      // Simulate API call to webhook endpoint
      const userData = {
        name: "User Name", // In real app, get from OAuth response
        email: "user@example.com", // In real app, get from OAuth response
        gmail_token: "gmail_oauth_token_here", // In real app, get from OAuth
        instagram_token: "instagram_oauth_token_here", // In real app, get from OAuth
        timestamp: new Date().toISOString(),
      };

      // Note: In real implementation, send to actual webhook
      console.log("Would send to webhook:", WEBHOOK_ENDPOINT, userData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsComplete(true);
      
      toast({
        title: "Setup Complete!",
        description: "Your automation assistant is now ready to help.",
      });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, finalizing: false }));
    }
  };

  if (isComplete) {
    return (
      <OnboardingLayout 
        title="You're All Set!"
        subtitle="Your automation assistant is now ready to help you streamline your workflows."
      >
        <div className="text-center space-y-8 animate-scale-in">
          <div className="flex justify-center">
            <div className="p-6 bg-success/10 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-success" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome to SwatiManish Automation!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your Gmail and Instagram accounts are now connected. Our automation assistant 
              will help you save time and streamline your daily workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 bg-card rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <h3 className="font-semibold">Gmail Connected</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Email automation and workflow management enabled
              </p>
            </div>
            
            <div className="p-6 bg-card rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <h3 className="font-semibold">Instagram Connected</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Social media automation and content management enabled
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              variant="gradient" 
              size="xl"
              className="animate-pulse-glow"
            >
              <Sparkles className="w-5 h-5" />
              Start Automating
            </Button>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Link to="/settings">
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
      </div>
      <OnboardingLayout 
        title="Welcome to SwatiManish Automation Setup"
        subtitle="Let's connect your accounts to get started with powerful automation workflows."
      >
      <ProgressIndicator 
        currentStep={currentStep}
        totalSteps={3}
        steps={steps}
      />

      <div className="space-y-8">
        {/* Step 1: Gmail */}
        <div className="animate-slide-up">
          <OAuthDialog
            provider="gmail"
            onSuccess={(token) => handleOAuthSuccess('gmail', token)}
          >
            <div className="w-full">
              <div className="p-6 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Connect Gmail</h3>
                      <p className="text-sm text-muted-foreground">Enable email automation and workflow management</p>
                    </div>
                  </div>
                  {connections.gmail ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </OAuthDialog>
        </div>

        {/* Step 2: Instagram */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <OAuthDialog
            provider="instagram"
            onSuccess={(token) => handleOAuthSuccess('instagram', token)}
          >
            <div className="w-full">
              <div className={`p-6 bg-card rounded-xl border border-border shadow-card transition-all duration-300 ${!connections.gmail ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-card-hover cursor-pointer'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-pink-500/10 rounded-lg">
                      <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Connect Instagram</h3>
                      <p className="text-sm text-muted-foreground">Enable social media automation and content management</p>
                    </div>
                  </div>
                  {connections.instagram ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" disabled={!connections.gmail}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </OAuthDialog>
        </div>

        {/* Step 3: Finish Setup */}
        {connections.gmail && connections.instagram && (
          <div className="text-center pt-8 animate-fade-in">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Great! Both accounts are connected.
              </h3>
              <p className="text-muted-foreground">
                Click below to finalize your setup and start automating your workflows.
              </p>
              <Button
                variant="gradient"
                size="xl"
                onClick={handleFinishSetup}
                disabled={loading.finalizing}
                className="min-w-48"
              >
                {loading.finalizing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Finalizing Setup...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Finish Setup
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="text-center mt-12 space-y-2">
        <p className="text-sm text-muted-foreground">
          Your accounts will be securely connected using OAuth 2.0 authentication.
        </p>
        <p className="text-xs text-muted-foreground">
          We only access the permissions you explicitly grant during the connection process.
        </p>
      </div>
    </OnboardingLayout>
    </div>
  );
};

export default Index;

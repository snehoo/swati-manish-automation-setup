import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { OAuthButton } from "@/components/OAuthButton";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { CheckCircle2, Sparkles } from "lucide-react";
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

  const handleOAuthConnect = async (provider: 'gmail' | 'instagram') => {
    setLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      // Simulate OAuth flow - in real implementation, this would redirect to OAuth provider
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
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
          <OAuthButton
            provider="gmail"
            isConnected={connections.gmail}
            isLoading={loading.gmail}
            onConnect={() => handleOAuthConnect('gmail')}
            disabled={loading.instagram || loading.finalizing}
          />
        </div>

        {/* Step 2: Instagram */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <OAuthButton
            provider="instagram"
            isConnected={connections.instagram}
            isLoading={loading.instagram}
            onConnect={() => handleOAuthConnect('instagram')}
            disabled={!connections.gmail || loading.gmail || loading.finalizing}
          />
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
  );
};

export default Index;

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Instagram, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OAuthDialogProps {
  provider: 'gmail' | 'instagram';
  onSuccess: (token: string) => void;
  children: React.ReactNode;
}

export function OAuthDialog({ provider, onSuccess, children }: OAuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'auth' | 'callback'>('auth');
  const [authCode, setAuthCode] = useState("");

  const config = {
    gmail: {
      name: 'Gmail',
      icon: Mail,
      authUrl: 'https://accounts.google.com/oauth/authorize',
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
      color: 'text-red-500',
    },
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      authUrl: 'https://api.instagram.com/oauth/authorize',
      scopes: ['user_profile', 'user_media'],
      color: 'text-pink-500',
    }
  };

  const { name, icon: Icon, authUrl, scopes, color } = config[provider];

  const handleStartAuth = () => {
    setIsLoading(true);
    
    // Simulate OAuth flow
    setTimeout(() => {
      setIsLoading(false);
      setStep('callback');
      toast({
        title: "OAuth Window Opened",
        description: `Redirected to ${name} authentication. Copy the authorization code from the callback URL.`,
      });
    }, 1500);
  };

  const handleCodeSubmit = async () => {
    if (!authCode.trim()) {
      toast({
        title: "Authorization Code Required",
        description: "Please enter the authorization code from the callback URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate token exchange
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock token for testing
      const mockToken = `${provider}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      onSuccess(mockToken);
      setIsOpen(false);
      setStep('auth');
      setAuthCode("");
      setIsLoading(false);
      
      toast({
        title: "Authentication Successful",
        description: `${name} account connected successfully.`,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Authentication Failed",
        description: "Failed to exchange authorization code for token.",
        variant: "destructive",
      });
    }
  };

  const resetDialog = () => {
    setStep('auth');
    setAuthCode("");
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${color}`} />
            Connect {name}
          </DialogTitle>
          <DialogDescription>
            Authenticate with {name} to connect your account
          </DialogDescription>
        </DialogHeader>

        {step === 'auth' && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">OAuth Flow Details</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Auth URL:</strong> {authUrl}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Scopes:</strong> {scopes.join(', ')}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Click the button below to start the OAuth authentication flow. 
                You'll be redirected to {name}'s authorization page.
              </p>
              
              <Button 
                onClick={handleStartAuth}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Opening {name}...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Authenticate with {name}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'callback' && (
          <div className="space-y-4">
            <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Redirected Successfully</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Copy the authorization code from the callback URL and paste it below.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-code">Authorization Code</Label>
              <Input
                id="auth-code"
                placeholder="Paste the authorization code here..."
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('auth')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCodeSubmit}
                disabled={isLoading || !authCode.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Exchanging...
                  </>
                ) : (
                  'Complete Authentication'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
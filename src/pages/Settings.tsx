import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Mail, Instagram, Globe } from "lucide-react";
import { OAuthDialog } from "@/components/OAuthDialog";

export default function Settings() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [gmailToken, setGmailToken] = useState("");
  const [instagramToken, setInstagramToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOAuthSuccess = (provider: 'gmail' | 'instagram', token: string) => {
    if (provider === 'gmail') {
      setGmailToken(token);
    } else {
      setInstagramToken(token);
    }
    toast({
      title: "Authentication Successful",
      description: `${provider === 'gmail' ? 'Gmail' : 'Instagram'} account connected successfully.`,
    });
  };

  const handleSubmitTokens = async () => {
    if (!webhookUrl) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter a webhook URL before submitting tokens.",
        variant: "destructive",
      });
      return;
    }

    if (!gmailToken && !instagramToken) {
      toast({
        title: "No Tokens to Submit",
        description: "Please connect at least one account before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        webhook_url: webhookUrl,
        gmail_token: gmailToken || null,
        instagram_token: instagramToken || null,
        timestamp: new Date().toISOString(),
      };

      console.log("Submitting to webhook:", payload);
      
      // In a real implementation, you would POST to the webhook URL
      // For now, we'll simulate the request
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Tokens Submitted Successfully",
          description: "Your authentication tokens have been sent to the webhook.",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Webhook submission failed:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit tokens to webhook. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <SettingsIcon className="w-8 h-8 text-primary-foreground" />
              <h1 className="text-3xl font-bold text-primary-foreground">Settings</h1>
            </div>
            <p className="text-primary-foreground/80 text-lg">
              Configure your webhook and manage OAuth connections
            </p>
          </div>

          {/* Webhook Configuration */}
          <Card className="bg-card/95 backdrop-blur border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Set the webhook URL where authentication tokens will be sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://your-webhook-endpoint.com/oauth-complete"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* OAuth Connections */}
          <Card className="bg-card/95 backdrop-blur border-border shadow-card">
            <CardHeader>
              <CardTitle>OAuth Connections</CardTitle>
              <CardDescription>
                Connect your accounts using OAuth authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <OAuthDialog
                  provider="gmail"
                  onSuccess={(token) => handleOAuthSuccess('gmail', token)}
                >
                  <Button variant="oauth" size="lg" className="w-full">
                    <Mail className="w-4 h-4" />
                    Connect Gmail
                  </Button>
                </OAuthDialog>

                <OAuthDialog
                  provider="instagram"
                  onSuccess={(token) => handleOAuthSuccess('instagram', token)}
                >
                  <Button variant="oauth" size="lg" className="w-full">
                    <Instagram className="w-4 h-4" />
                    Connect Instagram
                  </Button>
                </OAuthDialog>
              </div>

              {/* Token Display for Testing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Captured Tokens (Testing)</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="gmail-token">Gmail Token</Label>
                  <Textarea
                    id="gmail-token"
                    placeholder="Gmail OAuth token will appear here..."
                    value={gmailToken}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram-token">Instagram Token</Label>
                  <Textarea
                    id="instagram-token"
                    placeholder="Instagram OAuth token will appear here..."
                    value={instagramToken}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitTokens}
                disabled={isSubmitting || (!gmailToken && !instagramToken)}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Tokens to Webhook"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
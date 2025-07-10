import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OAuthButtonProps {
  provider: 'gmail' | 'instagram';
  isConnected: boolean;
  isLoading: boolean;
  onConnect: () => void;
  disabled?: boolean;
}

export function OAuthButton({ provider, isConnected, isLoading, onConnect, disabled }: OAuthButtonProps) {
  const config = {
    gmail: {
      name: 'Gmail',
      icon: Mail,
      description: 'Connect your Google account to automate email workflows',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      description: 'Connect your Instagram account to automate social media',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      hoverColor: 'hover:bg-pink-100'
    }
  };

  const { name, icon: Icon, description, color, bgColor, hoverColor } = config[provider];

  if (isConnected) {
    return (
      <div className="w-full p-6 bg-card rounded-xl border border-border shadow-card animate-scale-in">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-full", "bg-success/10")}>
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground">{name} Connected</h3>
            <p className="text-sm text-muted-foreground">Your account is successfully connected</p>
          </div>
          <div className="text-success">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-card rounded-xl border border-border shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-full transition-all duration-300", bgColor, hoverColor)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-card-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button
            variant="oauth"
            size="lg"
            onClick={onConnect}
            disabled={disabled || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Icon className="w-4 h-4" />
                Connect {name}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
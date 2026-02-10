import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Banknote, Gift, Lock, CreditCard, Info } from "lucide-react";
import { 
  VAT_RATE, 
  COMMISSION_RATE, 
  calculateVatAmount, 
  calculateCommissionAmount, 
  calculateInclusivePrice, 
  formatPrice 
} from "@/lib/pricing";

interface PricingOptionsProps {
  isPPV: boolean;
  price: string;
  assetId?: string;
  assetTitle?: string;
  onPPVChange: (value: boolean) => void;
  onPriceChange: (value: string) => void;
}

export default function PricingOptions({
  isPPV,
  price,
  assetId,
  assetTitle,
  onPPVChange,
  onPriceChange,
}: PricingOptionsProps) {
  const basePrice = parseFloat(price) || 0;
  const vatAmount = calculateVatAmount(basePrice);
  const commissionAmount = calculateCommissionAmount(basePrice);
  const totalInclusive = calculateInclusivePrice(basePrice);

  return (
    <div className="rounded-lg border border-border bg-card/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-400" />
          <span className="font-medium text-foreground">Pricing Model</span>
        </div>
        {assetId && (
          <Badge variant="outline" className="text-xs font-mono bg-muted/30">
            ID: {assetId.substring(0, 8)}...
          </Badge>
        )}
      </div>

      {/* Asset Reference */}
      {assetTitle && (
        <div className="p-2 rounded bg-muted/20 border border-border/50">
          <p className="text-xs text-muted-foreground">Pricing for:</p>
          <p className="text-sm font-medium text-foreground truncate">{assetTitle}</p>
        </div>
      )}

      {/* Free vs Paid Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          {isPPV ? (
            <Banknote className="h-5 w-5 text-emerald-400" />
          ) : (
            <Gift className="h-5 w-5 text-cyan-400" />
          )}
          <div>
            <p className="font-medium text-foreground">
              {isPPV ? "Pay-Per-View" : "Free Content"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPPV 
                ? "Viewers must pay to access this content" 
                : "Anyone can view this content for free"
              }
            </p>
          </div>
        </div>
        <Switch
          checked={isPPV}
          onCheckedChange={onPPVChange}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>

      {/* Price Input (only when PPV is enabled) */}
      {isPPV && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <Label htmlFor="price">Your Price (ZAR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R</span>
              <Input
                id="price"
                type="number"
                min="9.99"
                step="0.01"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                placeholder="99.99"
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum price: R9.99
            </p>
          </div>

          {/* Price Breakdown */}
          {basePrice >= 9.99 && (
            <div className="bg-muted/20 rounded-lg p-3 space-y-2 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-foreground">Price Breakdown</span>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Base Price:</span>
                  <span className="text-foreground">{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT ({VAT_RATE}%):</span>
                  <span className="text-foreground">+{formatPrice(vatAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SUPAView Commission ({COMMISSION_RATE}%):</span>
                  <span className="text-foreground">+{formatPrice(commissionAmount)}</span>
                </div>
                <div className="border-t border-border/50 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-emerald-400">Customer Pays:</span>
                    <span className="text-emerald-400">{formatPrice(totalInclusive)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Note: {COMMISSION_RATE}% commission is non-refundable in case of refunds.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Content Protection Notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <Lock className="h-4 w-4 text-amber-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-400">Admin Approval Required</p>
          <p className="text-xs text-muted-foreground">
            All content must be reviewed and approved by an admin before going live. 
            This ensures content quality and compliance with guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

const SERVICE_OPTIONS = [
  { id: "free_content", label: "Free VOD Content", description: "Access free movies, series, and creator content" },
  { id: "news_channels", label: "News Channels", description: "Al Jazeera, France24, and community news" },
  { id: "community_meetings", label: "Community Meetings", description: "Join virtual community gatherings" },
  { id: "events", label: "Events & Premieres", description: "Get notified about upcoming events and live premieres" },
  { id: "shopping", label: "Shopping & Products", description: "Browse creator merchandise and digital products" },
  { id: "live_streaming", label: "Live Streaming", description: "Watch live broadcasts from creators" },
  { id: "podcasts", label: "Podcasts", description: "Listen to podcast episodes and live shows" },
  { id: "music_dj", label: "Music & DJ Sets", description: "Enjoy DJ rooms and music content" },
] as const;

const guestSignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  emailPromotions: z.boolean(),
  emailAlerts: z.boolean(),
  agreedToMarketing: z.literal(true, {
    errorMap: () => ({ message: "You must agree to receive communications based on your choices" }),
  }),
});

type GuestSignUpValues = z.infer<typeof guestSignUpSchema>;

interface GuestSignupFormProps {
  redirectPath?: string;
  onSuccess?: () => void;
}

export function GuestSignupForm({ redirectPath = "/", onSuccess }: GuestSignupFormProps) {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const form = useForm<GuestSignUpValues>({
    resolver: zodResolver(guestSignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      interests: [],
      emailPromotions: false,
      emailAlerts: false,
      agreedToMarketing: false as unknown as true,
    },
  });

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      form.setValue("interests", updated, { shouldValidate: true });
      return updated;
    });
  };

  const handleGuestSignUp = async (values: GuestSignUpValues) => {
    const redirectUrl = `${window.location.origin}/`;

    // Step 1: Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (authError) {
      toast.error(authError.message);
      return;
    }

    // Step 2: Assign the 'guest' role
    if (authData.user) {
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: authData.user.id,
        role: "guest",
      });

      if (roleError) {
        console.error("Failed to assign guest role:", roleError);
      }

      // Step 3: Store guest preferences
      // Cast interests to the expected enum array type
      const interestsForDb = values.interests as Array<
        "free_content" | "news_channels" | "community_meetings" | "events" | "shopping" | "live_streaming" | "podcasts" | "music_dj"
      >;

      const { error: prefError } = await supabase.from("guest_preferences").insert({
        user_id: authData.user.id,
        interests: interestsForDb,
        email_promotions: values.emailPromotions,
        email_alerts: values.emailAlerts,
        agreed_to_marketing: values.agreedToMarketing,
        agreed_at: new Date().toISOString(),
      });

      if (prefError) {
        console.error("Failed to store preferences:", prefError);
      }
    }

    // Step 4: Navigate or callback
    if (authData.session) {
      toast.success("Guest account created successfully!");
      onSuccess?.();
      navigate(redirectPath, { replace: true });
      return;
    }

    toast.success("Account created — check your email to confirm");
    onSuccess?.();
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleGuestSignUp)}>
      {/* Email & Password */}
      <div className="space-y-2">
        <Label htmlFor="guest_email">Email</Label>
        <Input
          id="guest_email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
        />
        {form.formState.errors.email?.message && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="guest_password">Password</Label>
        <Input
          id="guest_password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
        />
        {form.formState.errors.password?.message && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Service Interests */}
      <div className="space-y-3">
        <Label className="text-base font-medium">What are you interested in?</Label>
        <p className="text-sm text-muted-foreground">Select the services you'd like to access (pick at least one)</p>
        
        <ScrollArea className="h-[200px] rounded-md border p-3">
          <div className="space-y-3">
            {SERVICE_OPTIONS.map((service) => (
              <div
                key={service.id}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  selectedInterests.includes(service.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => toggleInterest(service.id)}
              >
                <Checkbox
                  id={`interest-${service.id}`}
                  checked={selectedInterests.includes(service.id)}
                  onCheckedChange={() => toggleInterest(service.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`interest-${service.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {service.label}
                  </label>
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        {form.formState.errors.interests?.message && (
          <p className="text-sm text-destructive">{form.formState.errors.interests.message}</p>
        )}
      </div>

      {/* Communication Preferences */}
      <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
        <Label className="text-base font-medium">Communication Preferences</Label>
        
        <div className="flex items-start gap-3">
          <Checkbox
            id="emailPromotions"
            checked={form.watch("emailPromotions")}
            onCheckedChange={(checked) => form.setValue("emailPromotions", !!checked)}
          />
          <div className="flex-1">
            <label htmlFor="emailPromotions" className="text-sm font-medium cursor-pointer">
              Promotional Emails
            </label>
            <p className="text-xs text-muted-foreground">Receive special offers, discounts, and featured content</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="emailAlerts"
            checked={form.watch("emailAlerts")}
            onCheckedChange={(checked) => form.setValue("emailAlerts", !!checked)}
          />
          <div className="flex-1">
            <label htmlFor="emailAlerts" className="text-sm font-medium cursor-pointer">
              Event Alerts
            </label>
            <p className="text-xs text-muted-foreground">Get notified about events and content matching your interests</p>
          </div>
        </div>
      </div>

      {/* Marketing Agreement */}
      <div className="flex items-start gap-3 rounded-lg border border-primary/30 p-4 bg-primary/5">
        <Checkbox
          id="agreedToMarketing"
          checked={form.watch("agreedToMarketing")}
          onCheckedChange={(checked) => form.setValue("agreedToMarketing", checked === true ? true : (false as unknown as true), { shouldValidate: true })}
        />
        <div className="flex-1">
          <label htmlFor="agreedToMarketing" className="text-sm font-medium cursor-pointer">
            I agree to receive communications *
          </label>
          <p className="text-xs text-muted-foreground">
            By checking this box, I consent to SupaviewTV sending me promotions and alerts based on my selected interests above. I understand I can unsubscribe at any time.
          </p>
        </div>
      </div>
      {form.formState.errors.agreedToMarketing?.message && (
        <p className="text-sm text-destructive">{form.formState.errors.agreedToMarketing.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Creating account..." : "Create Guest Account"}
      </Button>
    </form>
  );
}

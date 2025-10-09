import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettings() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold" data-testid="heading-settings">System Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Configure general platform settings and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Student Registration</Label>
                <p className="text-sm text-muted-foreground">Enable new students to sign up</p>
              </div>
              <Switch defaultChecked data-testid="switch-student-registration" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Agent Access</Label>
                <p className="text-sm text-muted-foreground">Allow agents to manage students</p>
              </div>
              <Switch defaultChecked data-testid="switch-agent-access" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily disable platform access</p>
              </div>
              <Switch data-testid="switch-maintenance-mode" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Configure email notifications and templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-from">From Email Address</Label>
              <Input
                id="email-from"
                placeholder="noreply@leadapps.com"
                data-testid="input-email-from"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Application Status Notifications</Label>
                <p className="text-sm text-muted-foreground">Email users on application updates</p>
              </div>
              <Switch defaultChecked data-testid="switch-email-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>Configure payment processing options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="application-fee">Application Fee (USD)</Label>
              <Input
                id="application-fee"
                type="number"
                placeholder="50"
                data-testid="input-application-fee"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Payment Processing</Label>
                <p className="text-sm text-muted-foreground">Accept payments via Stripe</p>
              </div>
              <Switch data-testid="switch-payment-processing" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button data-testid="button-save-settings">Save Settings</Button>
        </div>
      </div>
    </div>
  );
}

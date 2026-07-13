import { useState } from 'react';
import { Navbar } from '../components/worklink/Navbar';
import { DashboardSidebar } from '../components/worklink/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, RefreshCw } from 'lucide-react';

export function AdminSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Platform setting states
  const [commissionRate, setCommissionRate] = useState('10');
  const [escrowHoldDays, setEscrowHoldDays] = useState('5');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoVerifyWorkers, setAutoVerifyWorkers] = useState(false);
  const [maxDailyMatchLimit, setMaxDailyMatchLimit] = useState('50');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Admin platform settings updated successfully!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userType="customer" />
      <div className="flex">
        <DashboardSidebar
          userType="admin"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8 max-w-[1000px]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Platform Settings</h1>
            <p className="text-muted-foreground">Adjust system fees, verification rules, matching parameters, and developer configs</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Financial settings card */}
            <Card>
              <CardHeader>
                <CardTitle>Financial & Escrow Policies</CardTitle>
                <CardDescription>Adjust fees and cash release duration parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Platform Fee / Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="escrowHoldDays">Escrow Safety Hold Duration (Days)</Label>
                    <Input
                      id="escrowHoldDays"
                      type="number"
                      value={escrowHoldDays}
                      onChange={(e) => setEscrowHoldDays(e.target.value)}
                      min="0"
                      max="30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification and matching settings card */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Matching Settings</CardTitle>
                <CardDescription>Configure automation parameters for worker vetting and matching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDailyMatchLimit">Max AI Matches Per User Daily Limit</Label>
                  <Input
                    id="maxDailyMatchLimit"
                    type="number"
                    value={maxDailyMatchLimit}
                    onChange={(e) => setMaxDailyMatchLimit(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg mt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoVerify" className="font-semibold text-sm">Auto-Verify Workers</Label>
                    <p className="text-xs text-muted-foreground">Bypass manual review for profile verifications if certificate uploads match OCR checks</p>
                  </div>
                  <Switch
                    id="autoVerify"
                    checked={autoVerifyWorkers}
                    onCheckedChange={setAutoVerifyWorkers}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Status card */}
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>Control public availability of user-facing components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 border border-red-200 bg-red-50/50 dark:bg-red-950/10 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode" className="font-semibold text-sm text-red-900 dark:text-red-300">Maintenance Mode</Label>
                    <p className="text-xs text-red-700 dark:text-red-400">Put the front-end apps into read-only mode and block API transactions</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

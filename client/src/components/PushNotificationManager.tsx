import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, Smartphone, CheckCircle, AlertTriangle, Settings } from "lucide-react";

interface NotificationPreferences {
  applicationUpdates: boolean;
  deadlineReminders: boolean;
  examSchedules: boolean;
  messageAlerts: boolean;
  systemAnnouncements: boolean;
  counselorReminders: boolean;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    applicationUpdates: true,
    deadlineReminders: true,
    examSchedules: true,
    messageAlerts: true,
    systemAnnouncements: false,
    counselorReminders: true,
  });
  
  const { toast } = useToast();

  const enableNotificationsMutation = useMutation({
    mutationFn: async (subscription: PushSubscription) => {
      return apiRequest('POST', '/api/notifications/subscribe', {
        subscription: subscription.toJSON(),
        preferences
      });
    },
    onSuccess: () => {
      setIsSubscribed(true);
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive push notifications for important updates.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Enable Notifications",
        description: "Please try again or check your browser settings.",
        variant: "destructive",
      });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (newPreferences: NotificationPreferences) =>
      apiRequest('PATCH', '/api/notifications/preferences', newPreferences),
    onSuccess: () => {
      toast({
        title: "Preferences Updated",
        description: "Your notification settings have been saved.",
      });
    },
  });

  useEffect(() => {
    // Check if service workers and notifications are supported
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    setPermission(Notification.permission);
    
    // Check if already subscribed
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToNotifications();
      } else {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      });
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // You would get this VAPID key from your server configuration
      const vapidPublicKey = 'your-vapid-public-key-here';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      enableNotificationsMutation.mutate(subscription);
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Could not subscribe to push notifications.",
        variant: "destructive",
      });
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updatePreferencesMutation.mutate(newPreferences);
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('LeadApps Test Notification', {
        body: 'This is a test notification to verify your settings.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'test',
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Dashboard',
            icon: '/icons/action-view.png'
          }
        ]
      });
      
      toast({
        title: "Test Notification Sent",
        description: "Check your device for the notification.",
      });
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: 'Enabled', color: 'text-green-600' };
      case 'denied':
        return { icon: <BellOff className="h-5 w-5 text-red-600" />, text: 'Blocked', color: 'text-red-600' };
      default:
        return { icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />, text: 'Not Set', color: 'text-yellow-600' };
    }
  };

  const notificationTypes = [
    {
      key: 'applicationUpdates' as keyof NotificationPreferences,
      title: 'Application Updates',
      description: 'Status changes, acceptance letters, and application deadlines'
    },
    {
      key: 'deadlineReminders' as keyof NotificationPreferences,
      title: 'Deadline Reminders',
      description: 'Upcoming application and exam deadlines'
    },
    {
      key: 'examSchedules' as keyof NotificationPreferences,
      title: 'Exam Schedules',
      description: 'Test dates, practice sessions, and study reminders'
    },
    {
      key: 'messageAlerts' as keyof NotificationPreferences,
      title: 'Message Alerts',
      description: 'New messages from counselors and support staff'
    },
    {
      key: 'counselorReminders' as keyof NotificationPreferences,
      title: 'Counselor Reminders',
      description: 'Upcoming appointments and session follow-ups'
    },
    {
      key: 'systemAnnouncements' as keyof NotificationPreferences,
      title: 'System Announcements',
      description: 'Platform updates and maintenance notifications'
    }
  ];

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Notifications Not Supported</h3>
          <p className="text-gray-600 text-sm">
            Your browser doesn't support push notifications. Please use a modern browser for the best experience.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Notification Status</p>
                <p className="text-sm text-gray-600">Stay updated with important alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionStatus().icon}
              <Badge variant={permission === 'granted' ? 'default' : 'secondary'}>
                {getPermissionStatus().text}
              </Badge>
            </div>
          </div>

          {permission !== 'granted' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Enable push notifications to stay informed about important updates, deadlines, and messages.
              </p>
              <Button 
                onClick={requestNotificationPermission}
                disabled={enableNotificationsMutation.isPending}
                className="w-full"
              >
                {enableNotificationsMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Enabling...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Enable Notifications
                  </>
                )}
              </Button>
            </div>
          )}

          {permission === 'granted' && (
            <div className="flex gap-2">
              <Button onClick={testNotification} variant="outline" className="flex-1">
                Test Notification
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      {permission === 'granted' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor={type.key} className="font-medium text-sm">
                      {type.title}
                    </Label>
                  </div>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </div>
                <Switch
                  id={type.key}
                  checked={preferences[type.key]}
                  onCheckedChange={(checked) => updatePreference(type.key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Tip:</strong> You can manage notification settings in your browser or device settings at any time.
            </p>
            <p>
              Notifications help you stay on top of deadlines, application updates, and important messages from your counselors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
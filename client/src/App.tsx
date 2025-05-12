import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import MainLayout from "./layouts/MainLayout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import StudentProfile from "@/pages/StudentProfile";
import Search from "@/pages/Search";
import Wishlist from "@/pages/Wishlist";
import Applications from "@/pages/Applications";
import PersonalityHub from "@/pages/PersonalityHub";
import Counselling from "@/pages/Counselling";
import Articles from "@/pages/Articles";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Homepage as a standalone front website */}
          <Route path="/" component={Home} />

          {/* App routes with MainLayout */}
          <Route path="/app">
            <MainLayout>
              <Switch>
                <Route path="/app" component={Search} />
                <Route path="/app/profile">
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/search" component={Search} />
                <Route path="/app/wishlist">
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/applications">
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/personality-hub">
                  <ProtectedRoute>
                    <PersonalityHub />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/counselling">
                  <ProtectedRoute>
                    <Counselling />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/articles" component={Articles} />
                <Route component={NotFound} />
              </Switch>
            </MainLayout>
          </Route>
          
          {/* Catch-all route */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

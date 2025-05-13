import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import MainLayout from "./layouts/MainLayout";
import NotFound from "@/pages/not-found";
import Marketing from "@/pages/Marketing";
import StudentLogin from "@/pages/StudentLogin";
import StudentProfile from "@/pages/StudentProfile";
import Search from "@/pages/Search";
import Wishlist from "@/pages/Wishlist";
import Applications from "@/pages/Applications";
import PersonalityHub from "@/pages/PersonalityHub";
import Counselling from "@/pages/Counselling";
import Articles from "@/pages/Articles";
import AboutUs from "@/pages/AboutUs";
import InfoCentre from "@/pages/InfoCentre";
import FairsEvents from "@/pages/FairsEvents";
import StudyLocation from "@/pages/StudyLocation";
import ServicePage from "@/pages/ServicePage";
import AppHome from "@/pages/AppHome";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Marketing website routes */}
          <Route path="/" component={Marketing} />
          <Route path="/student-login" component={StudentLogin} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/info-centre" component={InfoCentre} />
          <Route path="/fairs-events" component={FairsEvents} />
          
          {/* Study routes */}
          <Route path="/study/:location" component={StudyLocation} />
          
          {/* Services routes */}
          <Route path="/services/:service" component={ServicePage} />

          {/* App routes with MainLayout */}
          <Route path="/app">
            <MainLayout>
              <Switch>
                <Route path="/app" component={AppHome} />
                <Route path="/app/profile">
                  <ProtectedRoute testMode={true}>
                    <StudentProfile />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/search" component={Search} />
                <Route path="/app/wishlist">
                  <ProtectedRoute testMode={true}>
                    <Wishlist />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/applications">
                  <ProtectedRoute testMode={true}>
                    <Applications />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/personality-hub">
                  <ProtectedRoute testMode={true}>
                    <PersonalityHub />
                  </ProtectedRoute>
                </Route>
                <Route path="/app/counselling">
                  <ProtectedRoute testMode={true}>
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

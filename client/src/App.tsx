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
import FundingHub from "@/pages/FundingHub";
import UniversitySearchPage from "@/pages/UniversitySearchPage";
import UniversityDetailsPage from "@/pages/UniversityDetailsPage";
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

          {/* App routes */}
          <Route path="/app">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <AppHome />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/profile">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <StudentProfile />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/search">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <Search />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/wishlist">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <Wishlist />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/applications">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <Applications />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/personality-hub">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <PersonalityHub />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/counselling">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <Counselling />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/articles">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <Articles />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/funding-hub">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <FundingHub />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/university-search">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <UniversitySearchPage />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          <Route path="/app/universities/:id">
            <MainLayout>
              <ProtectedRoute testMode={true}>
                <UniversityDetailsPage />
              </ProtectedRoute>
            </MainLayout>
          </Route>
          
          {/* Fallback route for any unmatched routes */}
          <Route path="/:rest*" component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

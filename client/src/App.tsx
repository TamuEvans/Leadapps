import { Route, Switch } from "wouter";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import usePathname from "@/hooks/use-pathname";
import MainLayout from "./layouts/MainLayout";
import NotFound from "@/pages/not-found";
import Marketing from "@/pages/Marketing";
import StudentLogin from "@/pages/StudentLogin";
import StudentProfile from "@/pages/StudentProfile";
import Search from "@/pages/Search";
import Wishlist from "@/pages/Wishlist";
import Applications from "@/pages/Applications";
import PersonalityHub from "@/pages/PersonalityHub";
import PersonalityAssessment from "@/pages/PersonalityAssessment";
import PersonalityResults from "@/pages/PersonalityResults";
import Counselling from "@/pages/Counselling";
import Articles from "@/pages/Articles";
import AboutUs from "@/pages/AboutUs";
import InfoCentre from "@/pages/InfoCentre";
import FairsEvents from "@/pages/FairsEvents";
import StudyLocation from "@/pages/StudyLocation";
import ServicePage from "@/pages/ServicePage";
import AppHome from "@/pages/AppHome";
import FundingHub from "@/pages/FundingHub";
import ExamPrepHub from "@/pages/ExamPrepHub";
import CSECEnglish from "@/pages/CSECEnglish";
import CSECSubjects from "@/pages/CSECSubjects";
import StudyGroups from "@/pages/StudyGroups";
import CSHub from "@/pages/CSHub";
import UniversitySearchPage from "@/pages/UniversitySearchPage";
import StudyMaterials from "@/pages/StudyMaterials";
import PracticeTests from "@/pages/PracticeTests";
import ProgressTracking from "@/pages/ProgressTracking";
import ApplicationDetailsPage from "@/pages/ApplicationDetailsPage";
import UniversityProfilePage from "@/pages/UniversityProfilePage";
import ProgramProfilePage from "@/pages/ProgramProfilePage";
import { ThemeProvider } from "@/components/theme-provider";
import { useLocation } from "wouter";

// Direct imports for Home and other pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

// Direct imports for admin components to avoid Suspense issues
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Login from "@/pages/Login";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import AchievementProvider, { useAchievements } from "@/contexts/AchievementContext";
import AchievementCelebration from "@/components/AchievementCelebration";
import InteractiveTour from "@/components/InteractiveTour";
import { AuthProvider } from "@/hooks/useAuth";

function AppContent() {
  const [pathname] = useLocation();
  const { currentAchievement, dismissAchievement } = useAchievements();

  return (
    <>
      <Switch>
        {/* Static marketing pages */}
        <Route path="/" exact component={Marketing} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        
        {/* Auth pages */}
        <Route path="/student-login" component={StudentLogin} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        
        {/* Services routes */}
        <Route path="/services/:service" component={ServicePage} />

        {/* App routes */}
        <Route path="/app">
          <MainLayout>
            <ProtectedRoute>
              <AppHome />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/profile">
          <MainLayout>
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/search">
          <MainLayout>
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/university-search">
          <MainLayout>
            <ProtectedRoute>
              <UniversitySearchPage />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/wishlist">
          <MainLayout>
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/applications">
          <MainLayout>
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/application/:id">
          <MainLayout>
            <ProtectedRoute>
              <ApplicationDetailsPage />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/personality-hub">
          <MainLayout>
            <ProtectedRoute>
              <PersonalityHub />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/personality-assessment">
          <MainLayout>
            <ProtectedRoute>
              <PersonalityAssessment />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/personality-results/:id">
          <MainLayout>
            <ProtectedRoute>
              <PersonalityResults />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/counselling">
          <MainLayout>
            <ProtectedRoute>
              <Counselling />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/articles">
          <MainLayout>
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/funding-hub">
          <MainLayout>
            <ProtectedRoute>
              <FundingHub />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/cs-hub">
          <MainLayout>
            <ProtectedRoute>
              <CSHub />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/exam-prep-hub">
          <MainLayout>
            <ProtectedRoute>
              <ExamPrepHub />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/cs-hub/study/:subject">
          <MainLayout>
            <ProtectedRoute>
              <StudyMaterials />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/cs-hub/practice/:subject">
          <MainLayout>
            <ProtectedRoute>
              <PracticeTests />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/cs-hub/groups">
          <MainLayout>
            <ProtectedRoute>
              <StudyGroups />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/cs-hub/progress">
          <MainLayout>
            <ProtectedRoute>
              <ProgressTracking />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/fairs-events">
          <MainLayout>
            <ProtectedRoute>
              <FairsEvents />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        {/* University and program details */}
        <Route path="/university/:id">
          <ProtectedRoute>
            <UniversityProfilePage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/program/:id">
          <ProtectedRoute>
            <ProgramProfilePage />
          </ProtectedRoute>
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin-login">
          <AdminLogin />
        </Route>
        <Route path="/admin">
          <AdminDashboard />
        </Route>
        
        {/* Fallback route for any unmatched routes */}
        <Route path="/:rest*" component={NotFound} />
      </Switch>
      
      {/* Toaster for notifications */}
      <Toaster />
      
      {/* Interactive Onboarding Tour - only on app pages */}
      {pathname.startsWith('/app') && (
        <InteractiveTour enabled={true} />
      )}
      
      {/* Achievement celebration popup - only on app pages */}
      {pathname.startsWith('/app') && currentAchievement && (
        <AchievementCelebration 
          achievement={currentAchievement}
          onClose={dismissAchievement}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AchievementProvider>
            <AppContent />
          </AchievementProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
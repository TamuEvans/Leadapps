import { Route, Switch } from "wouter";
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
import UniversitySearchPage from "@/pages/UniversitySearchPage";
import UniversityDetailsPage from "@/pages/UniversityDetailsPage";
import UniversityProfilePage from "@/pages/UniversityProfilePage";
import ProgramProfilePage from "@/pages/ProgramProfilePage";
import ApplicationDetailsPage from "@/pages/ApplicationDetailsPage";
import DataUpload from "@/pages/DataUpload";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import AchievementProvider, { useAchievements } from "@/contexts/AchievementContext";
import AchievementCelebration from "@/components/AchievementCelebration";
import InteractiveTour from "@/components/InteractiveTour";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AchievementProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </AchievementProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { currentAchievement, dismissAchievement } = useAchievements();
  const pathname = usePathname();
  
  return (
    <>
      <Switch>
        {/* Marketing website routes */}
        <Route path="/" component={Marketing} />
        <Route path="/student-login" component={StudentLogin} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
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
        
        <Route path="/app/application/:id">
          <MainLayout>
            <ProtectedRoute testMode={true}>
              <ApplicationDetailsPage />
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
        
        <Route path="/app/personality-assessment">
          <MainLayout>
            <ProtectedRoute testMode={true}>
              <PersonalityAssessment />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/personality-results/:id">
          <MainLayout>
            <ProtectedRoute testMode={true}>
              <PersonalityResults />
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

        <Route path="/app/exam-prep-hub">
          <MainLayout>
            <ProtectedRoute testMode={true}>
              <ExamPrepHub />
            </ProtectedRoute>
          </MainLayout>
        </Route>

        <Route path="/app/csec-subjects">
          <MainLayout>
            <ProtectedRoute testMode={true}>
              <CSECSubjects />
            </ProtectedRoute>
          </MainLayout>
        </Route>

        <Route path="/app/csec-english">
          <MainLayout>
            <ProtectedRoute testMode={true}>
              <CSECEnglish />
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
              <UniversityProfilePage />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/programs/:id">
          <MainLayout>
            <ProtectedRoute testMode={true}>
              <ProgramProfilePage />
            </ProtectedRoute>
          </MainLayout>
        </Route>
        
        <Route path="/app/data-upload">
          <MainLayout>
            <ProtectedRoute testMode={true}>
              <DataUpload />
            </ProtectedRoute>
          </MainLayout>
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

export default App;
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
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Auth routes (no layout) */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          {/* Protected routes with MainLayout */}
          <Route path="/">
            <MainLayout>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/profile">
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                </Route>
                <Route path="/search" component={Search} />
                <Route path="/wishlist">
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                </Route>
                <Route path="/applications">
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                </Route>
                <Route path="/personality-hub">
                  <ProtectedRoute>
                    <PersonalityHub />
                  </ProtectedRoute>
                </Route>
                <Route path="/counselling">
                  <ProtectedRoute>
                    <Counselling />
                  </ProtectedRoute>
                </Route>
                <Route path="/articles" component={Articles} />
                <Route component={NotFound} />
              </Switch>
            </MainLayout>
          </Route>
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function App() {
  return (
    <TooltipProvider>
      <MainLayout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/profile" component={StudentProfile} />
          <Route path="/search" component={Search} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/applications" component={Applications} />
          <Route path="/personality-hub" component={PersonalityHub} />
          <Route path="/counselling" component={Counselling} />
          <Route path="/articles" component={Articles} />
          <Route component={NotFound} />
        </Switch>
      </MainLayout>
    </TooltipProvider>
  );
}

export default App;

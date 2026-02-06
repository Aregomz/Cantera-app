import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CoachSection from "../components/landing/CoachSection";
import CtaSection from "../components/landing/CtaSection";

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-16">
      <HeroSection />
      <FeaturesSection />
      <CoachSection />
      <CtaSection />
    </div>
  );
};

export default LandingPage;

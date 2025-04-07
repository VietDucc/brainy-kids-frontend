import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Feature from "@/components/landing/feature";
import WorkFlow from "@/components/landing/workflow";
import Feedback from "@/components/landing/feedback";
import Stat from "@/components/landing/stat";
import Price from "@/components/landing/price";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Feature />
        <WorkFlow />
        <Feedback />
        <Stat />
        <Price />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

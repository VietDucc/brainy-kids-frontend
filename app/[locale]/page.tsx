import {
  Header,
  Hero,
  Feature,
  WorkFlow,
  Feedback,
  Stat,
  Price,
  CTA,
  Footer,
} from "@/components/landing";

export default async function LandingPage() {
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

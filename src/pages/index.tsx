import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { HomeHero } from '../components/Home/Hero';

export default function Home() {
  return (
    <div className="h-full bg-gray-0 bg-home bg-no-repeat bg-cover flex flex-col justify-between md:h-screen">
      <Header />
      <HomeHero />
      <Footer />
    </div>
  );
}
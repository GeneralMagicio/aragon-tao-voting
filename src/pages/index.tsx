import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { HomeHero } from '../components/Home/Hero'
import { Notification } from '../components/Home/Notification'
import { PageAnimation } from '../components/PageAnimation'

export default function Home() {
  return (
    <div className="bg-gray-50 bg-home bg-no-repeat bg-cover flex flex-col justify-between min-h-screen">
      <Header />
      <div className="h-[calc(100vh_-_96px)]">
        <Notification />
        <div className="h-full flex flex-col justify-between">
          <PageAnimation>
            <HomeHero />
          </PageAnimation>
          <Footer />
        </div>
      </div>
    </div>
  )
}

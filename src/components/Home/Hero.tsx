import Link from 'next/link'

export function HomeHero() {
  return (
    <div className="flex flex-col justify-center items-center px-6 md:mt-20 mt-24">
      <div className="text-6xl md:text-7xl flex-col leading-[72px] md:leading-[102px]">
        <h1 className="text-center text-blue-200 font-semibold">
          The Future of Aragon
        </h1>
        <h1 className="text-center text-gray">is in your hands</h1>
      </div>
      <div className="text-[22px] md:text-3xl text-gray text-center leading-10 mx-5 mt-10 2xl:mx-80 xl:mx-72 lg:mx-32 md:mx-12">
        <p>
          The Aragon Community are working on building the safest, most effective DAO structure to run the Aragon Network DAO (AN DAO).
        </p>
        <p className="mt-11 mb-16">
          As AN DAO evolves so should its configuration. We invite you to help configure and debate AN DAO voting parameters and to collaborate on the governance design of our future DAO.
        </p>
      </div>
      <Link href="/about">
        <button className="bg-white text-blue hover:text-white hover:bg-blue text-xl font-semibold py-3 px-10 rounded-lg drop-shadow-sm transition ease-in-out duration-500">
          Learn More About Tao Voting
        </button>
      </Link>
    </div>
  )
}

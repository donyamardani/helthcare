import Link from 'next/link'



export default function Home() {
  return (
    <>
    <main className='flex flex-col w-full h-full items-center justify-center md:font-medium gap-2 '>
      <h1 className='text-3xl text-amber-200 font-bold mt-4  inset-shadow-xs'>CarePulse</h1>
      <p className='text-xl text-amber-100 font-mono mt-4'>Healthcare Management Platform</p>
      <p className='text-lg text-amber-100 font-normal mt-4'>My first Next.js project</p>
      <span>
        <Link className='text-white' href={"/appointments"}>appointments page</Link>
      </span>
    </main>
    </>
  )
}

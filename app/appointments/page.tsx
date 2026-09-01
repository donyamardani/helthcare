import Link from "next/link";


export default function appointments() {
  return (
    <div className="flex flex-col items-center justify-center mt-4">
        <p className="text-3xl font-bold text-amber-100">This is the appointments page.</p>
        <Link className="text-xl font-bold text-amber-50" href={"/"}>go to home page</Link>
    </div>
  )
}

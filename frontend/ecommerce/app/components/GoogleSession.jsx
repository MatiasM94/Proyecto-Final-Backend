import Image from "next/image";
import Link from "next/link";

export default function GoogleSession() {
  return (
    <Link
      href="http://localhost:3000/api/auth/google"
      className="flex justify-center items-center bg-white text-sm py-1 my-4 w-full font-bold 40px rounded-2xl sm:font-semibold sm:leading-4 md:leading-[20px]"
    >
      <Image
        src="/googleicon.svg"
        width={30}
        height={30}
        alt="Logo de google"
        className="mr-2"
      />
      Continuar con Google
    </Link>
  );
}

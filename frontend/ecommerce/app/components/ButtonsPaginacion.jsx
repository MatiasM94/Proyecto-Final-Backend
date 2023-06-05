"use client";

import { useRouter } from "next/navigation";

export default function ButtonPaginacion({ prev, next }) {
  const router = useRouter();
  const handlePage = (page) => {
    router.push(`/products?page=${page}`);
  };
  return (
    <>
      <button
        onClick={() => handlePage(prev)}
        disabled={!prev}
        className="bg-purple-800 text-gray-100 text-sm py-2 px-5 my-4 font-bold 40px rounded-2xl sm:font-semibold sm:leading-4 md:leading-[20px]"
      >
        Prev
      </button>
      <button
        onClick={() => handlePage(next)}
        disabled={!next}
        className="bg-purple-800 text-gray-100 text-sm py-2 px-5 my-4 font-bold 40px rounded-2xl sm:font-semibold sm:leading-4 md:leading-[20px]"
      >
        Next
      </button>
    </>
  );
}

"use client";

import Image from "next/image";

export default function Card(products) {
  const { title, thumbnails } = products.products;
  return (
    <div className="  w-[200px] h-[300px] mx-5 my-3">
      <div className="flex justify-center items-center h-[60%] rounded-t-lg border-solid border-[1px] border-[grey]">
        <Image src={thumbnails} width={60} height={110} />
      </div>
      <div className=" border-x-[1px] border-b-[1px] border-[grey]">
        <h1>Title:</h1>
        <p>{title}</p>
      </div>
    </div>
  );
}

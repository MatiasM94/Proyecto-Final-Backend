"use client";

import Card from "../components/Card";

export default function ProductList(products) {
  const { docs } = products.products.payload;
  console.log(products);

  return (
    <>
      <div className="flex justify-center items-center flex-wrap">
        {docs.map((doc, index) => {
          return <Card key={index} products={doc} />;
        })}
      </div>
    </>
  );
}

import { cookies } from "next/headers";
import ProductList from "../../containers/productList";
import ButtonPaginacion from "../../components/ButtonsPaginacion";

async function getData({ page = 1 }) {
  const cookieStore = cookies();
  const theme = cookieStore.get("authToken");

  if (!theme) return { error: "no auth token" };
  const cookie = `${theme.name}=${theme.value}`;
  try {
    const response = await fetch(
      `http://localhost:3000/api/products?page=${page}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${cookie};path=/;expires=Session`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    return { error: error };
  }
}

export default async function Page({ searchParams }) {
  try {
    const data = await getData(searchParams);
    if (data.error) return <h1>Lo siento, ocurrio un error inesperado</h1>;

    const prevPage = data.payload.prevPage;
    const nextPage = data.payload.nextPage;
    return (
      <div>
        <ProductList products={data} />
        <ButtonPaginacion prev={prevPage} next={nextPage} />
      </div>
    );
  } catch (error) {
    console.log(error);
    return <h1>Lo siento, ocurrio un error inesperado</h1>;
  }
}

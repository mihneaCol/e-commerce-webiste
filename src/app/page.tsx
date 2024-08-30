import { api, HydrateClient } from "~/trpc/server";
import ProductsPage from "./products/page";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="">
          <ProductsPage />
      </main>
    </HydrateClient>
  );
}

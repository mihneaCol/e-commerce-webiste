import { LatestProduct } from "~/app/_components/product";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.product.hello({ text: "from tRPC" });
  const cartHello = await api.cart.hello({ text: "from cart component"})

  // void api.product.create.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
            <p className="text-2xl text-white">
              {cartHello ? cartHello.greeting : "Loading tRPC query..."}
            </p>
          </div>

          <LatestProduct />
        </div>
      </main>
    </HydrateClient>
  );
}

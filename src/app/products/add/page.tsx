"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export default function ProductComponent() {

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");

  const createProduct = api.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.invalidate();
      setName("");
      setDescription("");
      setPrice(0);
      setImageUrl("");
      setStock(0);
      setCategory("");
    },
  });

  return (
    <div className="w-full max-w-xs text-black">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createProduct.mutate({ name, description, price, imageUrl, stock, category });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        <input
          type="text"
          placeholder="ImageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createProduct.isPending}
        >
          {createProduct.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

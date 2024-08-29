"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function ProductComponent() {

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  // const getAllProducts = api.product.getAll.useQuery();
  // const getProductById = api.product.getById.useQuery({ id: 2 });

  // const updateProduct = api.product.update.useMutation();
  // const deleteProduct = api.product.delete.useMutation();

  const createProduct = api.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.invalidate();
      setName("");
      setDescription("");
      setPrice(0);
      setImageUrl("");
    },
  });

  // const handleUpdate = () => {
  //   updateProduct.mutate({
  //     id: 1,
  //     name: 'Updated Product',
  //   });
  // };

  // const handleDelete = () => {
  //   deleteProduct.mutate({ id: 1 });
  // };

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createProduct.mutate({ name, description, price, imageUrl });
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

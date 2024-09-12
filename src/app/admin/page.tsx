"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Spinner } from "~/components/ui/spinner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog"; // Import Dialog components

export default function AdminPage() {
  const { data: products, isLoading, isError, refetch } = api.product.getAll.useQuery({
    categories: undefined,
  });

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      refetch(); // Refetch products after creation
    },
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      refetch(); // Refetch products after update
    },
  });

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      refetch(); // Refetch products after deletion
    },
  });

  const [open, setOpen] = useState(false); // For opening/closing the dialog
  const [editProductId, setEditProductId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      stock: 0,
      category: "",
    },
  });

  const onSubmit = async (data: any) => {
    // Convert string inputs to numbers
    const formattedData = {
      ...data,
      price: parseFloat(data.price),  // Convert price to a float
      stock: parseInt(data.stock, 10),  // Convert stock to an integer
    };
  
    if (editProductId) {
      await updateProduct.mutateAsync({ id: editProductId, ...formattedData });
    } else {
      await createProduct.mutateAsync(formattedData);
    }
    
    setOpen(false);
    reset(); // Reset the form after submission
  };
  

  const onEdit = (product: any) => {
    reset(product); // Load product data into the form
    setEditProductId(product.id);
    setOpen(true);
  };

  const onDelete = async (id: number) => {
    await deleteProduct.mutateAsync({ id });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError || !products) {
    return <p>Failed to load products. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="default"
        onClick={() => {
          reset(); // Reset the form to its initial state
          setOpen(true); // Open the dialog
          setEditProductId(null); // Clear the editProductId to indicate we're adding a new product
        }}
      >
        <Plus className="mr-2" /> Add Product
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price.toFixed(2)} Lei</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editProductId ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input
                {...register("name")}
                id="name"
                type="text"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                id="description"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium">Price</label>
              <input
                {...register("price")}
                id="price"
                type="number"
                step="0.01"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium">Stock</label>
              <input
                {...register("stock")}
                id="stock"
                type="number"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium">Category</label>
              <input
                {...register("category")}
                id="category"
                type="text"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium">Image URL</label>
              <input
                {...register("imageUrl")}
                id="imageUrl"
                type="text"
                className="input input-bordered w-full"
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {editProductId ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

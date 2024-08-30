import { useRouter } from "next/router";
import { api } from "~/trpc/react"; // Adjust the import based on your trpc client setup

export default function ProductDetails({ 
  params,
}: {
  params: { productId : string }
}) {
 return (<h1>Details about product {params.productId}</h1>)
}

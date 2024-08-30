import ProductDetailsClient from './ProductDetailsClient';

export default function ProductDetails({ 
  params,
}: {
  params: { productId: string }
}) {
  const productId = Number(params.productId);

  return (
    <div>
      <ProductDetailsClient productId={productId} />
    </div>
  );
}

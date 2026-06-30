import { HomeClient } from "@/components/home-client.jsx";
import { listPublicProducts } from "@/lib/store.js";

export default async function HomePage() {
  const products = await listPublicProducts();
  return <HomeClient products={products} />;
}

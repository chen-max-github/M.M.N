import { useShopContext } from "@Common/Contexts/ShopContext";

export function FindById(id) {
  const { items } = useShopContext();

  const item = items.find((i) => i.id === id);

  if (!item) {
    return null;
  }

  return item;
}
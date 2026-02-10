import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductOption {
  product_key: string;
  name: string;
}

interface ProductFilterProps {
  products: ProductOption[];
  value: string;
  onChange: (val: string) => void;
}

export function ProductFilter({ products, value, onChange }: ProductFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="All Products" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Products</SelectItem>
        {products.map((p) => (
          <SelectItem key={p.product_key} value={p.product_key}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

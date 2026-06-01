"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const UNITS = [
  "piece", "box", "bundle", "roll", "bag",
  "cubic_meter", "linear_foot", "square_foot",
  "gallon", "liter", "kg", "lb",
] as const;

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category_id: string | null;
  unit: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  reorder_level: number;
  active: boolean;
};

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(product?.category_id ?? "");
  const [selectedUnit, setSelectedUnit] = useState(product?.unit ?? "piece");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      sku: (formData.get("sku") as string) || "",
      name: (formData.get("name") as string) || "",
      description: (formData.get("description") as string) || "",
      category_id: selectedCategory || null,
      unit: selectedUnit || "piece",
      cost_price: parseFloat(formData.get("cost_price") as string) || 0,
      selling_price: parseFloat(formData.get("selling_price") as string) || 0,
      stock_quantity: parseInt(formData.get("stock_quantity") as string) || 0,
      reorder_level: parseInt(formData.get("reorder_level") as string) || 10,
      active: true,
    };

    const client = createClient();
    let error: { message: string } | null = null;

    if (product) {
      const { error: err } = await client
        .from("products")
        .update(data)
        .eq("id", product.id);
      error = err;
    } else {
      const { error: err } = await client.from("products").insert(data);
      error = err;
    }

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    toast.success(product ? "Product updated" : "Product created");
    router.push("/inventory");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* SKU */}
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            name="sku"
            defaultValue={product?.sku}
            placeholder="e.g. PLY-34"
            required
          />
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={product?.name}
            placeholder="e.g. 3/4 in Plywood Sheet 4x8"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Unit */}
        <div className="space-y-2">
          <Label>Unit *</Label>
          <Select value={selectedUnit} onValueChange={(val) => setSelectedUnit(val ?? "piece")}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selling Price */}
        <div className="space-y-2">
          <Label htmlFor="selling_price">Selling Price ($)</Label>
          <Input
            id="selling_price"
            name="selling_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.selling_price}
            placeholder="0.00"
          />
        </div>

        {/* Cost Price */}
        <div className="space-y-2">
          <Label htmlFor="cost_price">Cost Price ($)</Label>
          <Input
            id="cost_price"
            name="cost_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.cost_price}
            placeholder="0.00"
          />
        </div>

        {/* Stock Quantity */}
        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            defaultValue={product?.stock_quantity ?? 0}
          />
        </div>

        {/* Reorder Level */}
        <div className="space-y-2">
          <Label htmlFor="reorder_level">Reorder Level</Label>
          <Input
            id="reorder_level"
            name="reorder_level"
            type="number"
            min="0"
            defaultValue={product?.reorder_level ?? 10}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          placeholder="Optional product description..."
          className="min-h-[80px]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 border-t pt-4">
        <Link href="/inventory" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Link>
        <Button type="submit" disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Save, Plus } from "lucide-react";
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
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setCreatingCategory(true);
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, slug, description: "" })
      .select("id, name, slug")
      .single();

    if (error) {
      toast.error(error.message);
      setCreatingCategory(false);
      return;
    }

    toast.success(`Category "${name}" created`);
    setCategoryList((prev) => [...prev, data]);
    setSelectedCategory(data.id);
    setNewCategoryName("");
    setNewCategoryDialogOpen(false);
    setCreatingCategory(false);
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) setSelectedCategory(value);
  };

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
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="sku" className="font-semibold">
              SKU <span className="text-xs font-normal text-muted-foreground">(Stock Keeping Unit)</span> *
            </Label>
          </div>
          <Input
            id="sku"
            name="sku"
            defaultValue={product?.sku}
            placeholder="e.g. PLY-34 for Plywood, PVC-210 for PVC Pipe"
            required
            onChange={(e) => {
              // Auto-uppercase for consistency
              const start = e.target.selectionStart;
              const end = e.target.selectionEnd;
              e.target.value = e.target.value.toUpperCase();
              e.target.setSelectionRange(start, end);
            }}
            className="font-mono text-sm uppercase"
          />
          <p className="text-xs text-muted-foreground">
            A unique code to identify this product. Common format:{" "}
            <span className="font-medium">CATEGORY-PREFIX + NUMBER</span>{" "}
            (e.g. PLY-34, PVC-210, NAIL-16D). SKUs are automatically uppercased.
          </p>
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
          <div className="flex items-center justify-between">
            <Label>Category</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setNewCategoryDialogOpen(true)}
            >
              <Plus className="h-3 w-3" />
              Add Category
            </Button>
          </div>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryList.map((cat) => (
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

      {/* New Category Dialog */}
      <Dialog open={newCategoryDialogOpen} onOpenChange={(open) => {
        setNewCategoryDialogOpen(open);
        if (!open) setNewCategoryName("");
      }}>
        <DialogContent className="sm:max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCategory();
            }}
          >
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your products
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-category-name">Category Name</Label>
                <Input
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Drywall, Insulation, Gutters"
                  autoFocus
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewCategoryDialogOpen(false);
                  setNewCategoryName("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creatingCategory || !newCategoryName.trim()}>
                {creatingCategory ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  PackageOpen,
} from "lucide-react";
import { toast } from "sonner";

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  sku: string;
  name: string;
  category_id: string | null;
  unit: string;
  selling_price: number;
  stock_quantity: number;
  reorder_level: number;
  active: boolean;
  categories: { name: string; slug: string } | null;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const client = createClient();

    let query = client
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    if (categoryFilter && categoryFilter !== "all") {
      query = query.eq("categories.slug", categoryFilter);
    }

    const { data: productsData } = await query;
    const { data: categoriesData } = await client
      .from("categories")
      .select("id, name, slug")
      .order("name");

    setProducts((productsData ?? []) as unknown as Product[]);
    setCategories(categoriesData ?? []);
    setLoading(false);
  }, [search, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    const client = createClient();
    const { error } = await client.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
      return;
    }
    toast.success("Product deleted");
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your products and stock levels
          </p>
        </div>
        <Link href="/inventory/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Products ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PackageOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search || categoryFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Add your first product to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-32">Category</TableHead>
                    <TableHead className="w-24">Unit</TableHead>
                    <TableHead className="w-24 text-right">Price</TableHead>
                    <TableHead className="w-24 text-right">Stock</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                    <TableHead className="w-20 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const isLowStock =
                      product.stock_quantity <= product.reorder_level;
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs">
                          {product.sku}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.categories?.name ?? "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          ${product.selling_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              isLowStock
                                ? "font-semibold text-destructive"
                                : ""
                            }
                          >
                            {product.stock_quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isLowStock ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : (
                            <Badge variant="secondary">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link
                              href={`/inventory/${product.id}/edit`}
                              className={buttonVariants({ variant: "ghost", size: "icon" })}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDelete(product.id, product.name)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

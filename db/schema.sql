-- ============================================
-- Touchstone Builders - Database Schema
-- Supabase PostgreSQL
-- ============================================

-- 1. USERS (extends Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'cashier' CHECK (role IN ('admin', 'cashier')),
  phone TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  unit TEXT NOT NULL DEFAULT 'piece' CHECK (unit IN ('piece', 'box', 'bundle', 'roll', 'bag', 'cubic_meter', 'linear_foot', 'square_foot', 'gallon', 'liter', 'kg', 'lb')),
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 10,
  image_url TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_low_stock ON public.products(stock_quantity) WHERE stock_quantity <= reorder_level;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. CUSTOMERS
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customers_name ON public.customers(name);
CREATE INDEX idx_customers_phone ON public.customers(phone);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 5. SUPPLIERS
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- 6. SALES
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'credit', 'transfer')),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'refunded')),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sales_date ON public.sales(created_at);
CREATE INDEX idx_sales_customer ON public.sales(customer_id);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- 7. SALE ITEMS
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

CREATE INDEX idx_sale_items_sale ON public.sale_items(sale_id);

ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- 8. PURCHASE ORDERS
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT NOT NULL UNIQUE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'received', 'cancelled')),
  total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

-- 9. PURCHASE ORDER ITEMS
CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  received_quantity INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- 10. INVENTORY TRANSACTIONS (audit log)
CREATE TABLE public.inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('sale', 'purchase', 'adjustment', 'return', 'transfer')),
  quantity INTEGER NOT NULL,
  reference_type TEXT DEFAULT '',
  reference_id UUID,
  note TEXT DEFAULT '',
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_inventory_transactions_product ON public.inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_date ON public.inventory_transactions(created_at);

ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;


-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- All authenticated users can read products, categories, customers, suppliers
CREATE POLICY "Authenticated users can read products" ON public.products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read categories" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read customers" ON public.customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read suppliers" ON public.suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can write to products, categories, customers, suppliers
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- All authenticated users can create sales
CREATE POLICY "Users can create sales" ON public.sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can read sales" ON public.sales
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create sale items" ON public.sale_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can read sale items" ON public.sale_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Inventory transactions
CREATE POLICY "Users can create inventory transactions" ON public.inventory_transactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can read inventory transactions" ON public.inventory_transactions
  FOR SELECT USING (auth.role() = 'authenticated');


-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Auto-create public user record on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'cashier')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on auth signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update product updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

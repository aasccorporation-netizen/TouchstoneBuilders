// Run with: npx tsx db/seed.ts
// Seeds the database with hardware store data

// Load credentials from environment variables
// Set these before running: npx tsx db/seed.ts
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://nfqzvfizcjpqphulemnl.supabase.co";

const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  "";

if (!SERVICE_ROLE_KEY) {
  console.error("❌ Missing service_role key!");
  console.error("   Set it as an environment variable:");
  console.error("   SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx db/seed.ts");
  console.error("   Or copy it from supabase.txt into .env.local as:");
  console.error("   SUPABASE_SERVICE_ROLE_KEY=your_key");
  process.exit(1);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  // Some responses are 201 with no body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

interface Category { name: string; slug: string; description: string }
interface Product { sku: string; name: string; category_slug: string; unit: string; cost_price: number; selling_price: number; stock_quantity: number; reorder_level: number }
interface Customer { name: string; phone: string; email: string; address: string }
interface Supplier { name: string; contact_person: string; phone: string; email: string }

const categories: Category[] = [
  { name: "Lumber & Plywood", slug: "lumber-plywood", description: "Lumber, plywood sheets, beams, and framing materials" },
  { name: "Plumbing", slug: "plumbing", description: "Pipes, fittings, valves, and plumbing supplies" },
  { name: "Electrical", slug: "electrical", description: "Wiring, switches, outlets, and electrical components" },
  { name: "Tools", slug: "tools", description: "Hand tools, power tools, and tool accessories" },
  { name: "Paint & Coatings", slug: "paint-coatings", description: "Paint, stains, primers, and painting supplies" },
  { name: "Hardware", slug: "hardware", description: "Nails, screws, bolts, hinges, and fasteners" },
  { name: "Concrete & Masonry", slug: "concrete-masonry", description: "Cement, concrete mix, bricks, and masonry tools" },
  { name: "Roofing & Gutters", slug: "roofing-gutters", description: "Roofing materials, shingles, gutters, and accessories" },
  { name: "Flooring", slug: "flooring", description: "Tile, vinyl, laminate, and flooring installation supplies" },
  { name: "Doors & Windows", slug: "doors-windows", description: "Interior and exterior doors, windows, and hardware" },
];

const products: Product[] = [
  { sku: "PLY-34", name: "3/4 in Plywood Sheet 4x8", category_slug: "lumber-plywood", unit: "piece", cost_price: 32.50, selling_price: 49.99, stock_quantity: 45, reorder_level: 20 },
  { sku: "PLY-12", name: "1/2 in Plywood Sheet 4x8", category_slug: "lumber-plywood", unit: "piece", cost_price: 22.00, selling_price: 34.99, stock_quantity: 60, reorder_level: 25 },
  { sku: "LUM-2X4", name: "2x4 Stud SPF 8ft", category_slug: "lumber-plywood", unit: "piece", cost_price: 3.20, selling_price: 5.49, stock_quantity: 500, reorder_level: 100 },
  { sku: "LUM-2X6", name: "2x6 Stud SPF 8ft", category_slug: "lumber-plywood", unit: "piece", cost_price: 4.80, selling_price: 7.99, stock_quantity: 300, reorder_level: 75 },
  { sku: "LUM-PT4X4", name: "Pressure Treated 4x4 Post 8ft", category_slug: "lumber-plywood", unit: "piece", cost_price: 8.50, selling_price: 14.99, stock_quantity: 120, reorder_level: 30 },
  { sku: "OSB-716", name: "7/16 in OSB Sheathing 4x8", category_slug: "lumber-plywood", unit: "piece", cost_price: 11.00, selling_price: 17.99, stock_quantity: 80, reorder_level: 30 },
  { sku: "LUM-PT2X6", name: "Pressure Treated 2x6 Deck Board 12ft", category_slug: "lumber-plywood", unit: "piece", cost_price: 7.50, selling_price: 12.99, stock_quantity: 200, reorder_level: 50 },
  { sku: "PVC-210", name: "PVC Pipe 2 in x 10ft Schedule 40", category_slug: "plumbing", unit: "piece", cost_price: 4.50, selling_price: 7.99, stock_quantity: 150, reorder_level: 40 },
  { sku: "PVC-110", name: "PVC Pipe 1 in x 10ft Schedule 40", category_slug: "plumbing", unit: "piece", cost_price: 2.80, selling_price: 4.99, stock_quantity: 200, reorder_level: 50 },
  { sku: "PVC-EL90-2", name: "PVC Elbow 90 deg 2 in", category_slug: "plumbing", unit: "piece", cost_price: 0.80, selling_price: 1.49, stock_quantity: 400, reorder_level: 100 },
  { sku: "PVC-COUP-2", name: "PVC Coupling 2 in", category_slug: "plumbing", unit: "piece", cost_price: 0.50, selling_price: 0.99, stock_quantity: 500, reorder_level: 150 },
  { sku: "FCT-BALL-34", name: "Ball Valve 3/4 in Brass", category_slug: "plumbing", unit: "piece", cost_price: 5.20, selling_price: 8.99, stock_quantity: 75, reorder_level: 25 },
  { sku: "COP-12", name: "Type L Copper Pipe 1/2 in x 10ft", category_slug: "plumbing", unit: "piece", cost_price: 12.00, selling_price: 19.99, stock_quantity: 40, reorder_level: 12 },
  { sku: "FCT-FP-34", name: "Frost-Free Faucet 3/4 in Bronze", category_slug: "plumbing", unit: "piece", cost_price: 18.00, selling_price: 32.99, stock_quantity: 15, reorder_level: 6 },
  { sku: "WIR-14-2", name: "14/2 NM-B Romex Wire 50ft", category_slug: "electrical", unit: "roll", cost_price: 22.00, selling_price: 34.99, stock_quantity: 30, reorder_level: 10 },
  { sku: "WIR-12-2", name: "12/2 NM-B Romex Wire 50ft", category_slug: "electrical", unit: "roll", cost_price: 28.00, selling_price: 42.99, stock_quantity: 25, reorder_level: 10 },
  { sku: "SWT-TOGGLE", name: "Light Switch Single Pole White", category_slug: "electrical", unit: "piece", cost_price: 1.20, selling_price: 2.49, stock_quantity: 300, reorder_level: 75 },
  { sku: "OUT-DUPLEX", name: "Duplex Outlet White 15A", category_slug: "electrical", unit: "piece", cost_price: 1.50, selling_price: 3.29, stock_quantity: 250, reorder_level: 60 },
  { sku: "BRK-20A", name: "Circuit Breaker 20A Single Pole", category_slug: "electrical", unit: "piece", cost_price: 3.50, selling_price: 6.99, stock_quantity: 100, reorder_level: 30 },
  { sku: "WIR-LT-GFCI", name: "GFCI Outlet White 20A", category_slug: "electrical", unit: "piece", cost_price: 8.00, selling_price: 14.99, stock_quantity: 60, reorder_level: 20 },
  { sku: "TOOL-HAMMER", name: "16oz Fiberglass Claw Hammer", category_slug: "tools", unit: "piece", cost_price: 8.00, selling_price: 14.99, stock_quantity: 50, reorder_level: 15 },
  { sku: "TOOL-DRILL", name: "18V Cordless Drill Driver Kit", category_slug: "tools", unit: "piece", cost_price: 65.00, selling_price: 99.99, stock_quantity: 20, reorder_level: 8 },
  { sku: "TOOL-TAPE", name: "25ft Tape Measure with Blade Lock", category_slug: "tools", unit: "piece", cost_price: 4.50, selling_price: 8.99, stock_quantity: 80, reorder_level: 25 },
  { sku: "TOOL-LEVEL", name: "48 in Aluminum Spirit Level", category_slug: "tools", unit: "piece", cost_price: 12.00, selling_price: 22.99, stock_quantity: 35, reorder_level: 10 },
  { sku: "TOOL-SD", name: "#2 Phillips Screwdriver 6 in", category_slug: "tools", unit: "piece", cost_price: 2.50, selling_price: 4.99, stock_quantity: 120, reorder_level: 30 },
  { sku: "TOOL-SAW", name: "7-1/4 in Circular Saw 15A", category_slug: "tools", unit: "piece", cost_price: 55.00, selling_price: 89.99, stock_quantity: 15, reorder_level: 6 },
  { sku: "TOOL-WRENCH", name: "10 in Adjustable Wrench Crescent", category_slug: "tools", unit: "piece", cost_price: 10.00, selling_price: 18.99, stock_quantity: 40, reorder_level: 12 },
  { sku: "TOOL-UTIL", name: "Utility Knife Retractable", category_slug: "tools", unit: "piece", cost_price: 3.00, selling_price: 5.99, stock_quantity: 100, reorder_level: 30 },
  { sku: "PT-INT-GAL", name: "Interior Latex Paint Eggshell White Gallon", category_slug: "paint-coatings", unit: "gallon", cost_price: 18.00, selling_price: 32.99, stock_quantity: 60, reorder_level: 20 },
  { sku: "PT-EXT-GAL", name: "Exterior Latex Paint Satin White Gallon", category_slug: "paint-coatings", unit: "gallon", cost_price: 22.00, selling_price: 38.99, stock_quantity: 40, reorder_level: 15 },
  { sku: "PT-PRMR-GAL", name: "White Interior/Exterior Primer Gallon", category_slug: "paint-coatings", unit: "gallon", cost_price: 14.00, selling_price: 24.99, stock_quantity: 35, reorder_level: 12 },
  { sku: "PT-STN-GAL", name: "Semi-Transparent Wood Stain Cedar Gallon", category_slug: "paint-coatings", unit: "gallon", cost_price: 20.00, selling_price: 34.99, stock_quantity: 25, reorder_level: 10 },
  { sku: "PT-BRUSH2", name: "2 in Angle Sash Paint Brush", category_slug: "paint-coatings", unit: "piece", cost_price: 3.00, selling_price: 5.99, stock_quantity: 80, reorder_level: 25 },
  { sku: "PT-ROLLER9", name: "9 in Paint Roller Frame with Cover", category_slug: "paint-coatings", unit: "piece", cost_price: 4.00, selling_price: 7.49, stock_quantity: 60, reorder_level: 20 },
  { sku: "NAIL-16D", name: "16d Galvanized Nails 1lb Box", category_slug: "hardware", unit: "box", cost_price: 3.50, selling_price: 5.99, stock_quantity: 100, reorder_level: 30 },
  { sku: "NAIL-8D", name: "8d Galvanized Nails 1lb Box", category_slug: "hardware", unit: "box", cost_price: 3.00, selling_price: 4.99, stock_quantity: 120, reorder_level: 35 },
  { sku: "SCR-DK2", name: "Deck Screws #8 x 2 in 100ct", category_slug: "hardware", unit: "box", cost_price: 4.00, selling_price: 7.99, stock_quantity: 80, reorder_level: 20 },
  { sku: "SCR-DK3", name: "Deck Screws #8 x 3 in 75ct", category_slug: "hardware", unit: "box", cost_price: 5.00, selling_price: 9.49, stock_quantity: 60, reorder_level: 15 },
  { sku: "BOLT-38X4", name: "3/8 in x 4 in Hex Bolt with Nut 10pk", category_slug: "hardware", unit: "box", cost_price: 4.50, selling_price: 7.99, stock_quantity: 90, reorder_level: 25 },
  { sku: "HNG-DOOR3", name: "3 in T-Hinge Plain Steel 4pk", category_slug: "hardware", unit: "box", cost_price: 5.00, selling_price: 8.99, stock_quantity: 50, reorder_level: 15 },
  { sku: "CEM-50", name: "Portland Cement Type I/II 50lb Bag", category_slug: "concrete-masonry", unit: "bag", cost_price: 6.50, selling_price: 11.99, stock_quantity: 100, reorder_level: 30 },
  { sku: "CEM-CON80", name: "Concrete Mix 80lb Bag", category_slug: "concrete-masonry", unit: "bag", cost_price: 5.00, selling_price: 8.49, stock_quantity: 200, reorder_level: 50 },
  { sku: "REBAR-4", name: "#4 Rebar 1/2 in x 20ft", category_slug: "concrete-masonry", unit: "piece", cost_price: 4.00, selling_price: 6.99, stock_quantity: 80, reorder_level: 20 },
  { sku: "BRK-STD", name: "Standard Concrete Brick 8x4x2.25", category_slug: "concrete-masonry", unit: "piece", cost_price: 0.80, selling_price: 1.49, stock_quantity: 1000, reorder_level: 250 },
  { sku: "SHNG-ASPH", name: "Architectural Shingle Bundle Brown", category_slug: "roofing-gutters", unit: "bundle", cost_price: 22.00, selling_price: 36.99, stock_quantity: 40, reorder_level: 15 },
  { sku: "SHNG-FLASH", name: "Galvanized Step Flashing 6x6 in 10pk", category_slug: "roofing-gutters", unit: "box", cost_price: 8.00, selling_price: 14.99, stock_quantity: 30, reorder_level: 10 },
  { sku: "GTR-5IN", name: "5 in Aluminum Gutter Section White 10ft", category_slug: "roofing-gutters", unit: "piece", cost_price: 12.00, selling_price: 19.99, stock_quantity: 50, reorder_level: 15 },
  { sku: "SHNG-RIDGE", name: "Ridge Vent 10ft Aluminum", category_slug: "roofing-gutters", unit: "piece", cost_price: 15.00, selling_price: 24.99, stock_quantity: 25, reorder_level: 8 },
  { sku: "TILE-CER12", name: "12x12 Ceramic Floor Tile Beige", category_slug: "flooring", unit: "piece", cost_price: 1.50, selling_price: 2.99, stock_quantity: 500, reorder_level: 100 },
  { sku: "VNL-PLANK", name: "Luxury Vinyl Plank Flooring Grey 6x36 in", category_slug: "flooring", unit: "piece", cost_price: 2.00, selling_price: 3.99, stock_quantity: 400, reorder_level: 100 },
  { sku: "LAM-AC3", name: "Laminate Flooring Oak 12mm 7pk", category_slug: "flooring", unit: "box", cost_price: 28.00, selling_price: 44.99, stock_quantity: 25, reorder_level: 10 },
  { sku: "DOOR-INT30", name: "30 in Interior Hollow Core Door White", category_slug: "doors-windows", unit: "piece", cost_price: 35.00, selling_price: 59.99, stock_quantity: 20, reorder_level: 8 },
  { sku: "DOOR-INT32", name: "32 in Interior Hollow Core Door White", category_slug: "doors-windows", unit: "piece", cost_price: 38.00, selling_price: 64.99, stock_quantity: 18, reorder_level: 8 },
  { sku: "DOOR-EXT36", name: "36 in Steel Exterior Door Primed", category_slug: "doors-windows", unit: "piece", cost_price: 120.00, selling_price: 199.99, stock_quantity: 10, reorder_level: 4 },
  { sku: "WND-30X36", name: "30x36 in Single Hung Vinyl Window White", category_slug: "doors-windows", unit: "piece", cost_price: 85.00, selling_price: 149.99, stock_quantity: 8, reorder_level: 3 },
  { sku: "WND-36X48", name: "36x48 in Single Hung Vinyl Window White", category_slug: "doors-windows", unit: "piece", cost_price: 110.00, selling_price: 189.99, stock_quantity: 6, reorder_level: 3 },
];

const customers: Customer[] = [
  { name: "Acme Construction LLC", phone: "(555) 123-4567", email: "info@acmecon.com", address: "123 Builder St, Construction City, ST 12345" },
  { name: "Walker Renovations", phone: "(555) 234-5678", email: "jim@walkerrenos.com", address: "456 Renovation Ave, Hometown, ST 12346" },
  { name: "David Thompson", phone: "(555) 345-6789", email: "david.thompson@gmail.com", address: "789 Oak Ln, Suburbia, ST 12347" },
  { name: "Pioneer Homes Corp", phone: "(555) 456-7890", email: "orders@pioneerhomes.com", address: "321 Pioneer Blvd, Buildville, ST 12348" },
  { name: "Maria Santos", phone: "(555) 567-8901", email: "maria.santos@yahoo.com", address: "654 Maple Dr, Greentown, ST 12349" },
  { name: "GreenLeaf Contracting", phone: "(555) 678-9012", email: "info@greenleafcontract.com", address: "987 Elm St, EcoCity, ST 12350" },
  { name: "Robert Chen", phone: "(555) 789-0123", email: "robert.chen@outlook.com", address: "147 Pine Rd, Lakeview, ST 12351" },
  { name: "Summit Builders Inc", phone: "(555) 890-1234", email: "contact@summitbuild.com", address: "258 Summit Dr, Peakville, ST 12352" },
];

const suppliers: Supplier[] = [
  { name: "Builders Supply Co", contact_person: "Mark Wilson", phone: "(800) 111-2222", email: "mark@builderssupply.com" },
  { name: "National Lumber Inc", contact_person: "Sarah Johnson", phone: "(800) 222-3333", email: "sarah@nationallumber.com" },
  { name: "Pipe & Fittings Direct", contact_person: "Tom Rodriguez", phone: "(800) 333-4444", email: "tom@pfdirect.com" },
  { name: "Power Tools Warehouse", contact_person: "Lisa Anderson", phone: "(800) 444-5555", email: "lisa@powertools.com" },
  { name: "Paint Mart Distributors", contact_person: "James Lee", phone: "(800) 555-6666", email: "james@paintmart.com" },
  { name: "Fastener World", contact_person: "Amy Patel", phone: "(800) 666-7777", email: "amy@fastenerworld.com" },
  { name: "Concrete Solutions Inc", contact_person: "Mike Brown", phone: "(800) 777-8888", email: "mike@concretesolutions.com" },
  { name: "Roofing Supply Depot", contact_person: "Chris Taylor", phone: "(800) 888-9999", email: "chris@roofingsupply.com" },
];

async function upsert<T>(path: string, data: T[]) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: `resolution=merge-duplicates,return=representation`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    // If it's a duplicate key conflict, the upsert handled it
    if (res.status === 409) {
      console.log(`  ~ ${data.length} records already exist, skipped`);
      return [];
    }
    throw new Error(`${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

async function main() {
  console.log("Seeding Touchstone Builders Database...\n");

  console.log("Inserting categories...");
  const insertedCategories = await upsert("/rest/v1/categories", categories);
  console.log(`  ✓ ${insertedCategories.length || categories.length} categories`);

  // Build slug -> ID map from server response or from existing data
  const categoryMap = new Map<string, string>();
  if (insertedCategories.length > 0) {
    for (const cat of insertedCategories) {
      categoryMap.set(cat.slug, cat.id);
    }
  } else {
    // Categories already existed, fetch them
    const cats = await apiFetch("/rest/v1/categories?select=id,slug");
    for (const cat of cats) {
      categoryMap.set(cat.slug, cat.id);
    }
  }

  // Map products with category_id
  const productPayload = products.map((p) => ({
    sku: p.sku,
    name: p.name,
    category_id: categoryMap.get(p.category_slug),
    unit: p.unit,
    cost_price: p.cost_price,
    selling_price: p.selling_price,
    stock_quantity: p.stock_quantity,
    reorder_level: p.reorder_level,
  }));

  console.log("Inserting products...");
  await upsert("/rest/v1/products", productPayload);
  console.log(`  ✓ ${products.length} products`);

  console.log("Inserting customers...");
  await upsert("/rest/v1/customers", customers);
  console.log(`  ✓ ${customers.length} customers`);

  console.log("Inserting suppliers...");
  await upsert("/rest/v1/suppliers", suppliers);
  console.log(`  ✓ ${suppliers.length} suppliers`);

  console.log("\n✅ Database seeding complete!");
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Products:   ${products.length}`);
  console.log(`   Customers:  ${customers.length}`);
  console.log(`   Suppliers:  ${suppliers.length}`);
}

main().catch((err) => {
  console.error("\n❌ Seeding failed:", err.message);
  process.exit(1);
});

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { CATEGORIES, type Product } from "@/lib/products";
import { Pencil, Trash2, Plus, X, Check, ShieldCheck, LayoutDashboard, Package } from "lucide-react";
import { createProduct, updateProduct, deleteProduct } from "./actions";

type FormData = Omit<Product, "id">;

const blank: FormData = {
  name: "", description: "", price: 0, category: "Electronics",
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  rating: 4.5, reviews: 0, stock: 10, featured: false,
};

export default function AdminClient({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormData>(blank);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => { setForm(blank); setCreating(true); setEditing(null); };
  const openEdit = (p: Product) => { setForm({ ...p }); setEditing(p); setCreating(false); };
  const closeModal = () => { setCreating(false); setEditing(null); };

  const save = () => {
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("description", form.description);
    fd.set("price", String(form.price));
    fd.set("category", form.category);
    fd.set("image", form.image);
    fd.set("rating", String(form.rating));
    fd.set("reviews", String(form.reviews));
    fd.set("stock", String(form.stock));
    if (form.featured) fd.set("featured", "on");

    startTransition(async () => {
      if (editing) await updateProduct(editing.id, fd);
      else await createProduct(fd);
      closeModal();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return;
    startTransition(async () => {
      await deleteProduct(id);
    });
  };

  const f = (key: keyof FormData, label: string, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="w-6 h-6 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-gray-900">Admin — Products</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">Live data — changes persist to the database.</p>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm bg-white border border-gray-200 hover:border-indigo-300 px-4 py-2 rounded-xl text-gray-700 transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm bg-white border border-gray-200 hover:border-indigo-300 px-4 py-2 rounded-xl text-gray-700 transition-colors">
          <Package className="w-4 h-4" /> Orders
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">{products.length} products</span>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">Image</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Rating</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                  {p.name}
                  {p.featured && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">★ featured</span>}
                </td>
                <td className="px-4 py-3 text-indigo-600">{p.category}</td>
                <td className="px-4 py-3 text-right font-semibold">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-orange-500" : "text-gray-700"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-amber-500 font-semibold">{p.rating}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-40">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={isPending} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-full">{f("name", "Name")}</div>
              <div className="col-span-full">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />
              </div>
              {f("price", "Price", "number")}
              {f("stock", "Stock", "number")}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 self-end">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-indigo-600"
                />
                <span className="text-sm font-medium text-gray-700">Featured on homepage</span>
              </label>
              {f("rating", "Rating (0–5)", "number")}
              {f("reviews", "Review Count", "number")}
              <div className="col-span-full">{f("image", "Image URL")}</div>
              {form.image && (
                <div className="col-span-full relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <Image src={form.image} alt="preview" fill className="object-cover" sizes="400px" />
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={closeModal} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={save} disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> {isPending ? "Saving…" : editing ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

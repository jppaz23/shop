"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const t = useTranslations("admin");
  const tDash = useTranslations("dashboard");
  const tCommon = useTranslations("common");

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
    if (!confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      await deleteProduct(id);
    });
  };

  const f = (key: keyof FormData, label: string, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
        className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="w-6 h-6 text-black" />
        <h1 className="text-3xl font-black text-stone-950 tracking-tight">{t("title")}</h1>
      </div>
      <p className="text-stone-500 text-sm mb-6">{t("subtitle")}</p>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm bg-white border border-stone-200 hover:border-black px-4 py-2 rounded-xl text-stone-700 transition-colors">
          <LayoutDashboard className="w-4 h-4" /> {tDash("title")}
        </Link>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm bg-white border border-stone-200 hover:border-black px-4 py-2 rounded-xl text-stone-700 transition-colors">
          <Package className="w-4 h-4" /> {tDash("orders")}
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-stone-500">{t("products", { count: products.length })}</span>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-black hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> {t("addProduct")}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl ring-1 ring-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="text-left px-4 py-3 font-semibold text-stone-600 w-16">{t("image")}</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">{t("name")}</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">{t("category")}</th>
              <th className="text-right px-4 py-3 font-semibold text-stone-600">{t("price")}</th>
              <th className="text-right px-4 py-3 font-semibold text-stone-600">{t("stock")}</th>
              <th className="text-right px-4 py-3 font-semibold text-stone-600">{t("rating")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((p) => (
              <tr key={p.id} className="bg-white hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-stone-900 max-w-xs truncate">
                  {p.name}
                  {p.featured && <span className="ml-2 text-xs bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">{t("featuredBadge")}</span>}
                </td>
                <td className="px-4 py-3 text-black">{p.category}</td>
                <td className="px-4 py-3 text-right font-semibold">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-orange-500" : "text-stone-700"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-lime-600 font-semibold">{p.rating}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} disabled={isPending} className="p-1.5 text-stone-400 hover:text-black transition-colors disabled:opacity-40">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={isPending} className="p-1.5 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-40">
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
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="font-black text-lg text-stone-950 tracking-tight">{editing ? t("editProduct") : t("addProductTitle")}</h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-full">{f("name", t("name"))}</div>
              <div className="col-span-full">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">{t("description")}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
              {f("price", t("price"), "number")}
              {f("stock", t("stock"), "number")}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">{t("category")}</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 self-end">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-black"
                />
                <span className="text-sm font-medium text-stone-700">{t("featured")}</span>
              </label>
              {f("rating", t("ratingHint"), "number")}
              {f("reviews", t("reviewCount"), "number")}
              <div className="col-span-full">{f("image", t("imageUrl"))}</div>
              {form.image && (
                <div className="col-span-full relative aspect-video rounded-xl overflow-hidden bg-stone-100">
                  <Image src={form.image} alt="preview" fill className="object-cover" sizes="400px" />
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-stone-100">
              <button onClick={closeModal} className="flex-1 border border-stone-200 text-stone-600 font-semibold py-2.5 rounded-full hover:bg-stone-50 transition-colors">{tCommon("cancel")}</button>
              <button onClick={save} disabled={isPending} className="flex-1 bg-black hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> {isPending ? tCommon("saving") : editing ? t("saveChanges") : t("createProduct")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

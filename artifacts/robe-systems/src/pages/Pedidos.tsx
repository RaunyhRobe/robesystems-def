import { useState, useMemo, useCallback } from "react";
import AppShell, { DarkSelect, DarkOption, NavItem } from "@/components/demos/AppShell";
import {
  LayoutDashboard, ShoppingBag, BookOpen, LayoutGrid, BarChart2,
  Plus, X, Trash2, CheckCircle, ChevronRight, Search, Minus, MapPin, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── types ──────────────────────────────────────────────────────────────────

type OrderStatus = "novo" | "preparando" | "pronto" | "entregue";
type TableStatus = "livre" | "ocupada" | "conta";

interface Extra { id: string; label: string; price: number }
interface MenuItem { id: string; name: string; price: number; category: string; extras?: Extra[]; sizes?: { label: string; price: number }[]; available: boolean }
interface OrderLineItem { menuItemId: string; name: string; size?: string; extras: string[]; qty: number; unitPrice: number }
interface Order { id: string; tableLabel: string; items: OrderLineItem[]; total: number; time: string; status: OrderStatus; note: string }
interface Table { id: number; label: string; seats: number; status: TableStatus }

// ── data ────────────────────────────────────────────────────────────────────

const INITIAL_MENU: MenuItem[] = [
  { id: "acai-p",  name: "Açaí",         price: 0,    category: "Açaí",    available: true, sizes: [{ label: "300ml", price: 18 }, { label: "400ml", price: 22 }, { label: "500ml", price: 26 }], extras: [{ id: "granola", label: "Granola", price: 3 }, { id: "leite", label: "Leite em pó", price: 2 }, { id: "frutas", label: "Frutas da época", price: 4 }, { id: "pacoca", label: "Paçoca", price: 2 }, { id: "mel", label: "Mel", price: 2 }, { id: "nutella", label: "Nutella", price: 5 }] },
  { id: "hbg-s",  name: "Hambúrguer Simples", price: 22, category: "Lanches", available: true, extras: [{ id: "bef", label: "Bacon extra", price: 4 }, { id: "quejo", label: "Queijo extra", price: 2 }] },
  { id: "hbg-d",  name: "Hambúrguer Duplo",   price: 28, category: "Lanches", available: true, extras: [{ id: "bef", label: "Bacon extra", price: 4 }, { id: "quejo", label: "Queijo extra", price: 2 }] },
  { id: "xtudo",  name: "X-Tudo",              price: 32, category: "Lanches", available: true, extras: [{ id: "bef", label: "Bacon extra", price: 4 }] },
  { id: "frg-c",  name: "Frango Crispy",       price: 24, category: "Lanches", available: true, extras: [] },
  { id: "ref-l",  name: "Refrigerante Lata",   price: 6,  category: "Bebidas", available: true, sizes: [{ label: "Coca-Cola", price: 6 }, { label: "Guaraná", price: 6 }, { label: "Sprite", price: 6 }] },
  { id: "suco",   name: "Suco Natural",        price: 0,  category: "Bebidas", available: true, sizes: [{ label: "300ml", price: 9 }, { label: "500ml", price: 13 }] },
  { id: "agua",   name: "Água 500ml",          price: 4,  category: "Bebidas", available: true, extras: [] },
  { id: "vita",   name: "Vitamina de Frutas",  price: 12, category: "Bebidas", available: true, extras: [] },
  { id: "bat-p",  name: "Batata Frita P",      price: 14, category: "Porções", available: true, extras: [{ id: "cheddar", label: "Cheddar", price: 4 }, { id: "bacon2", label: "Bacon", price: 4 }] },
  { id: "bat-g",  name: "Batata Frita G",      price: 20, category: "Porções", available: true, extras: [{ id: "cheddar", label: "Cheddar", price: 4 }, { id: "bacon2", label: "Bacon", price: 4 }] },
  { id: "frgfr",  name: "Frango Frito",        price: 22, category: "Porções", available: true, extras: [] },
  { id: "onion",  name: "Onion Rings",         price: 16, category: "Porções", available: true, extras: [] },
];

const CATEGORIES = ["Açaí", "Lanches", "Bebidas", "Porções"];

const INITIAL_ORDERS: Order[] = [
  { id: "#042", tableLabel: "Mesa 3",   items: [{ menuItemId: "hbg-d", name: "Hambúrguer Duplo", qty: 1, unitPrice: 28, extras: ["Bacon extra"], size: undefined }], total: 32, time: "18:32", status: "novo",       note: "" },
  { id: "#041", tableLabel: "Mesa 7",   items: [{ menuItemId: "acai-p", name: "Açaí 500ml", qty: 2, unitPrice: 26, extras: ["Granola","Leite em pó"], size: "500ml" }], total: 62, time: "18:28", status: "preparando", note: "Sem mel" },
  { id: "#040", tableLabel: "Mesa 1",   items: [{ menuItemId: "bat-g", name: "Batata Frita G", qty: 1, unitPrice: 24, extras: ["Cheddar"], size: undefined }, { menuItemId: "suco", name: "Suco Natural 300ml", qty: 2, unitPrice: 9, extras: [], size: "300ml" }], total: 42, time: "18:20", status: "preparando", note: "" },
  { id: "#039", tableLabel: "Mesa 5",   items: [{ menuItemId: "frgfr", name: "Frango Frito", qty: 1, unitPrice: 22, extras: [], size: undefined }], total: 22, time: "18:10", status: "pronto",     note: "" },
  { id: "#038", tableLabel: "Delivery", items: [{ menuItemId: "acai-p", name: "Açaí 400ml", qty: 1, unitPrice: 22, extras: ["Granola","Paçoca"], size: "400ml" }], total: 27, time: "18:05", status: "pronto",     note: "" },
  { id: "#037", tableLabel: "Mesa 2",   items: [{ menuItemId: "xtudo", name: "X-Tudo", qty: 2, unitPrice: 32, extras: [], size: undefined }], total: 64, time: "17:55", status: "entregue",   note: "" },
];

const INITIAL_TABLES: Table[] = [
  { id: 1, label: "Mesa 1", seats: 4, status: "ocupada" },
  { id: 2, label: "Mesa 2", seats: 4, status: "livre"   },
  { id: 3, label: "Mesa 3", seats: 2, status: "ocupada" },
  { id: 4, label: "Mesa 4", seats: 6, status: "livre"   },
  { id: 5, label: "Mesa 5", seats: 4, status: "conta"   },
  { id: 6, label: "Mesa 6", seats: 4, status: "livre"   },
  { id: 7, label: "Mesa 7", seats: 2, status: "ocupada" },
  { id: 8, label: "Mesa 8", seats: 8, status: "livre"   },
];

const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = { novo: "preparando", preparando: "pronto", pronto: "entregue", entregue: null };
const STATUS_BTN_LABEL: Record<OrderStatus, string> = { novo: "Iniciar preparo", preparando: "Marcar pronto", pronto: "Entregar", entregue: "" };
const STATUS_COLOR: Record<OrderStatus, string> = { novo: "border-l-blue-400", preparando: "border-l-amber-400", pronto: "border-l-emerald-400", entregue: "border-l-white/15" };
const TABLE_STYLE: Record<TableStatus, string> = { livre: "border-white/10 bg-white/[0.03] text-white/60", ocupada: "border-amber-500/30 bg-amber-500/5 text-amber-300", conta: "border-rose-500/30 bg-rose-500/5 text-rose-300" };
const TABLE_BADGE: Record<TableStatus, string> = { livre: "bg-white/8 text-white/30", ocupada: "bg-amber-500/15 text-amber-300", conta: "bg-rose-500/15 text-rose-300" };

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function brl(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

// ── New Order Form ─────────────────────────────────────────────────────────

interface NewOrderFormProps { menu: MenuItem[]; tables: Table[]; onSubmit: (o: Order) => void; onCancel: () => void }

function NewOrderForm({ menu, tables, onSubmit, onCancel }: NewOrderFormProps) {
  const [tableLabel,    setTableLabel]    = useState("Mesa 1");
  const [note,          setNote]          = useState("");
  const [catFilter,     setCatFilter]     = useState("Açaí");
  const [search,        setSearch]        = useState("");
  const [lines,         setLines]         = useState<OrderLineItem[]>([]);
  const [deliveryCep,   setDeliveryCep]   = useState("");
  const [deliveryAddr,  setDeliveryAddr]  = useState("");
  const [cepLoading,    setCepLoading]    = useState(false);
  const [cepError,      setCepError]      = useState("");

  const lookupDeliveryCep = useCallback(async (raw: string) => {
    const cep = raw.replace(/\D/g, "");
    if (cep.length !== 8) { setDeliveryAddr(""); return; }
    setCepLoading(true);
    setCepError("");
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) { setCepError("CEP não encontrado."); return; }
      setDeliveryAddr(`${data.logradouro}${data.complemento ? " · " + data.complemento : ""}, ${data.bairro} — ${data.localidade}/${data.uf}`);
    } catch { setCepError("Erro ao consultar CEP."); }
    finally { setCepLoading(false); }
  }, []);

  // item picker state
  const [pickedItem, setPickedItem] = useState<MenuItem | null>(null);
  const [pickedSize, setPickedSize] = useState("");
  const [pickedExtras, setPickedExtras] = useState<string[]>([]);
  const [pickedQty, setPickedQty]   = useState(1);

  const filtered = menu.filter(m => m.available && m.category === catFilter && m.name.toLowerCase().includes(search.toLowerCase()));

  const itemPrice = useMemo(() => {
    if (!pickedItem) return 0;
    const base = pickedItem.sizes ? (pickedItem.sizes.find(s => s.label === pickedSize)?.price ?? 0) : pickedItem.price;
    const extrasTotal = pickedItem.extras?.filter(e => pickedExtras.includes(e.id)).reduce((s, e) => s + e.price, 0) ?? 0;
    return base + extrasTotal;
  }, [pickedItem, pickedSize, pickedExtras]);

  const total = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  function selectItem(item: MenuItem) {
    setPickedItem(item);
    setPickedSize(item.sizes?.[0]?.label ?? "");
    setPickedExtras([]);
    setPickedQty(1);
  }

  function addLine() {
    if (!pickedItem) return;
    const name = pickedItem.sizes ? `${pickedItem.name} ${pickedSize}` : pickedItem.name;
    const existing = lines.findIndex(l => l.menuItemId === pickedItem.id && l.size === pickedSize && JSON.stringify(l.extras) === JSON.stringify(pickedExtras));
    if (existing >= 0) {
      setLines(lines.map((l, i) => i === existing ? { ...l, qty: l.qty + pickedQty } : l));
    } else {
      setLines([...lines, { menuItemId: pickedItem.id, name, size: pickedSize || undefined, extras: pickedExtras, qty: pickedQty, unitPrice: itemPrice }]);
    }
    setPickedItem(null);
  }

  function submit() {
    if (lines.length === 0) return;
    const orderNum = `#${String(43 + Math.floor(Math.random() * 1000)).padStart(3,"0")}`;
    onSubmit({ id: orderNum, tableLabel, items: lines, total, time: nowTime(), status: "novo", note });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <p className="text-base font-semibold text-white">Novo pedido</p>
          <button onClick={onCancel}><X className="w-5 h-5 text-white/40 hover:text-white/70" /></button>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT: menu picker */}
          <div className="flex-1 min-w-0 flex flex-col border-r border-white/8 overflow-hidden">
            <div className="p-3 border-b border-white/8 space-y-2">
              <div className="flex gap-1 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCatFilter(cat)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${catFilter === cat ? "bg-white text-black border-white" : "text-white/40 border-white/10 hover:border-white/20"}`}>{cat}</button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar item…" className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white/70 placeholder:text-white/25 outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filtered.map(item => (
                <button key={item.id} onClick={() => selectItem(item)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left mb-1 transition-all ${pickedItem?.id === item.id ? "bg-white/10 border border-white/20" : "hover:bg-white/[0.04] border border-transparent"}`}>
                  <span className="text-sm text-white/80">{item.name}</span>
                  <span className="text-xs text-white/40 flex-shrink-0">
                    {item.sizes ? `${brl(item.sizes[0].price)} →` : brl(item.price)}
                  </span>
                </button>
              ))}
            </div>

            {/* item config */}
            {pickedItem && (
              <div className="border-t border-white/8 p-3 bg-white/[0.02] space-y-3">
                <p className="text-xs font-semibold text-white/60">{pickedItem.name}</p>
                {pickedItem.sizes && (
                  <div>
                    <p className="text-[10px] text-white/30 mb-1.5">Tamanho</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {pickedItem.sizes.map(s => (
                        <button key={s.label} onClick={() => setPickedSize(s.label)} className={`px-3 py-1 rounded-lg text-xs border transition-all ${pickedSize === s.label ? "bg-white text-black border-white" : "text-white/50 border-white/10 hover:border-white/25"}`}>
                          {s.label} · {brl(s.price)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {pickedItem.extras && pickedItem.extras.length > 0 && (
                  <div>
                    <p className="text-[10px] text-white/30 mb-1.5">Adicionais</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pickedItem.extras.map(e => (
                        <button key={e.id} onClick={() => setPickedExtras(prev => prev.includes(e.id) ? prev.filter(x => x !== e.id) : [...prev, e.id])} className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${pickedExtras.includes(e.id) ? "bg-white text-black border-white" : "text-white/50 border-white/10 hover:border-white/25"}`}>
                          {e.label} +{brl(e.price)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPickedQty(q => Math.max(1, q - 1))} className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/25"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-semibold text-white w-5 text-center">{pickedQty}</span>
                    <button onClick={() => setPickedQty(q => q + 1)} className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/25"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{brl(itemPrice * pickedQty)}</span>
                    <button onClick={addLine} className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors">Adicionar</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: order summary */}
          <div className="w-56 flex-shrink-0 flex flex-col">
            <div className="p-3 border-b border-white/8 space-y-2">
              <DarkSelect value={tableLabel} onChange={e => { setTableLabel(e.target.value); if (e.target.value !== "Delivery") { setDeliveryCep(""); setDeliveryAddr(""); setCepError(""); } }} className="w-full text-xs">
                <DarkOption value="Delivery">🛵 Delivery</DarkOption>
                {INITIAL_TABLES.map(t => <DarkOption key={t.id} value={t.label}>{t.label} ({t.seats} lug.)</DarkOption>)}
              </DarkSelect>
              <AnimatePresence>
                {tableLabel === "Delivery" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25" />
                      <input
                        value={deliveryCep}
                        onChange={e => { setDeliveryCep(e.target.value); lookupDeliveryCep(e.target.value); }}
                        placeholder="CEP de entrega"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-7 pr-7 py-1.5 text-xs text-white/70 placeholder:text-white/25 outline-none focus:border-white/25"
                      />
                      {cepLoading && <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 animate-spin" />}
                    </div>
                    {deliveryAddr && <p className="text-[10px] text-emerald-400/80 leading-snug mt-1 px-0.5">{deliveryAddr}</p>}
                    {cepError    && <p className="text-[10px] text-rose-400 mt-1 px-0.5">{cepError}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {lines.length === 0 ? (
                <p className="text-[11px] text-white/25 text-center py-8">Adicione itens do cardápio</p>
              ) : (
                lines.map((l, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.03] mb-1">
                    <span className="text-xs text-white/30 w-4 flex-shrink-0 mt-0.5">{l.qty}×</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/80 leading-tight">{l.name}</p>
                      {l.extras.length > 0 && <p className="text-[10px] text-white/30">+{l.extras.join(", ")}</p>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs text-white/50">{brl(l.unitPrice * l.qty)}</span>
                      <button onClick={() => setLines(lines.filter((_, j) => j !== i))}><X className="w-3 h-3 text-white/20 hover:text-rose-400" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-white/8 space-y-2">
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Observação (opcional)" className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/70 placeholder:text-white/25 outline-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Total</span>
                <span className="text-sm font-bold text-white">{brl(total)}</span>
              </div>
              <button onClick={submit} disabled={lines.length === 0} className="w-full bg-white text-black text-sm font-semibold py-2 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-40">Confirmar pedido</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Kanban ─────────────────────────────────────────────────────────────────

const COLUMNS: { id: OrderStatus; label: string }[] = [
  { id: "novo", label: "Novos" },
  { id: "preparando", label: "Em preparo" },
  { id: "pronto", label: "Prontos" },
  { id: "entregue", label: "Entregues" },
];

function PedidosView({ orders, setOrders }: { orders: Order[]; setOrders: (o: Order[]) => void }) {
  const [showNew, setShowNew] = useState(false);

  function advance(id: string) {
    setOrders(orders.map(o => {
      if (o.id !== id) return o;
      const next = STATUS_NEXT[o.status];
      return next ? { ...o, status: next } : o;
    }));
  }

  function addOrder(o: Order) {
    setOrders([o, ...orders]);
    setShowNew(false);
  }

  return (
    <div className="p-5 md:p-7 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-semibold text-white">Pedidos em aberto</h2>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
          <Plus className="w-4 h-4" /> Novo pedido
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          return (
            <div key={col.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-white/8 text-white/40 text-[10px] flex items-center justify-center">{colOrders.length}</span>
              </div>
              <div className="min-h-[60px] flex flex-col gap-2">
                <AnimatePresence>
                  {colOrders.map(order => (
                    <motion.div key={order.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className={`bg-white/[0.04] border border-white/8 border-l-2 ${STATUS_COLOR[order.status]} rounded-xl p-3 flex flex-col gap-2`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/30">{order.id}</span>
                        <span className="text-[10px] text-white/25">{order.time}</span>
                      </div>
                      <p className="text-xs font-medium text-white/70">{order.tableLabel}</p>
                      <div className="space-y-0.5">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-[11px] text-white/50 leading-tight">{item.qty}× {item.name}{item.extras.length > 0 ? ` (+${item.extras.join(", ")})` : ""}</p>
                        ))}
                      </div>
                      {order.note && <p className="text-[10px] text-white/30 italic">"{order.note}"</p>}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-xs font-semibold text-white/60">{brl(order.total)}</span>
                        {STATUS_NEXT[order.status] ? (
                          <button onClick={() => advance(order.id)} className="text-[10px] text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-lg px-2 py-0.5 transition-all">
                            {STATUS_BTN_LABEL[order.status]}
                          </button>
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {colOrders.length === 0 && (
                  <div className="border border-dashed border-white/6 rounded-xl h-14 flex items-center justify-center">
                    <span className="text-[10px] text-white/15">Vazio</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showNew && <NewOrderForm menu={INITIAL_MENU} tables={INITIAL_TABLES} onSubmit={addOrder} onCancel={() => setShowNew(false)} />}
    </div>
  );
}

// ── Cardápio ────────────────────────────────────────────────────────────────

function CardapioView({ menu, setMenu }: { menu: MenuItem[]; setMenu: (m: MenuItem[]) => void }) {
  const [cat, setCat]       = useState("Açaí");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "Açaí" });

  function toggle(id: string) {
    setMenu(menu.map(m => m.id === id ? { ...m, available: !m.available } : m));
  }

  function add() {
    if (!form.name || !form.price) return;
    setMenu([...menu, { id: `custom-${Date.now()}`, name: form.name, price: parseFloat(form.price.replace(",",".")), category: form.category, available: true, extras: [] }]);
    setForm({ name: "", price: "", category: "Açaí" });
    setShowForm(false);
  }

  return (
    <div className="p-5 md:p-7 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-semibold text-white">Cardápio</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
          <Plus className="w-4 h-4" /> Novo item
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white/70">Novo item</p>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/40" /></button>
            </div>
            <div className="flex gap-3 flex-wrap">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nome do item *" className="flex-1 min-w-[160px] bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Preço (R$)" className="w-28 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <DarkSelect value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <DarkOption key={c} value={c}>{c}</DarkOption>)}
              </DarkSelect>
              <button onClick={add} className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-zinc-100 transition-colors">Adicionar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${cat === c ? "bg-white text-black border-white" : "text-white/50 border-white/10 hover:border-white/20"}`}>{c} ({menu.filter(m => m.category === c).length})</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {menu.filter(m => m.category === cat).map(item => (
          <div key={item.id} className={`bg-white/[0.03] border rounded-xl p-4 transition-all ${item.available ? "border-white/8" : "border-white/4 opacity-50"}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="text-sm font-semibold text-white/80">{item.name}</p>
              <button onClick={() => toggle(item.id)} className={`text-[10px] px-2.5 py-0.5 rounded-full border flex-shrink-0 transition-all ${item.available ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-white/30 border-white/10"}`}>
                {item.available ? "Disponível" : "Indisponível"}
              </button>
            </div>
            {item.sizes ? (
              <div className="flex flex-col gap-1">
                {item.sizes.map(s => <p key={s.label} className="text-xs text-white/40">{s.label}: {brl(s.price)}</p>)}
              </div>
            ) : (
              <p className="text-sm font-medium text-white/60">{brl(item.price)}</p>
            )}
            {item.extras && item.extras.length > 0 && (
              <p className="text-[10px] text-white/25 mt-2">{item.extras.length} adicional{item.extras.length !== 1 ? "is" : ""}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mesas ───────────────────────────────────────────────────────────────────

function MesasView({ tables, setTables, orders }: { tables: Table[]; setTables: (t: Table[]) => void; orders: Order[] }) {
  function cycleStatus(id: number) {
    const cycle: TableStatus[] = ["livre", "ocupada", "conta"];
    setTables(tables.map(t => t.id === id ? { ...t, status: cycle[(cycle.indexOf(t.status) + 1) % cycle.length] } : t));
  }

  return (
    <div className="p-5 md:p-7 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-white mb-1">Mesas</h2>
        <div className="flex gap-4 text-xs text-white/40 flex-wrap">
          {(["livre","ocupada","conta"] as TableStatus[]).map(s => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${s === "livre" ? "bg-white/20" : s === "ocupada" ? "bg-amber-400" : "bg-rose-400"}`} />
              {s === "livre" ? "Livre" : s === "ocupada" ? "Ocupada" : "Conta pedida"}
              {" "}({tables.filter(t => t.status === s).length})
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tables.map(t => {
          const tableOrders = orders.filter(o => o.tableLabel === t.label && o.status !== "entregue");
          const tableTotal  = tableOrders.reduce((s, o) => s + o.total, 0);
          return (
            <button key={t.id} onClick={() => cycleStatus(t.id)} className={`border rounded-xl p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${TABLE_STYLE[t.status]}`}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-base font-bold">{t.label}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${TABLE_BADGE[t.status]}`}>
                  {t.status === "livre" ? "Livre" : t.status === "ocupada" ? "Ocupada" : "Conta"}
                </span>
              </div>
              <p className="text-[11px] text-white/30 mb-1">{t.seats} lugares</p>
              {t.status !== "livre" && tableTotal > 0 && (
                <p className="text-sm font-semibold">{brl(tableTotal)}</p>
              )}
              {tableOrders.length > 0 && (
                <p className="text-[10px] text-white/30 mt-1">{tableOrders.length} pedido{tableOrders.length !== 1 ? "s" : ""} em aberto</p>
              )}
              <p className="text-[9px] text-white/15 mt-2">Clique para alterar status</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Relatório ────────────────────────────────────────────────────────────────

function RelatorioView({ orders }: { orders: Order[] }) {
  const delivered  = orders.filter(o => o.status === "entregue");
  const total      = orders.reduce((s, o) => s + o.total, 0);
  const avgTicket  = delivered.length > 0 ? delivered.reduce((s, o) => s + o.total, 0) / delivered.length : 0;

  const byCategory: Record<string, { qty: number; revenue: number }> = {};
  orders.forEach(o => o.items.forEach(i => {
    const menu = INITIAL_MENU.find(m => m.id === i.menuItemId);
    const cat  = menu?.category ?? "Outros";
    if (!byCategory[cat]) byCategory[cat] = { qty: 0, revenue: 0 };
    byCategory[cat].qty     += i.qty;
    byCategory[cat].revenue += i.unitPrice * i.qty;
  }));
  const maxRev = Math.max(...Object.values(byCategory).map(v => v.revenue), 1);

  return (
    <div className="p-5 md:p-7 space-y-6">
      <h2 className="text-base font-semibold text-white">Relatório do dia</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total de pedidos", value: String(orders.length)         },
          { label: "Pedidos entregues", value: String(delivered.length)     },
          { label: "Faturamento total", value: brl(total)                   },
          { label: "Ticket médio",      value: brl(avgTicket)               },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
            <p className="text-xs text-white/40 mb-2">{s.label}</p>
            <p className="text-xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
        <p className="text-sm font-medium text-white/70 mb-4">Receita por categoria</p>
        {Object.entries(byCategory).sort((a, b) => b[1].revenue - a[1].revenue).map(([cat, data]) => (
          <div key={cat} className="flex items-center gap-3 mb-3 last:mb-0">
            <span className="text-xs text-white/50 w-20 flex-shrink-0">{cat}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-white/25 rounded-full transition-all" style={{ width: `${(data.revenue / maxRev) * 100}%` }} />
            </div>
            <span className="text-xs text-white/40 w-20 text-right tabular-nums">{brl(data.revenue)}</span>
            <span className="text-xs text-white/25 w-12 text-right">{data.qty} itens</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  { id: "pedidos",   label: "Pedidos",   icon: ShoppingBag   },
  { id: "cardapio",  label: "Cardápio",  icon: BookOpen      },
  { id: "mesas",     label: "Mesas",     icon: LayoutGrid    },
  { id: "relatorio", label: "Relatório", icon: BarChart2     },
];

export default function Pedidos() {
  const [view, setView]     = useState("pedidos");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menu, setMenu]     = useState<MenuItem[]>(INITIAL_MENU);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);

  const labels: Record<string, string> = { pedidos: "Pedidos", cardapio: "Cardápio", mesas: "Mesas", relatorio: "Relatório do dia" };
  const newCount = orders.filter(o => o.status === "novo").length;

  return (
    <AppShell
      title="Gestão de Pedidos"
      subtitle="Sistema de restaurante"
      appIcon={ShoppingBag}
      navItems={NAV.map(n => ({ ...n, badge: n.id === "pedidos" ? newCount : undefined }))}
      activeView={view}
      onNavigate={setView}
      topBarTitle={labels[view]}
    >
      {view === "pedidos"   && <PedidosView   orders={orders}   setOrders={setOrders} />}
      {view === "cardapio"  && <CardapioView  menu={menu}       setMenu={setMenu}     />}
      {view === "mesas"     && <MesasView     tables={tables}   setTables={setTables} orders={orders} />}
      {view === "relatorio" && <RelatorioView orders={orders}                         />}
    </AppShell>
  );
}

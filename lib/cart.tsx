"use client";

import { toast } from "sonner";
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { useI18n } from "./i18n";
import { CartItem, Book, CartContextType } from "@/types";

const CartCtx = createContext<CartContextType | null>(null);

export { CartCtx };

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { t } = useI18n();
  const isFetched = useRef(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    async function loadCartFromDB() {
      try {
        const res = await fetch("/api/cart", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.items) {
            setItems(data.items);
          }
        } else {
          const localData = localStorage.getItem("sp_cart");
          if (localData) setItems(JSON.parse(localData));
        }
      } catch (err) {
        console.error("Database cart load failed, falling back to local:", err);
        const localData = localStorage.getItem("sp_cart");
        if (localData) setItems(JSON.parse(localData));
      }
    }

    loadCartFromDB();
  }, []);

  const syncWithDatabase = async (updatedItems: CartItem[]) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });
    } catch (error) {
      console.error("Failed to sync cart with database:", error);
    }
    localStorage.setItem("sp_cart", JSON.stringify(updatedItems));
  };

  const add: CartContextType['add'] = (book: Book, qty?: number) => {
    const finalQty = qty ?? 1;
    let alreadyExists = false;

    setItems((prev) => {
      const found = prev.find((x) => x.book_id === book.id);

      if (found) {
        alreadyExists = true;
        return prev;
      }

      const updatedCart = [
        ...prev,
        {
          id: book.id,
          book_id: book.id,
          title: book.title,
          price: book.discount_price || book.price,
          quantity: finalQty,
          cover_image: book.cover_image,
        },
      ];

      syncWithDatabase(updatedCart);
      return updatedCart;
    });

    if (alreadyExists) {
      toast.error(t("already_in_cart"));
    } else {
      toast.success(t("added_to_cart"));
    }
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const updatedCart = prev.filter((x) => x.book_id !== id);
      syncWithDatabase(updatedCart);
      return updatedCart;
    });
  };

  const update = (id: string, qty: number) => {
    setItems((prev) => {
      const updatedCart = prev.map((x) =>
        x.book_id === id
          ? {
            ...x,
            quantity: Math.max(1, qty),
          }
          : x
      );
      syncWithDatabase(updatedCart);
      return updatedCart;
    });
  };

  const clear = () => {
    setItems([]);
    syncWithDatabase([]);
  };

  const subtotal = items.reduce((s, x) => s + x.price * x.quantity, 0);
  const count = items.reduce((s, x) => s + x.quantity, 0);

  return (
    <CartCtx.Provider
      value={{
        items,
        add,
        remove,
        update,
        clear,
        subtotal,
        count,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const context = useContext(CartCtx);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
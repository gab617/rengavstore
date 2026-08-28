import { supabase } from "../services/supabaseClient";

export async function getSucursal(slug) {
  const { data, error } = await supabase.rpc("storefront_get_sucursal", {
    p_slug: slug,
  });
  if (error) throw error;
  return data;
}

export async function getCatalogo(slug) {
  const { data, error } = await supabase.rpc("storefront_get_catalogo", {
    p_slug: slug,
  });
  if (error) throw error;
  return data || [];
}

export function publicUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

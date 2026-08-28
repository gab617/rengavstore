import { useEffect, useState } from "react";
import { getSucursal, getCatalogo } from "../lib/storefront";

export default function useStorefront(slug) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    sucursal: null,
    catalogo: [],
  });

  useEffect(() => {
    let mounted = true;
    setState({ loading: true, error: null, sucursal: null, catalogo: [] });

    Promise.all([getSucursal(slug), getCatalogo(slug)])
      .then(([sucursal, catalogo]) => {
        if (!mounted) return;
        if (sucursal?.error) {
          setState({
            loading: false,
            error: sucursal.error,
            sucursal: null,
            catalogo: [],
          });
        } else {
          setState({
            loading: false,
            error: null,
            sucursal,
            catalogo: catalogo || [],
          });
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setState({
          loading: false,
          error: err.message,
          sucursal: null,
          catalogo: [],
        });
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  return state;
}

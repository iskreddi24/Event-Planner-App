// import React, { useEffect, useMemo, useState } from "react";
// import ProductCard from "./ProductCard";
// import "../../styles/StoreFront.css";
// import axiosClient from "../../utils/axiosClient";
// import { io } from "socket.io-client";
// import Toast from "../../components/common/Toast";
// import { useToast } from "../../hooks/useToast";

// const DEFAULT_LIMIT = 12;
// const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080");

// const StoreFront = () => {
//   const [products, setProducts] = useState([]);
//   const [cats, setCats] = useState([]);
//   const [q, setQ] = useState("");
//   const [category, setCategory] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sort, setSort] = useState("latest");
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const { toast, showToast, hideToast } = useToast();

//   useEffect(() => {
//     axiosClient.get("/store/categories").then((res) => setCats(res.data || []));
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         q: q || undefined,
//         category: category || undefined,
//         minPrice: minPrice || undefined,
//         maxPrice: maxPrice || undefined,
//         sort,
//         page,
//         limit: DEFAULT_LIMIT,
//       };
//       const res = await axiosClient.get("/store/products", { params });
//       setProducts(res.data.items || []);
//       setPages(res.data.pagination?.pages || 1);
//     } catch (e) {
//       console.error("Store fetch error:", e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [q, category, minPrice, maxPrice, sort, page]);

//   useEffect(() => {
//     socket.on("productAdded", (data) => {
//       setProducts((prev) => [data, ...prev]);
//       showToast(`🆕 New Product: ${data.name}`, "success");
//     });

//     socket.on("productUpdated", (data) => {
//       setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
//       showToast(`♻️ Updated: ${data.name}`, "info");
//     });

//     socket.on("productDeleted", ({ id }) => {
//       setProducts((prev) => prev.filter((p) => p._id !== id));
//       showToast("🗑️ Product removed", "error");
//     });

//     return () => {
//       socket.off("productAdded");
//       socket.off("productUpdated");
//       socket.off("productDeleted");
//     };
//   }, []);

//   const resetFilters = () => {
//     setQ("");
//     setCategory("");
//     setMinPrice("");
//     setMaxPrice("");
//     setSort("latest");
//     setPage(1);
//   };

//   const disabledSearch = useMemo(() => loading, [loading]);

//   return (
//     <div className="store-wrap">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

//       <header className="store-hero">
//         <div className="store-hero-inner">
//           <h1>Event Essentials Boutique</h1>
//           <p>Elegant selections curated for dreamy weddings and celebrations.</p>
//         </div>
//       </header>

//       <section className="store-controls">
//         <div className="control-row">
//           <input
//             className="input"
//             placeholder="Search products..."
//             value={q}
//             onChange={(e) => {
//               setQ(e.target.value);
//               setPage(1);
//             }}
//           />
//           <select
//             className="select"
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setPage(1);
//             }}
//           >
//             <option value="">All Categories</option>
//             {cats.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//           <input
//             className="input"
//             type="number"
//             min="0"
//             placeholder="Min ₹"
//             value={minPrice}
//             onChange={(e) => {
//               setMinPrice(e.target.value);
//               setPage(1);
//             }}
//           />
//           <input
//             className="input"
//             type="number"
//             min="0"
//             placeholder="Max ₹"
//             value={maxPrice}
//             onChange={(e) => {
//               setMaxPrice(e.target.value);
//               setPage(1);
//             }}
//           />
//           <select
//             className="select"
//             value={sort}
//             onChange={(e) => {
//               setSort(e.target.value);
//               setPage(1);
//             }}
//           >
//             <option value="latest">Latest</option>
//             <option value="price_asc">Price: Low → High</option>
//             <option value="price_desc">Price: High → Low</option>
//           </select>
//           <button className="btn" onClick={fetchProducts} disabled={disabledSearch}>
//             Search
//           </button>
//           <button className="btn outline" onClick={resetFilters}>
//             Reset
//           </button>
//         </div>
//       </section>

//       <section className="store-grid">
//         {loading ? (
//           <p className="muted">Loading products…</p>
//         ) : products.length === 0 ? (
//           <p className="muted">No products match your filters.</p>
//         ) : (
//           products.map((item) => <ProductCard key={item._id} product={item} />)
//         )}
//       </section>

//       {pages > 1 && (
//         <nav className="pagination">
//           <button className="pg-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
//             Prev
//           </button>
//           <span className="pg-info">
//             Page {page} / {pages}
//           </span>
//           <button className="pg-btn" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
//             Next
//           </button>
//         </nav>
//       )}
//     </div>
//   );
// };

// export default StoreFront;
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import "../../styles/StoreFront.css";
import axiosClient from "../../utils/axiosClient";
import { io } from "socket.io-client";
import Toast from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";

const DEFAULT_LIMIT = 12;
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080");

const StoreFront = () => {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Load categories (auto seed if empty)
  useEffect(() => {
    axiosClient.get("/store/categories").then(async (res) => {
      if (!res.data || res.data.length === 0) {
        await axiosClient.get("/store/seed-categories");
        const reload = await axiosClient.get("/store/categories");
        setCats(reload.data || []);
      } else {
        setCats(res.data);
      }
    });
  }, []);

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        q: q || undefined,
        category: category || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort,
        page,
        limit: DEFAULT_LIMIT,
      };
      const res = await axiosClient.get("/store/products", { params });
      setProducts(res.data.items || []);
      setPages(res.data.pagination?.pages || 1);
    } catch (e) {
      console.error("Store fetch error:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [q, category, minPrice, maxPrice, sort, page]);

  // Real-time updates
  useEffect(() => {
    socket.on("productAdded", (data) => {
      setProducts((prev) => [data, ...prev]);
      showToast(`🆕 New Product: ${data.name}`, "success");
    });

    socket.on("productUpdated", (data) => {
      setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      showToast(`♻️ Updated: ${data.name}`, "info");
    });

    socket.on("productDeleted", ({ id }) => {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("🗑️ Product removed", "error");
    });

    return () => {
      socket.off("productAdded");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, []);

  const resetFilters = () => {
    setQ("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("latest");
    setPage(1);
  };

  const disabledSearch = useMemo(() => loading, [loading]);

  return (
    <div className="store-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <header className="store-hero">
        <div className="store-hero-inner">
          <h1>Event Essentials Boutique</h1>
          <p>Elegant selections curated for dreamy weddings and celebrations.</p>
        </div>
      </header>

      <section className="store-controls">
        <div className="control-row">
          <input
            className="input"
            placeholder="Search products..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {cats.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="select"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
          <button className="btn" onClick={fetchProducts} disabled={disabledSearch}>
            Search
          </button>
          <button className="btn outline" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </section>

      <section className="store-grid">
        {loading ? (
          <p className="muted">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="muted">No products match your filters.</p>
        ) : (
          products.map((item) => <ProductCard key={item._id} product={item} />)
        )}
      </section>

      {pages > 1 && (
        <nav className="pagination">
          <button className="pg-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span className="pg-info">
            Page {page} / {pages}
          </span>
          <button className="pg-btn" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </nav>
      )}
    </div>
  );
};

export default StoreFront;

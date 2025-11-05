// // // // // src/admin/AdminStoreManagement.jsx
// // // // import React, { useEffect, useState } from "react";
// // // // import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// // // // import "../styles/AdminStoreManagement.css";
// // // // import axiosClient from "../utils/axiosClient";

// // // // const AdminStoreManagement = () => {
// // // //   const [products, setProducts] = useState([]);
// // // //   const [cats, setCats] = useState([]);
// // // //   const [form, setForm] = useState({
// // // //     name: "", description: "", price: "", stock: "", image: "", category: ""
// // // //   });
// // // //   const [editingId, setEditingId] = useState(null);

// // // //   const loadAll = async () => {
// // // //     const [p, c] = await Promise.all([
// // // //       axiosClient.get("/store/products", { params: { limit: 100 } }),
// // // //       axiosClient.get("/store/categories"),
// // // //     ]);
// // // //     setProducts(p.data.items || []);
// // // //     setCats(c.data || []);
// // // //   };

// // // //   useEffect(() => { loadAll(); }, []);

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     const payload = { ...form, price: Number(form.price), stock: Number(form.stock) || 0 };
// // // //     if (editingId) {
// // // //       await axiosClient.put(`/store/products/${editingId}`, payload);
// // // //     } else {
// // // //       await axiosClient.post("/store/products", payload);
// // // //     }
// // // //     setForm({ name: "", description: "", price: "", stock: "", image: "", category: "" });
// // // //     setEditingId(null);
// // // //     loadAll();
// // // //   };

// // // //   const handleEdit = (p) => {
// // // //     setEditingId(p._id);
// // // //     setForm({
// // // //       name: p.name, description: p.description, price: p.price, stock: p.stock,
// // // //       image: p.image, category: p?.category?._id || ""
// // // //     });
// // // //   };

// // // //   const handleDelete = async (id) => {
// // // //     if (!window.confirm("Delete product?")) return;
// // // //     await axiosClient.delete(`/store/products/${id}`);
// // // //     loadAll();
// // // //   };

// // // //   return (
// // // //     <div className="admin-store-container">
// // // //       <h2>🛒 Store Management</h2>

// // // //       <form onSubmit={handleSubmit} className="product-form">
// // // //         <input name="name" placeholder="Product Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
// // // //         <input name="image" placeholder="Image URL" value={form.image} onChange={(e)=>setForm({...form, image: e.target.value})} required />
// // // //         <select value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})}>
// // // //           <option value="">Select Category</option>
// // // //           {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
// // // //         </select>
// // // //         <input name="description" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} required />
// // // //         <input type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} required />
// // // //         <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={(e)=>setForm({...form, stock: e.target.value})} />
// // // //         <button type="submit" className="add-btn">
// // // //           {editingId ? "Update Product" : "Add Product"} <FaPlus />
// // // //         </button>
// // // //       </form>

// // // //       <div className="product-list">
// // // //         {products.length === 0 ? (
// // // //           <p className="no-products">No products.</p>
// // // //         ) : (
// // // //           products.map((p) => (
// // // //             <div key={p._id} className="product-card">
// // // //               <img src={p.image} alt={p.name} />
// // // //               <h4>{p.name}</h4>
// // // //               <p className="muted">{p?.category?.name || "Uncategorized"}</p>
// // // //               <p>{p.description}</p>
// // // //               <p className="price">₹{p.price}</p>
// // // //               <div className="actions">
// // // //                 <button className="edit-btn" onClick={() => handleEdit(p)}><FaEdit /></button>
// // // //                 <button className="delete-btn" onClick={() => handleDelete(p._id)}><FaTrash /></button>
// // // //               </div>
// // // //             </div>
// // // //           ))
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AdminStoreManagement;
// // // const { toast, showToast, hideToast } = useToast();
// // // import Toast from "../components/common/Toast";
// // // import { useToast } from "../hooks/useToast";
// // // import React, { useEffect, useState } from "react";
// // // import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// // // import "../styles/AdminStoreManagement.css";
// // // import axiosClient from "../utils/axiosClient";
// // // import { io } from "socket.io-client";

// // // const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080");

// // // const AdminStoreManagement = () => {
// // //   const [products, setProducts] = useState([]);
// // //   const [cats, setCats] = useState([]);
// // //   const [form, setForm] = useState({
// // //     name: "",
// // //     description: "",
// // //     price: "",
// // //     stock: "",
// // //     image: "",
// // //     category: "",
// // //   });
// // //   const [editingId, setEditingId] = useState(null);
// // //   const [toast, setToast] = useState(null);

// // //   const showToast = (msg, type = "success") => {
// // //     setToast({ msg, type });
// // //     setTimeout(() => setToast(null), 4000);
// // //   };

// // //   const loadAll = async () => {
// // //     const [p, c] = await Promise.all([
// // //       axiosClient.get("/store/products", { params: { limit: 100 } }),
// // //       axiosClient.get("/store/categories"),
// // //     ]);
// // //     setProducts(p.data.items || []);
// // //     setCats(c.data || []);
// // //   };

// // //   useEffect(() => {
// // //     loadAll();

// // //     socket.on("productAdded", (data) => {
// // //       setProducts((prev) => [data, ...prev]);
// // //       showToast(`🆕 Product added: ${data.name}`);
// // //     });

// // //     socket.on("productUpdated", (data) => {
// // //       setProducts((prev) =>
// // //         prev.map((p) => (p._id === data._id ? data : p))
// // //       );
// // //       showToast(`♻️ Product updated: ${data.name}`);
// // //     });

// // //     socket.on("productDeleted", ({ id }) => {
// // //       setProducts((prev) => prev.filter((p) => p._id !== id));
// // //       showToast("🗑️ Product deleted");
// // //     });

// // //     return () => {
// // //       socket.off("productAdded");
// // //       socket.off("productUpdated");
// // //       socket.off("productDeleted");
// // //     };
// // //   }, []);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     const payload = {
// // //       ...form,
// // //       price: Number(form.price),
// // //       stock: Number(form.stock) || 0,
// // //     };

// // //     try {
// // //       let res;
// // //       if (editingId) {
// // //         res = await axiosClient.put(`/store/products/${editingId}`, payload);
// // //         socket.emit("productUpdated", res.data.data);
// // //         showToast("✅ Product updated!");
// // //       } else {
// // //         res = await axiosClient.post("/store/products", payload);
// // //         socket.emit("productAdded", res.data.data);
// // //         showToast("🆕 Product added!", "success");
// // //       }
// // //       setForm({ name: "", description: "", price: "", stock: "", image: "", category: "" });
// // //       setEditingId(null);
// // //     } catch (err) {
// // //       showToast("❌ Error saving product", "error");
// // //     }
// // //   };

// // //   const handleEdit = (p) => {
// // //     setEditingId(p._id);
// // //     setForm({
// // //       name: p.name,
// // //       description: p.description,
// // //       price: p.price,
// // //       stock: p.stock,
// // //       image: p.image,
// // //       category: p?.category?._id || "",
// // //     });
// // //   };

// // //   const handleDelete = async (id) => {
// // //     if (!window.confirm("Delete product?")) return;
// // //     await axiosClient.delete(`/store/products/${id}`);
// // //     socket.emit("productDeleted", { id });
// // //     showToast("🗑️ Product deleted");
// // //   };

// // //   return (
// // //     <div className="admin-store-container">
// // //       {toast && (
// // //         <div
// // //           className={`toast ${toast.type}`}
// // //           style={{
// // //             position: "fixed",
// // //             top: "20px",
// // //             right: "25px",
// // //             background: toast.type === "error" ? "#e74c3c" : "#2ecc71",
// // //             color: "#fff",
// // //             padding: "12px 18px",
// // //             borderRadius: "8px",
// // //             boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
// // //             fontWeight: "600",
// // //             zIndex: 9999,
// // //           }}
// // //         >
// // //           {toast.msg}
// // //         </div>
// // //       )}

// // //       <h2>🛒 Store Management</h2>

// // //       <form onSubmit={handleSubmit} className="product-form">
// // //         <input name="name" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
// // //         <input name="image" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
// // //         <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
// // //           <option value="">Select Category</option>
// // //           {cats.map((c) => (
// // //             <option key={c._id} value={c._id}>{c.name}</option>
// // //           ))}
// // //         </select>
// // //         <input name="description" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
// // //         <input type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
// // //         <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
// // //         <button type="submit" className="add-btn">
// // //           {editingId ? "Update Product" : "Add Product"} <FaPlus />
// // //         </button>
// // //       </form>

// // //       <div className="product-list">
// // //         {products.length === 0 ? (
// // //           <p className="no-products">No products.</p>
// // //         ) : (
// // //           products.map((p) => (
// // //             <div key={p._id} className="product-card">
// // //               <img src={p.image} alt={p.name} />
// // //               <h4>{p.name}</h4>
// // //               <p className="muted">{p?.category?.name || "Uncategorized"}</p>
// // //               <p>{p.description}</p>
// // //               <p className="price">₹{p.price}</p>
// // //               <div className="actions">
// // //                 <button className="edit-btn" onClick={() => handleEdit(p)}>
// // //                   <FaEdit />
// // //                 </button>
// // //                 <button className="delete-btn" onClick={() => handleDelete(p._id)}>
// // //                   <FaTrash />
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           ))
// // //         )}
// // //       </div>
// // //     </div>

// // //   );
// // //   {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
// // // };

// // // export default AdminStoreManagement;
// // import React, { useEffect, useState } from "react";
// // import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// // import "../styles/AdminStoreManagement.css";
// // import axiosClient from "../utils/axiosClient";
// // import { io } from "socket.io-client";
// // import Toast from "../components/common/Toast";
// // import { useToast } from "../hooks/useToast";

// // const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080");

// // const AdminStoreManagement = () => {
// //   const [products, setProducts] = useState([]);
// //   const [cats, setCats] = useState([]);
// //   const [form, setForm] = useState({
// //     name: "",
// //     description: "",
// //     price: "",
// //     stock: "",
// //     image: "",
// //     category: "",
// //   });
// //   const [editingId, setEditingId] = useState(null);

// //   // ✅ Use reusable Toast hook
// //   const { toast, showToast, hideToast } = useToast();

// //   const loadAll = async () => {
// //     const [p, c] = await Promise.all([
// //       axiosClient.get("/store/products", { params: { limit: 100 } }),
// //       axiosClient.get("/store/categories"),
// //     ]);
// //     setProducts(p.data.items || []);
// //     setCats(c.data || []);
// //   };

// //   useEffect(() => {
// //     loadAll();

// //     socket.on("productAdded", (data) => {
// //       setProducts((prev) => [data, ...prev]);
// //       showToast(`🆕 Product added: ${data.name}`, "success");
// //     });

// //     socket.on("productUpdated", (data) => {
// //       setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
// //       showToast(`♻️ Product updated: ${data.name}`, "info");
// //     });

// //     socket.on("productDeleted", ({ id }) => {
// //       setProducts((prev) => prev.filter((p) => p._id !== id));
// //       showToast("🗑️ Product deleted", "error");
// //     });

// //     return () => {
// //       socket.off("productAdded");
// //       socket.off("productUpdated");
// //       socket.off("productDeleted");
// //     };
// //   }, []);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const payload = {
// //       ...form,
// //       price: Number(form.price),
// //       stock: Number(form.stock) || 0,
// //     };

// //     try {
// //       let res;
// //       if (editingId) {
// //         res = await axiosClient.put(`/store/products/${editingId}`, payload);
// //         socket.emit("productUpdated", res.data.data);
// //         showToast("✅ Product updated!", "success");
// //       } else {
// //         res = await axiosClient.post("/store/products", payload);
// //         socket.emit("productAdded", res.data.data);
// //         showToast("🆕 Product added!", "success");
// //       }
// //       setForm({ name: "", description: "", price: "", stock: "", image: "", category: "" });
// //       setEditingId(null);
// //     } catch (err) {
// //       showToast("❌ Error saving product", "error");
// //     }
// //   };

// //   const handleEdit = (p) => {
// //     setEditingId(p._id);
// //     setForm({
// //       name: p.name,
// //       description: p.description,
// //       price: p.price,
// //       stock: p.stock,
// //       image: p.image,
// //       category: p?.category?._id || "",
// //     });
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Delete product?")) return;
// //     await axiosClient.delete(`/store/products/${id}`);
// //     socket.emit("productDeleted", { id });
// //     showToast("🗑️ Product deleted", "error");
// //   };

// //   return (
// //     <div className="admin-store-container">
// //       {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

// //       <h2>🛒 Store Management</h2>
// //       <button
// //         className="refresh-btn"
// //         onClick={async () => {
// //           await axiosClient.get("/store/seed-categories");
// //           showToast(" Default categories loaded!", "success");
// //           loadAll();
// //         }}
// //       >
// //         Load Default Categories
// //       </button>

// //       <form onSubmit={handleSubmit} className="product-form">
// //         <input name="name" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
// //         <input name="image" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
// //         <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
// //           <option value="">Select Category</option>
// //           {cats.map((c) => (
// //             <option key={c._id} value={c._id}>
// //               {c.name}
// //             </option>
// //           ))}
// //         </select>
// //         <input name="description" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
// //         <input type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
// //         <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
// //         <button type="submit" className="add-btn">
// //           {editingId ? "Update Product" : "Add Product"} <FaPlus />
// //         </button>
// //       </form>

// //       <div className="product-list">
// //         {products.length === 0 ? (
// //           <p className="no-products">No products.</p>
// //         ) : (
// //           products.map((p) => (
// //             <div key={p._id} className="product-card">
// //               <img src={p.image} alt={p.name} />
// //               <h4>{p.name}</h4>
// //               <p className="muted">{p?.category?.name || "Uncategorized"}</p>
// //               <p>{p.description}</p>
// //               <p className="price">₹{p.price}</p>
// //               <div className="actions">
// //                 <button className="edit-btn" onClick={() => handleEdit(p)}>
// //                   <FaEdit />
// //                 </button>
// //                 <button className="delete-btn" onClick={() => handleDelete(p._id)}>
// //                   <FaTrash />
// //                 </button>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminStoreManagement;
// import React, { useEffect, useState } from "react";
// import { FaEdit, FaTrash, FaPlus, FaSync } from "react-icons/fa";
// import "../styles/AdminStoreManagement.css";
// import axiosClient from "../utils/axiosClient";
// import { io } from "socket.io-client";
// import Toast from "../components/common/Toast";
// import { useToast } from "../hooks/useToast";

// const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080");

// const AdminStoreManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [cats, setCats] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     image: "",
//     category: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const { toast, showToast, hideToast } = useToast();

//   // Load products + categories
//   const loadAll = async () => {
//     const [p, c] = await Promise.all([
//       axiosClient.get("/store/products", { params: { limit: 100 } }),
//       axiosClient.get("/store/categories"),
//     ]);
//     setProducts(p.data.items || []);
//     setCats(c.data || []);
//   };

//   useEffect(() => {
//     loadAll();

//     socket.on("productAdded", (data) => {
//       setProducts((prev) => [data, ...prev]);
//       showToast(`🆕 Product added: ${data.name}`, "success");
//     });

//     socket.on("productUpdated", (data) => {
//       setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
//       showToast(`♻️ Product updated: ${data.name}`, "info");
//     });

//     socket.on("productDeleted", ({ id }) => {
//       setProducts((prev) => prev.filter((p) => p._id !== id));
//       showToast("🗑️ Product deleted", "error");
//     });

//     return () => {
//       socket.off("productAdded");
//       socket.off("productUpdated");
//       socket.off("productDeleted");
//     };
//   }, []);

//   // Add or Update product
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...form,
//       price: Number(form.price),
//       stock: Number(form.stock) || 0,
//     };

//     try {
//       let res;
//       if (editingId) {
//         res = await axiosClient.put(`/store/products/${editingId}`, payload);
//         socket.emit("productUpdated", res.data.data);
//         showToast("✅ Product updated!", "success");
//       } else {
//         res = await axiosClient.post("/store/products", payload);
//         socket.emit("productAdded", res.data.data);
//         showToast("🆕 Product added!", "success");
//       }
//       setForm({ name: "", description: "", price: "", stock: "", image: "", category: "" });
//       setEditingId(null);
//     } catch (err) {
//       showToast("❌ Error saving product", "error");
//     }
//   };

//   const handleEdit = (p) => {
//     setEditingId(p._id);
//     setForm({
//       name: p.name,
//       description: p.description,
//       price: p.price,
//       stock: p.stock,
//       image: p.image,
//       category: p?.category?._id || "",
//     });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete product?")) return;
//     await axiosClient.delete(`/store/products/${id}`);
//     socket.emit("productDeleted", { id });
//     showToast("🗑️ Product deleted", "error");
//   };

//   // 🧩 Auto-seed new default categories
//   const handleSeedCategories = async () => {
//     await axiosClient.get("/store/seed-categories");
//     showToast("✅ Default categories loaded!", "success");
//     loadAll();
//   };

//   return (
//     <div className="admin-store-container">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

//       <h2>🛒 Store Management</h2>

//       <button className="refresh-btn" onClick={handleSeedCategories}>
//         <FaSync /> Load Default Categories
//       </button>

//       <form onSubmit={handleSubmit} className="product-form">
//         <input
//           name="name"
//           placeholder="Product Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         />
//         <input
//           name="image"
//           placeholder="Image URL"
//           value={form.image}
//           onChange={(e) => setForm({ ...form, image: e.target.value })}
//           required
//         />
//         <select
//           value={form.category}
//           onChange={(e) => setForm({ ...form, category: e.target.value })}
//         >
//           <option value="">Select Category</option>
//           {cats.map((c) => (
//             <option key={c._id} value={c._id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//         <input
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//           required
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder="Price (₹)"
//           value={form.price}
//           onChange={(e) => setForm({ ...form, price: e.target.value })}
//           required
//         />
//         <input
//           type="number"
//           name="stock"
//           placeholder="Stock"
//           value={form.stock}
//           onChange={(e) => setForm({ ...form, stock: e.target.value })}
//         />
//         <button type="submit" className="add-btn">
//           {editingId ? "Update Product" : "Add Product"} <FaPlus />
//         </button>
//       </form>

//       <div className="product-list">
//         {products.length === 0 ? (
//           <p className="no-products">No products.</p>
//         ) : (
//           products.map((p) => (
//             <div key={p._id} className="product-card">
//               <img src={p.image} alt={p.name} />
//               <h4>{p.name}</h4>
//               <p className="muted">{p?.category?.name || "Uncategorized"}</p>
//               <p>{p.description}</p>
//               <p className="price">₹{p.price}</p>
//               <div className="actions">
//                 <button className="edit-btn" onClick={() => handleEdit(p)}>
//                   <FaEdit />
//                 </button>
//                 <button className="delete-btn" onClick={() => handleDelete(p._id)}>
//                   <FaTrash />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminStoreManagement;
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTags } from "react-icons/fa";
import "../styles/AdminStoreManagement.css";
import axiosClient from "../utils/axiosClient";
import { io } from "socket.io-client";
import Toast from "../components/common/Toast";
import { useToast } from "../hooks/useToast";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080");

const AdminStoreManagement = () => {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 🧩 Category Management
  const [categoryName, setCategoryName] = useState("");
  const [editCatId, setEditCatId] = useState(null);

  // Toasts
  const { toast, showToast, hideToast } = useToast();

  // Load products + categories
  const loadAll = async () => {
    const [p, c] = await Promise.all([
      axiosClient.get("/store/products", { params: { limit: 100 } }),
      axiosClient.get("/store/categories"),
    ]);
    setProducts(p.data.items || []);
    setCats(c.data || []);
  };

  useEffect(() => {
    loadAll();

    socket.on("productAdded", (data) => {
      setProducts((prev) => [data, ...prev]);
      showToast(`🆕 Product added: ${data.name}`, "success");
    });

    socket.on("productUpdated", (data) => {
      setProducts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      showToast(`♻️ Product updated: ${data.name}`, "info");
    });

    socket.on("productDeleted", ({ id }) => {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("🗑️ Product deleted", "error");
    });

    return () => {
      socket.off("productAdded");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, []);

  // Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
    };

    try {
      let res;
      if (editingId) {
        res = await axiosClient.put(`/store/products/${editingId}`, payload);
        socket.emit("productUpdated", res.data.data);
        showToast("✅ Product updated!", "success");
      } else {
        res = await axiosClient.post("/store/products", payload);
        socket.emit("productAdded", res.data.data);
        showToast("🆕 Product added!", "success");
      }
      setForm({ name: "", description: "", price: "", stock: "", image: "", category: "" });
      setEditingId(null);
    } catch (err) {
      showToast("❌ Error saving product", "error");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      image: p.image,
      category: p?.category?._id || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await axiosClient.delete(`/store/products/${id}`);
    socket.emit("productDeleted", { id });
    showToast("🗑️ Product deleted", "error");
  };

  // 🧩 Category Management Handlers
  const handleCategorySave = async () => {
    try {
      if (!categoryName.trim()) return showToast("⚠️ Category name required!", "error");

      if (editCatId) {
        await axiosClient.put(`/store/categories/${editCatId}`, { name: categoryName });
        showToast("♻️ Category updated!", "success");
        setEditCatId(null);
      } else {
        await axiosClient.post(`/store/categories`, { name: categoryName });
        showToast("🆕 Category added!", "success");
      }

      setCategoryName("");
      loadAll();
    } catch (err) {
      showToast("❌ Error saving category", "error");
    }
  };

  const handleCategoryEdit = (cat) => {
    setCategoryName(cat.name);
    setEditCatId(cat._id);
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await axiosClient.delete(`/store/categories/${id}`);
    showToast("🗑️ Category deleted", "error");
    loadAll();
  };

  return (
    <div className="admin-store-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h2>🛒 Store Management</h2>

      {/* ========================== CATEGORY MANAGEMENT ========================== */}
      <div className="category-section">
        <h3><FaTags /> Category Management</h3>
        <div className="category-form">
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button className="add-btn" onClick={handleCategorySave}>
            {editCatId ? "Update Category" : "Add Category"} <FaPlus />
          </button>
        </div>

        <div className="category-list">
          {cats.length === 0 ? (
            <p className="muted">No categories found.</p>
          ) : (
            cats.map((cat) => (
              <div key={cat._id} className="category-item">
                <span>{cat.name}</span>
                <div className="cat-actions">
                  <button className="edit-btn" onClick={() => handleCategoryEdit(cat)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => handleCategoryDelete(cat._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================== PRODUCT MANAGEMENT ========================== */}
      <form onSubmit={handleSubmit} className="product-form">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {cats.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <button type="submit" className="add-btn">
          {editingId ? "Update Product" : "Add Product"} <FaPlus />
        </button>
      </form>

      <div className="product-list">
        {products.length === 0 ? (
          <p className="no-products">No products.</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="product-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p className="muted">{p?.category?.name || "Uncategorized"}</p>
              <p>{p.description}</p>
              <p className="price">₹{p.price}</p>
              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStoreManagement;

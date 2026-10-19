import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { deleteProduct } from '../api/productApi';
import { toast } from 'react-toastify';
import { getAllOrders } from '../api/orderApi';

const AdminDashboard = () => {
  const { products, retry } = useProducts();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted');
        retry(); // Reload products
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/products/add"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-ink-800 p-6 rounded-xl shadow border border-ink-200 dark:border-ink-700">
          <h3 className="text-lg font-bold mb-2">Total Products</h3>
          <p className="text-3xl font-display text-brand-600">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-ink-800 p-6 rounded-xl shadow border border-ink-200 dark:border-ink-700">
          <h3 className="text-lg font-bold mb-2">Total Orders</h3>
          <p className="text-3xl font-display text-brand-600">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-ink-800 p-6 rounded-xl shadow border border-ink-200 dark:border-ink-700">
          <h3 className="text-lg font-bold mb-2">Total Revenue</h3>
          <p className="text-3xl font-display text-brand-600">
            ${orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-display font-bold mb-6">Manage Products</h2>
      <div className="bg-white dark:bg-ink-800 rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50 dark:bg-ink-900 border-b border-ink-200 dark:border-ink-700">
              <th className="p-4 font-bold">Product</th>
              <th className="p-4 font-bold">Price</th>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b border-ink-200 dark:border-ink-700">
                <td className="p-4 flex items-center space-x-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <span>{product.name}</span>
                </td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 space-x-3">
                  <Link to={`/admin/products/edit/${product._id}`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

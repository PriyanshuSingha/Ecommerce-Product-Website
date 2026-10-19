import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/productApi';
import { toast } from 'react-toastify';
import { useProducts } from '../context/ProductContext';

const AddProduct = () => {
  const navigate = useNavigate();
  const { retry } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    stock: '',
    image: '',
    couponCode: '',
    discountType: 'percentage',
    discountValue: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        discount: Number(formData.discount) || 0,
        stock: Number(formData.stock) || 0,
        image: formData.image, // URL from direct input or a generic ImageKit upload component logic
        coupon: formData.couponCode ? {
          code: formData.couponCode,
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue)
        } : null
      };

      await createProduct(payload);
      toast.success('Product created successfully');
      retry();
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-display font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-ink-800 p-8 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input required type="text" name="name" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input required type="text" name="category" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <input required type="number" name="price" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock Quantity</label>
            <input required type="number" name="stock" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div>
             <label className="block text-sm font-medium mb-2">Discount (%)</label>
             <input type="number" name="discount" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea required name="description" rows="4" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Image URL (ImageKit URL)</label>
            <input required type="text" name="image" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>

          <div className="md:col-span-2 p-4 bg-ink-50 dark:bg-ink-900 rounded-lg">
             <h3 className="font-bold mb-4">Coupon Configuration (Optional)</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Coupon Code</label>
                  <input type="text" name="couponCode" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select name="discountType" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Discount Value</label>
                  <input type="number" name="discountValue" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
                </div>
             </div>
          </div>
        </div>
        <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

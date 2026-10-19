import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, fetchProductById } from '../api/productApi';
import { toast } from 'react-toastify';
import { useProducts } from '../context/ProductContext';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { retry } = useProducts();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductById(id);
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          discount: product.discount || '',
          stock: product.stock,
          image: product.image || '',
          couponCode: product.coupon?.code || '',
          discountType: product.coupon?.discountType || 'percentage',
          discountValue: product.coupon?.discountValue || ''
        });
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

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
        image: formData.image,
        coupon: formData.couponCode ? {
          code: formData.couponCode,
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue)
        } : null
      };

      await updateProduct(id, payload);
      toast.success('Product updated successfully');
      retry();
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-display font-bold mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-ink-800 p-8 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input required type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock Quantity</label>
            <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div>
             <label className="block text-sm font-medium mb-2">Discount (%)</label>
             <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea required name="description" value={formData.description} rows="4" onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Image URL (ImageKit URL)</label>
            <input required type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
          </div>

          <div className="md:col-span-2 p-4 bg-ink-50 dark:bg-ink-900 rounded-lg">
             <h3 className="font-bold mb-4">Coupon Configuration (Optional)</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Coupon Code</label>
                  <input type="text" name="couponCode" value={formData.couponCode} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Discount Value</label>
                  <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} className="w-full p-3 rounded-lg border dark:bg-canvas-dark dark:border-ink-600" />
                </div>
             </div>
          </div>
        </div>
        <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

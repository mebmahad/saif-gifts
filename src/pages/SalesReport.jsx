import React, { useState, useEffect } from 'react';
import service from '../appwrite/config';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesReport() {
  const [reportType, setReportType] = useState('products');
  const [orders, setOrders] = useState([]);
  const [productStats, setProductStats] = useState([]);
  const [customerStats, setCustomerStats] = useState([]);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      if (reportType === 'products') {
        calculateProductStats();
      } else {
        calculateCustomerStats();
      }
    }
  }, [orders, reportType]);

  const fetchOrders = async () => {
    try {
      const response = await service.getAllOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateProductStats = () => {
    const stats = {};
    if (!orders || !Array.isArray(orders)) {
      setProductStats([]);
      return;
    }

    orders.forEach(order => {
      if (!order || !order.products) return;
      let products;
      try {
        products = typeof order.products === 'string' ? JSON.parse(order.products) : order.products;
        if (!Array.isArray(products)) return;
      } catch (error) {
        console.error('Error parsing products:', error);
        return;
      }
      products.forEach(product => {
        if (!product || typeof product !== 'object' || !product.name) return;
        
        if (!stats[product.name]) {
          stats[product.name] = {
            totalSales: 0,
            quantity: 0,
            revenue: 0,
            purchasePrice: product.purchasePrice || 0,
            profit: 0
          };
        }
        const quantity = Number(product.quantity) || 0;
        const price = Number(product.price) || 0;
        const purchasePrice = Number(product.purchasePrice) || 0;
        
        stats[product.name].quantity += quantity;
        stats[product.name].revenue += price * quantity;
        stats[product.name].profit += (price - purchasePrice) * quantity;
        stats[product.name].totalSales += 1;
      });
    });
    setProductStats(Object.entries(stats).map(([name, data]) => ({ name, ...data })));
  };

  const calculateCustomerStats = () => {
    const stats = {};
    if (!orders || !Array.isArray(orders)) {
      setCustomerStats([]);
      return;
    }

    orders.forEach(order => {
      if (!order || !order.shippingDetails || !order.total) return;
      
      let shippingDetails;
      try {
        shippingDetails = typeof order.shippingDetails === 'string' 
          ? JSON.parse(order.shippingDetails) 
          : order.shippingDetails;
      } catch (error) {
        console.error('Error parsing shipping details:', error);
        return;
      }

      if (!shippingDetails || !shippingDetails.fullName) return;
      const customer = shippingDetails.fullName;

      if (!stats[customer]) {
        stats[customer] = {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0
        };
      }
      
      const total = Number(order.total) || 0;
      stats[customer].totalOrders += 1;
      stats[customer].totalSpent += total;
      stats[customer].averageOrderValue = stats[customer].totalSpent / stats[customer].totalOrders;
    });
    setCustomerStats(Object.entries(stats).map(([name, data]) => ({ name, ...data })));

  };

  const productChartData = {
    labels: productStats.map(product => product.name),
    datasets: [
      {
        label: 'Revenue',
        data: productStats.map(product => product.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      },
      {
        label: 'Profit',
        data: productStats.map(product => product.profit),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  };

  const customerChartData = {
    labels: customerStats.map(customer => customer.name),
    datasets: [
      {
        label: 'Total Spent',
        data: customerStats.map(customer => customer.totalSpent),
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Sales Reports</h1>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${reportType === 'products' ? 'bg-gift-primary text-white' : 'bg-gray-200'}`}
          onClick={() => setReportType('products')}
        >
          Product-based Report
        </button>
        <button
          className={`px-4 py-2 rounded ${reportType === 'customers' ? 'bg-gift-primary text-white' : 'bg-gray-200'}`}
          onClick={() => setReportType('customers')}
        >
          Customer-based Report
        </button>
      </div>

      {reportType === 'products' ? (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Product Performance</h2>
            <div className="h-96">
              <Line data={productChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-right">Quantity Sold</th>
                  <th className="text-right">Total Sales</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Purchase Price</th>
                  <th className="text-right">Profit</th>
                </tr>
              </thead>
              <tbody>
                {productStats.map((product) => (
                  <tr key={product.name} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td className="text-right">{product.quantity}</td>
                    <td className="text-right">{product.totalSales}</td>
                    <td className="text-right">Rs. {product.revenue.toFixed(2)}</td>
                    <td className="text-right">Rs. {product.purchasePrice.toFixed(2)}</td>
                    <td className="text-right">Rs. {product.profit.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Customer Spending</h2>
            <div className="h-96">
              <Bar data={customerChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Customer</th>
                  <th className="text-right">Total Orders</th>
                  <th className="text-right">Total Spent</th>
                  <th className="text-right">Average Order Value</th>
                </tr>
              </thead>
              <tbody>
                {customerStats.map((customer) => (
                  <tr key={customer.name} className="border-b">
                    <td className="py-2">{customer.name}</td>
                    <td className="text-right">{customer.totalOrders}</td>
                    <td className="text-right">Rs. {customer.totalSpent.toFixed(2)}</td>
                    <td className="text-right">Rs. {customer.averageOrderValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
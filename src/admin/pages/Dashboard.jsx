import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Package, Tag, Layers, Star } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-gray-600" />
        </div>
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState({ products: [], categories: [], sets: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories(), api.getSets()])
      .then(([products, categories, sets]) => setData({ products, categories, sets }))
      .finally(() => setLoading(false))
  }, [])

  const bestsellers = data.products.filter(p => p.bestseller).length
  const newArrivals = data.products.filter(p => p.newArrival).length

  if (loading) return <div className="p-8 text-gray-400 text-sm">Đang tải...</div>

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Tổng quan</h1>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Sản phẩm" value={data.products.length} sub={`${bestsellers} bán chạy · ${newArrivals} mới`} />
        <StatCard icon={Tag} label="Danh mục" value={data.categories.length} />
        <StatCard icon={Layers} label="Set sản phẩm" value={data.sets.length} />
        <StatCard icon={Star} label="Bán chạy" value={bestsellers} sub="sản phẩm bestseller" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Sản phẩm gần đây</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-5 py-3 text-left">Tên</th>
              <th className="px-5 py-3 text-left">Danh mục</th>
              <th className="px-5 py-3 text-right">Giá</th>
              <th className="px-5 py-3 text-left">Badge</th>
            </tr>
          </thead>
          <tbody>
            {data.products.slice(0, 8).map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-5 py-3 text-gray-500">{p.categoryId}</td>
                <td className="px-5 py-3 text-right text-gray-700">
                  {p.price.toLocaleString('vi-VN')}₫
                </td>
                <td className="px-5 py-3">
                  {p.badge && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{p.badge}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

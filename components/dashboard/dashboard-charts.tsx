'use client'

import { ChartDataPoint } from '@/lib/types'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardChartsProps {
  transaksiData: ChartDataPoint[]
  vendorGrowthData: ChartDataPoint[]
}

const COLORS = ['#815252', '#635d59', '#735c00', '#c28b8b', '#cca72f', '#e7ded9']

export function DashboardCharts({ transaksiData, vendorGrowthData }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      {/* Transaction Chart */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-elevated">
        <div className="mb-6">
          <h3 className="font-heading text-label-md font-semibold text-on-surface uppercase mb-2">
            Transaksi Bulanan
          </h3>
          <p className="text-label-sm text-on-surface-variant">
            Trend transaksi 12 bulan terakhir
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={transaksiData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d5c2c1" />
            <XAxis dataKey="name" stroke="#514443" style={{ fontSize: '12px' }} />
            <YAxis stroke="#514443" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d5c2c1',
                borderRadius: '8px',
              }}
              cursor={{ stroke: '#815252', strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#815252"
              strokeWidth={2}
              dot={{ fill: '#815252', r: 4 }}
              activeDot={{ r: 6 }}
              name="Transaksi"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Vendor Growth Chart */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-elevated">
        <div className="mb-6">
          <h3 className="font-heading text-label-md font-semibold text-on-surface uppercase mb-2">
            Pertumbuhan Vendor
          </h3>
          <p className="text-label-sm text-on-surface-variant">
            Vendor berdasarkan kategori
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={vendorGrowthData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {vendorGrowthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d5c2c1',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';
import { useDataFetch } from '../../hooks/useDataFetch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CBKHistory() {
  const { data, loading } = useDataFetch('cbk-history.json');

  if (loading) {
    return (
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 w-48 bg-white/5 rounded mb-8" />
          <div className="h-96 w-full bg-white/5 rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <>
      <SEOHead
        title="CBK Rate History & Inflation Trends Kenya - MoneyIQ"
        description="Track the Central Bank Rate (CBR) and inflation trends in Kenya. Understand how monetary policy affects your loans and savings."
        keywords="CBR history Kenya, inflation rates Kenya, central bank rate history, monetary policy Kenya"
        canonical="/compare/cbk-history"
      />

      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-light-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-light-50 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-light-50 transition-colors">Compare Rates</Link>
            <span>/</span>
            <span className="text-light-50">CBK History</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-light-50 mb-3">
              Monetary Policy <span className="gradient-text">Trends</span>
            </h1>
            <p className="text-lg text-light-400 max-w-2xl">
              Monitor how the Central Bank Rate (CBR) and Inflation have changed over time. 
              These two metrics are the primary drivers of bank interest rates in Kenya.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Chart Card */}
            <div className="glass-card p-6 lg:p-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="text-xl font-bold text-light-50">CBR vs. Inflation (2023-2025)</h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-2 text-primary">
                    <div className="w-3 h-3 rounded-full bg-primary" /> CBR
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <div className="w-3 h-3 rounded-full bg-secondary" /> Inflation
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{fill: '#94A3B8', fontSize: 12}} 
                      axisLine={{stroke: 'rgba(255,255,255,0.1)'}}
                    />
                    <YAxis 
                      tick={{fill: '#94A3B8', fontSize: 12}} 
                      tickFormatter={(v) => `${v}%`}
                      axisLine={{stroke: 'rgba(255,255,255,0.1)'}}
                    />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                      itemStyle={{fontSize: '12px'}}
                      formatter={(v) => [`${v}%`, '']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cbr" 
                      stroke="#0A6E3D" 
                      strokeWidth={3} 
                      dot={{fill: '#0A6E3D', strokeWidth: 2, r: 4}} 
                      activeDot={{r: 6, strokeWidth: 0}}
                      name="Central Bank Rate"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inflation" 
                      stroke="#FFB800" 
                      strokeWidth={3} 
                      dot={{fill: '#FFB800', strokeWidth: 2, r: 4}}
                      activeDot={{r: 6, strokeWidth: 0}}
                      name="Inflation Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-6 lg:p-8">
                <h4 className="text-lg font-bold text-light-50 mb-4 flex items-center gap-2">
                  <span className="text-primary text-2xl">🏦</span> Understanding CBR
                </h4>
                <p className="text-sm text-light-400 leading-relaxed">
                  The Central Bank Rate (CBR) is the lowest rate the CBK charges on loans to banks. 
                  When CBR goes up, banks usually increase their lending rates (loans become expensive). 
                  When it goes down, loans should ideally become cheaper.
                </p>
              </div>
              <div className="glass-card p-6 lg:p-8">
                <h4 className="text-lg font-bold text-light-50 mb-4 flex items-center gap-2">
                  <span className="text-secondary text-2xl">💸</span> Understanding Inflation
                </h4>
                <p className="text-sm text-light-400 leading-relaxed">
                  Inflation measures the rate at which the general level of prices for goods and services is rising. 
                  The CBK uses the CBR to control inflation; high interest rates are often used to 
                  cool down high inflation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

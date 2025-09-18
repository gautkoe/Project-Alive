import React from 'react';

type LineChartDataPoint = {
  month: string;
  ebitda: number;
  ca: number;
};

type BarChartDataPoint = {
  category: string;
  value: number;
  target: number;
};

type ChartCardProps =
  | {
      title: string;
      type: 'line';
      data: LineChartDataPoint[];
    }
  | {
      title: string;
      type: 'bar';
      data: BarChartDataPoint[];
    };

const getSafeMaxValue = (values: number[]) => {
  const maxValue = Math.max(...values);
  return maxValue === 0 ? 1 : maxValue;
};

export const ChartCard: React.FC<ChartCardProps> = ({ title, type, data }) => {
  const renderLineChart = (lineData: LineChartDataPoint[]) => {
    const safeMaxValue = getSafeMaxValue(lineData.flatMap(item => [item.ebitda, item.ca]));

    return (
      <div className="h-64 flex items-end space-x-2">
        {lineData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-1">
            <div className="flex flex-col items-center space-y-1 w-full">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(item.ebitda / safeMaxValue) * 180}px` }}
                title={`EBITDA: ${item.ebitda}K€`}
              />
              <div
                className="w-full bg-green-500 rounded-t opacity-70"
                style={{ height: `${(item.ca / safeMaxValue) * 180}px` }}
                title={`CA: ${item.ca}K€`}
              />
            </div>
            <span className="text-xs text-gray-600">{item.month}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderBarChart = (barData: BarChartDataPoint[]) => {
    const safeMaxValue = getSafeMaxValue(barData.map(datum => Math.abs(datum.value)));

    return (
      <div className="h-64 flex items-end space-x-4">
        {barData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-full relative">
              <div
                className={`w-full rounded ${item.value >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                style={{
                  height: `${(Math.abs(item.value) / safeMaxValue) * 180}px`,
                  marginTop: item.value < 0 ? 'auto' : '0'
                }}
                title={`${item.category}: ${item.value}K€`}
              />
              <div
                className="w-full border-2 border-dashed border-gray-400 absolute top-0"
                style={{ height: `${(Math.abs(item.target) / safeMaxValue) * 180}px` }}
                title={`Target: ${item.target}K€`}
              />
            </div>
            <span className="text-xs text-gray-600 text-center">{item.category}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {type === 'line' ? renderLineChart(data) : renderBarChart(data)}

      {type === 'line' && (
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600">EBITDA</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded opacity-70" />
            <span className="text-sm text-gray-600">Chiffre d'Affaires</span>
          </div>
        </div>
      )}
    </div>
  );
};
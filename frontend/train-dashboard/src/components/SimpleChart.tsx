import React from 'react';

interface SimpleChartProps {
  data: { name: string; value: number; color?: string }[];
  title?: string;
  height?: number;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ 
  data, 
  title, 
  height = 200 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <div className="flex items-end space-x-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className={`w-full rounded-t transition-all duration-300 ${
                item.color || 'bg-blue-500'
              }`}
              style={{ 
                height: `${(item.value / maxValue) * (height - 40)}px`,
                minHeight: '4px'
              }}
              title={`${item.name}: ${item.value}`}
            />
            <div className="text-xs text-gray-600 mt-2 text-center">
              {item.name}
            </div>
            <div className="text-xs font-medium text-gray-900">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleChart;
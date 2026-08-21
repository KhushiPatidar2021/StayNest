import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle }) => {
  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div
          className={`p-3.5 rounded-2xl border ${
            colorStyles[color] || colorStyles.indigo
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;

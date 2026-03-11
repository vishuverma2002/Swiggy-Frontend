import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Helper function to detect dark mode
const isDarkMode = () => {
  if (typeof document !== 'undefined') {
    const dataTheme = document.documentElement.getAttribute('data-theme');
    if (dataTheme === 'dark') return true;
    
    // Also check CSS variables as fallback (dark themes have dark tertiary colors)
    const tertiaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--tertiary-color').trim();
    if (tertiaryColor && (tertiaryColor.includes('#1a') || tertiaryColor.includes('#16') || 
        tertiaryColor.includes('#2') || tertiaryColor.includes('#28'))) {
      return true;
    }
  }
  return false;
};

// Helper function to get text color based on theme
const getTextColor = () => {
  if (typeof document !== 'undefined' && isDarkMode()) {
    // Use CSS variable if available, otherwise default to white
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-text-color').trim() || 
      getComputedStyle(document.documentElement)
      .getPropertyValue('--text-primary-color').trim() || '#ffffff';
    return color || '#ffffff';
  }
  return '#333';
};

// Helper function to get title color based on theme
const getTitleColor = () => {
  if (typeof document !== 'undefined' && isDarkMode()) {
    // Use CSS variable if available, otherwise default to white
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-label-color').trim() || 
      getComputedStyle(document.documentElement)
      .getPropertyValue('--heading-color').trim() || '#ffffff';
    return color || '#ffffff';
  }
  return '#333';
};

// Helper function to get legend color
const getLegendColor = () => {
  if (typeof document !== 'undefined' && isDarkMode()) {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-legend-color').trim() || '#e5e7eb';
    return color || '#e5e7eb';
  }
  return '#333';
};

const COLORS = ["#1565C0", "#0D47A1", "#1E88E5", "#1976D2", "#283593", "#2A3EB1", "#26418F", "#102C57", "#123B7A", "#001F54"];

// Helper function to darken a color
const darkenColor = (color) => {
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbaMatch) {
      const r = Math.max(0, parseInt(rgbaMatch[1]) - 40);
      const g = Math.max(0, parseInt(rgbaMatch[2]) - 40);
      const b = Math.max(0, parseInt(rgbaMatch[3]) - 40);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  
  // Handle hex colors
  if (color.startsWith('#')) {
    // Remove alpha if present
    const hex = color.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 40);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 40);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 40);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = Math.max(0, parseInt(rgbMatch[1]) - 40);
      const g = Math.max(0, parseInt(rgbMatch[2]) - 40);
      const b = Math.max(0, parseInt(rgbMatch[3]) - 40);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  
  // Fallback to dark color
  return "#333";
};

// Custom tooltip
const CustomTooltip = ({ active, payload, showTooltip }) => {
  if (active && payload && payload.length && showTooltip) {
    const data = payload[0];
    const darkMode = isDarkMode();
    const darkerColor = darkMode ? "#ffffff" : darkenColor(data.color || "#666");
    return (
      <div
        style={{
          backgroundColor: darkMode ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
          border: darkMode ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <p style={{ margin: "0 0 5px 0", fontWeight: "600", color: darkMode ? "#ffffff" : "#333" }}>{data.name}</p>
        <p style={{ margin: "2px 0", color: darkerColor, fontWeight: "500" }}>({data.value}%)</p>
      </div>
    );
  }
  return null;
};

// Custom label renderer
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value, showDataLabels }) => {
  if (!showDataLabels) {
    return `${value}%`;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const labelColor = getTextColor();

  return (
    <text
      x={x}
      y={y}
      fill={labelColor}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${name} : ${value}`}
    </text>
  );
};

const DoughnutChart = ({ data, title, showTooltip = false, showDataLabels = false, showLegends = false }) => {
  if (!data || !data.labels || !data.datasets || !data.datasets[0] || !data.datasets[0].data) {
    return <div>No data available</div>;
  }

  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index] || 0,
  })).filter(item => item.value > 0);

  const titleColor = getTitleColor();
  const legendColor = getLegendColor();

  return (
    <div style={{ height: "210px", width: "280px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
      {title && (
        <h3 style={{ textAlign: "center", marginBottom: "10px", fontSize: "14px", fontWeight: "600", color: titleColor }}>{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props) => renderLabel({ ...props, showDataLabels })}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            animationDuration={800}
            animationBegin={0}
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip content={<CustomTooltip showTooltip={showTooltip} />} animationDuration={200} />
          )}
          {showLegends && <Legend wrapperStyle={{ color: legendColor, fontSize: 12 }} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;

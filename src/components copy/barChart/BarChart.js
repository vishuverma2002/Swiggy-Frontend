import React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie } from "recharts";
import { formatNumber, formatNumberShort } from "@/utils/utll";

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

// Helper function to get axis label color
const getAxisLabelColor = () => {
  if (typeof document !== 'undefined' && isDarkMode()) {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-axis-label-color').trim() || '#e5e7eb';
    return color || '#e5e7eb';
  }
  return '#333';
};

// Helper function to get tick color
const getTickColor = () => {
  if (typeof document !== 'undefined' && isDarkMode()) {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-tick-color').trim() || '#d1d5db';
    return color || '#d1d5db';
  }
  return '#666';
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

// Helper function to get grid color
const getGridColor = () => {
  if (typeof document !== 'undefined' && isDarkMode()) {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-grid-color').trim() || 'rgba(255, 255, 255, 0.1)';
    return color || 'rgba(255, 255, 255, 0.1)';
  }
  return '#ccc';
};

// Color palette for charts
const COLORS = {
  positive: "#1a7447",
  negative: "#f43d3dc8",
  positiveAlt: "rgba(0, 163, 120, 1)",
  negativeAlt: "#865656ff",
  pieColors: ["#1565C0", "#0D47A1", "#1E88E5", "#1976D2", "#283593", "#2A3EB1", "#26418F", "#102C57", "#123B7A", "#001F54"],
  modernPieColors: [
    "#4F46E5", // Indigo
    "#06B6D4", // Cyan
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#F97316", // Orange
    "#6366F1", // Blue
  ],
};

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
  
  // Fallback to dark color
  return "#333";
};

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
  format = (val) => {
    const numVal = typeof val === "number" ? val : parseFloat(val) || 0;
    return `${numVal.toFixed(2)}%`;
  },
}) => {
  if (active && payload && payload.length) {
    const darkMode = isDarkMode();
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
        <p style={{ margin: "0 0 5px 0", fontWeight: "600", color: darkMode ? "#ffffff" : "#333" }}>{label || ""}</p>
        {payload.map((entry, index) => {
          const value = entry.value !== undefined && entry.value !== null ? entry.value : 0;
          const darkerColor = darkMode ? "#ffffff" : darkenColor(entry.color || "#666");
          return (
            <p key={index} style={{ margin: "2px 0", color: darkerColor, fontWeight: "500" }}>
              {entry.name ? `${entry.name}: ` : ""}
              {format(value)}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

// Main BarChart component
export function BarChart({ data, title = "", hideGrid = false }) {
  if (!data || !data.labels || !data.datasets) {
    return <div>No data available</div>;
  }

  const chartData = data.labels.map((label, index) => {
    const rawValue = data.datasets[index];
    const numValue = typeof rawValue === "number" ? rawValue : parseFloat(rawValue) || 0;
    return {
      name: label,
      value: numValue,
    };
  });

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const titleColor = getTitleColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "280px", maxHeight: "400px" }}>
      {title && <h3 style={{ textAlign: "center", marginBottom: "8px", fontSize: "15px", fontWeight: "600", color: titleColor }}>{title}</h3>}
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 36.2 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={!hideGrid} stroke={gridColor} />
          <XAxis 
            type="number" 
            domain={["auto", "auto"]} 
            tickFormatter={(value) => `${value.toFixed(2)}%`} 
            label={{ value: "Total Return %", position: "bottom", offset: 10, fill: axisLabelColor, fontSize: 12 }} 
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={140} 
            tick={{ fontSize: 11, fill: tickColor }} 
            interval={0}
            angle={0}
            textAnchor="end"
            dx={-5}
          />
          <Tooltip
            content={
              <CustomTooltip
                format={(val) => {
                  const numVal = typeof val === "number" ? val : parseFloat(val) || 0;
                  return `${numVal.toFixed(2)}%`;
                }}
              />
            }
            animationDuration={200}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800} animationBegin={0} isAnimationActive={true}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value < 0 ? COLORS.negative : COLORS.positive} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// BarChart for Holdings
export const BarChart_Holding = ({ data, title }) => {
  if (!data || !data.labels || !data.datasets) {
    return <div>No data available</div>;
  }

  const chartData = data.labels.map((label, index) => {
    const rawValue = data.datasets[index];
    const numValue = typeof rawValue === "number" ? rawValue : parseFloat(rawValue) || 0;
    return {
      name: label,
      value: numValue,
    };
  });

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const titleColor = getTitleColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "280px", maxHeight: "400px" }}>
      {title && <h3 style={{ textAlign: "center", marginBottom: "8px", fontSize: "15px", fontWeight: "600", color: titleColor }}>{title}</h3>}
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => value.toFixed(2)} 
            label={{ value: "Total Return %", position: "insideBottom", offset: -5, fill: axisLabelColor, fontSize: 12 }} 
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120} 
            tick={{ fontSize: 14, fill: tickColor, fontWeight: 400 }} 
          />
          <Tooltip
            content={
              <CustomTooltip
                format={(val) => {
                  const numVal = typeof val === "number" ? val : parseFloat(val) || 0;
                  return numVal.toFixed(2);
                }}
              />
            }
            animationDuration={200}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800} animationBegin={0} isAnimationActive={true} label={{ position: "right", formatter: (val) => val.toFixed(2), fill: textColor, fontSize: 11, fontWeight: 500 }}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value < 0 ? COLORS.negativeAlt : COLORS.positiveAlt} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// BarChart for Models Summary
export const BarChart_Models_Summary = ({ data, title }) => {
  if (!data || !data.labels || !data.datasets) {
    return <div>No data available</div>;
  }

  const chartData = data.labels.map((label, index) => {
    const datasetItem = data.datasets[index];
    const total = typeof datasetItem?.[1] === "number" ? datasetItem[1] : parseFloat(datasetItem?.[1]) || 0;
    const newThisMonth = typeof datasetItem?.[0] === "number" ? datasetItem[0] : parseFloat(datasetItem?.[0]) || 0;
    return {
      name: label,
      Total: total,
      "New This Month": newThisMonth,
    };
  });

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const titleColor = getTitleColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  const legendColor = getLegendColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "280px", maxHeight: "400px" }}>
      {title && <h3 style={{ textAlign: "center", marginBottom: "8px", fontSize: "15px", fontWeight: "600", color: titleColor }}>{title}</h3>}
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => formatNumberShort(value, 0)} 
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120} 
            tick={{ fontSize: 12, fill: tickColor }} 
          />
          <Tooltip content={<CustomTooltip format={(val) => formatNumberShort(val, 0)} />} animationDuration={200} />
          <Legend wrapperStyle={{ color: legendColor, fontSize: 12 }} />
          <Bar dataKey="Total" stackId="a" fill="rgba(175, 117, 1, 0.857)" radius={[0, 0, 0, 0]} animationDuration={800} animationBegin={0} isAnimationActive={true} />
          <Bar dataKey="New This Month" stackId="a" fill="rgba(0, 163, 119, 0.584)" radius={[4, 4, 0, 0]} animationDuration={800} animationBegin={100} isAnimationActive={true} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// BarChart for Models
export const BarChart_Models = ({ data, title, label, hideGrid = false }) => {
  if (!data || !data.labels || !data.datasets || data.labels.length === 0 || data.datasets.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "300px",
          maxHeight: "450px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary-color)",
          fontSize: "14px",
        }}
      >
        No data available
      </div>
    );
  }

  const chartData = data.labels
    .map((label, index) => {
      const rawValue = data.datasets[index];
      const numValue = typeof rawValue === "number" ? rawValue : parseFloat(rawValue) || 0;
      return {
        name: label && label.length > 20 ? label.slice(0, 20) + "..." : label || `Item ${index + 1}`,
        value: numValue,
      };
    })
    .filter((item) => item.name); // Filter out invalid entries

  if (chartData.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "300px",
          maxHeight: "450px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary-color)",
          fontSize: "14px",
        }}
      >
        No data available
      </div>
    );
  }

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const titleColor = getTitleColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "200px", maxHeight: "280px" }}>
      {title && <h3 style={{ textAlign: "center", marginBottom: "8px", fontSize: "15px", fontWeight: "600", color: titleColor }}>{title}</h3>}
      <ResponsiveContainer width="100%" height="100%" minHeight={200} maxHeight={260}>
        <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {!hideGrid && <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />}
          <XAxis type="number" tickFormatter={(value) => formatNumberShort(value, 0) + "%"} tick={{ fontSize: 10, fill: tickColor }} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: tickColor, fontWeight: 400 }} />
          <Tooltip
            content={
              <CustomTooltip
                format={(val) => {
                  const numVal = typeof val === "number" ? val : parseFloat(val) || 0;
                  return `${formatNumberShort(numVal)}%`;
                }}
              />
            }
            animationDuration={300}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            animationDuration={1000}
            animationBegin={0}
            isAnimationActive={true}
            label={{
              position: "right",
              formatter: (val) => (val === 0 || !val ? "" : `${formatNumberShort(val)}%`),
              style: { fontSize: "10px", fill: textColor, fontWeight: 500 },
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value < 0 ? "#6B4545" : "#007A5A"} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// PieChart component
export const PieChart = ({ data, title, padding = 20 }) => {
  if (!data || !data.labels || !data.datasets) {
    return <div>No data available</div>;
  }

  const chartData = data.labels
    .map((label, index) => {
      const rawValue = data.datasets[index];
      const numValue = typeof rawValue === "number" ? rawValue : parseFloat(rawValue) || 0;
      return {
        name: label,
        value: numValue,
      };
    })
    .filter((item) => item.value > 0);

  const RADIAN = Math.PI / 180;
  
  // Custom label with percentage outside the pie
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent <= 0.03) return null; // Don't show labels for very small segments (3% or less)
    
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={getTextColor()} 
        textAnchor={x > cx ? "start" : "end"} 
        dominantBaseline="central" 
        fontSize={12} 
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Custom legend renderer
  const renderLegend = (props) => {
    const { payload } = props;
    const darkMode = isDarkMode();
    const legendColor = getLegendColor();
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px',
        padding: '10px',
        maxHeight: '250px',
        overflowY: 'auto'
      }}>
        {payload.map((entry, index) => (
          <div 
            key={`legend-${index}`} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '13px',
              color: legendColor
            }}
          >
            <div 
              style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: entry.color,
                borderRadius: '3px',
                flexShrink: 0
              }} 
            />
            <span style={{ fontWeight: 500 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      minHeight: "280px", 
      maxHeight: "400px", 
      padding: `${padding}px`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {title && (
        <h3 style={{ 
          textAlign: "center", 
          marginBottom: "10px", 
          fontSize: "16px", 
          fontWeight: "600",
          color: getTitleColor()
        }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <RechartsPieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <Pie 
            data={chartData} 
            cx="50%" 
            cy="50%" 
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            // innerRadius={60}
            fill="#8884d8" 
            dataKey="value" 
            animationDuration={1000} 
            animationBegin={0} 
            isAnimationActive={true}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS.modernPieColors[index % COLORS.modernPieColors.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip 
            content={
              <CustomTooltip 
                format={(val) => `${val.toFixed(2)}%`} 
              />
            } 
            animationDuration={200} 
          />
          <Legend 
            content={renderLegend}
            verticalAlign="middle" 
            align="right"
            layout="vertical"
            wrapperStyle={{
              paddingLeft: '20px',
              maxWidth: '200px'
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

// BarChart for Business Leads
export const BarChart_BusinessLeads = ({ data, title }) => {
  if (!data || !data.labels || !data.datasets || data.labels.length === 0 || data.datasets.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "300px",
          maxHeight: "450px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary-color)",
          fontSize: "14px",
        }}
      >
        No data available
      </div>
    );
  }

  const chartData = data.labels
    .map((label, index) => {
      const datasetItem = data.datasets[index] || [0, 0, 0];
      const active = typeof datasetItem?.[0] === "number" ? datasetItem[0] : parseFloat(datasetItem?.[0]) || 0;
      const converted = typeof datasetItem?.[2] === "number" ? datasetItem[2] : parseFloat(datasetItem?.[2]) || 0;
      const lost = typeof datasetItem?.[1] === "number" ? datasetItem[1] : parseFloat(datasetItem?.[1]) || 0;
      return {
        name: label || `Item ${index + 1}`,
        Active: Math.max(0, active),
        Converted: Math.max(0, converted),
        Lost: Math.max(0, lost),
      };
    })
    .filter((item) => item.name); // Filter out invalid entries

  if (chartData.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "300px",
          maxHeight: "450px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary-color)",
          fontSize: "14px",
        }}
      >
        No data available
      </div>
    );
  }

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const titleColor = getTitleColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  const legendColor = getLegendColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "300px", maxHeight: "450px", position: "relative", overflow: "hidden" }}>
      {title && <h3 style={{ textAlign: "center", marginBottom: "8px", fontSize: "15px", fontWeight: "600", color: titleColor }}>{title}</h3>}
      <ResponsiveContainer width="100%" height="100%" minHeight={300} maxHeight={430}>
        <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
          <XAxis 
            type="number" 
            tickFormatter={(value) => (Number.isInteger(value) ? value : null)} 
            tick={{ fontSize: 10, fill: tickColor }} 
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100} 
            tick={{ fontSize: 10, fill: tickColor }} 
          />
          <Tooltip
            content={
              <CustomTooltip
                format={(val) => {
                  const numVal = typeof val === "number" ? val : parseFloat(val) || 0;
                  return numVal.toFixed(0);
                }}
              />
            }
            animationDuration={300}
            animationEasing="ease-out"
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: "15px", 
              fontSize: "12px", 
              fontWeight: "500",
              textAlign: "center",
              lineHeight: "1.5",
              color: legendColor
            }} 
            iconType="rect" 
            iconSize={14}
            verticalAlign="bottom"
            align="center"
          />
          <Bar dataKey="Active" stackId="a" fill="#FFC266" radius={[0, 0, 0, 0]} animationDuration={1000} animationBegin={0} isAnimationActive={true} label={{ position: "right", formatter: (val) => (val && val > 0 ? val.toFixed(0) : ""), style: { fontSize: "10px", fill: textColor, fontWeight: 500 } }} />
          <Bar dataKey="Converted" stackId="a" fill="#66D4B3" radius={[0, 0, 0, 0]} animationDuration={1000} animationBegin={150} isAnimationActive={true} label={{ position: "right", formatter: (val) => (val && val > 0 ? val.toFixed(0) : ""), style: { fontSize: "10px", fill: textColor, fontWeight: 500 } }} />
          <Bar dataKey="Lost" stackId="a" fill="#F5A5A5" radius={[4, 4, 0, 0]} animationDuration={1000} animationBegin={300} isAnimationActive={true} label={{ position: "right", formatter: (val) => (val && val > 0 ? val.toFixed(0) : ""), style: { fontSize: "10px", fill: textColor, fontWeight: 500 } }} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

import React from "react";
import { LineChart as RechartsLineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Scatter } from "recharts";

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

const colors = ["rgb(255, 99, 132)", "rgb(3, 128, 252)", "rgb(53, 162, 135)", "rgb(3, 223, 252)", "rgb(252, 198, 3)", "rgb(240, 3, 252)", "rgb(188,143,143)", "rgb(255,255,255)", "rgb(7, 252, 3)", "rgb(64,224,208)", "rgb(255,105,180)", "rgb(0, 191, 255)", "rgb(255, 165, 0)", "rgb(218, 112, 214)", "rgb(255, 20, 147)", "rgb(0, 128, 0)", "rgb(255, 215, 0)", "rgb(32, 178, 170)", "rgb(128, 0, 128)", "rgb(255, 69, 0)", "rgb(0, 255, 127)", "rgb(70, 130, 180)", "rgb(255, 99, 71)", "rgb(65, 105, 225)"];

const colorsLight = ["rgba(255, 97, 131, 0.7)", "rgba(3, 127, 252, 0.511)", "rgba(53, 162, 135, 0.525)", "rgb(3, 223, 252)", "rgba(252, 198, 3, 0.567)", "rgba(239, 3, 252, 0.512)", "rgba(188, 143, 143, 0.501)", "rgba(255, 255, 255, 0.52)", "rgba(7, 252, 3, 0.542)", "rgba(64, 224, 208, 0.417)", "rgba(255, 105, 180, 0.523)", "rgba(0, 191, 255, 0.515)", "rgba(255, 166, 0, 0.481)", "rgba(218, 112, 214, 0.492)", "rgba(255, 20, 145, 0.521)", "rgba(0, 128, 0, 0.46)", "rgba(255, 217, 0, 0.498)", "rgba(32, 178, 171, 0.473)", "rgba(128, 0, 128, 0.462)", "rgba(255, 68, 0, 0.4)", "rgba(0, 255, 128, 0.451)", "rgba(70, 131, 180, 0.465)", "rgba(255, 99, 71, 0.426)", "rgba(65, 105, 225, 0.466)"];

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

// Custom tooltip for line charts
const CustomLineTooltip = ({
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
              {entry.name}: {format(value)}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

// Main LineChart component
export default function LineChartComponent({ labels, datasets, showLedgeds = true, zoom = true }) {
  if (!labels || !datasets || labels.length === 0 || datasets.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = labels.map((label, index) => {
    const dataPoint = { name: label };
    datasets.forEach((dataset, dsIndex) => {
      if (dataset?.portfolioName) {
        dataPoint[dataset.portfolioName] = dataset.portfolioTwrr?.[index] || 0;
      }
      if (dataset?.benchMarkIndexName) {
        dataPoint[dataset.benchMarkIndexName] = dataset.benchmarkTwrr?.[index] || 0;
      }
    });
    return dataPoint;
  });

  const dataKeys = [];
  datasets.forEach((dataset) => {
    if (dataset?.portfolioName) dataKeys.push(dataset.portfolioName);
    if (dataset?.benchMarkIndexName) dataKeys.push(dataset.benchMarkIndexName);
  });

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  const legendColor = getLegendColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "280px", maxHeight: "400px",paddingTop: "3.2rem"}}>
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <RechartsLineChart data={chartData} margin={{  right: 40, left: 10, bottom: 54 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80} 
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <YAxis 
            label={{ value: "TWRR (%)", angle: -90, position: "left", offset: 2, fill: axisLabelColor, fontSize: 12 }} 
            tickFormatter={(value) => `${value.toFixed(2)}%`} 
            domain={[0, "auto"]}
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <Tooltip content={<CustomLineTooltip />} animationDuration={200} />
          {showLedgeds && <Legend wrapperStyle={{ color: legendColor, fontSize: 12 }} />}
          {dataKeys.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={1} dot={false} animationDuration={800} animationBegin={index * 100} isAnimationActive={true} />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// NAV Movement Chart
export const NavMovementChart = ({ labels, datasets, fill = true }) => {
  if (!labels || !datasets || labels.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = labels.map((label, index) => ({
    name: label,
    value: datasets[index] || 0,
  }));

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  const legendColor = getLegendColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "280px", maxHeight: "400px" }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(71, 118, 194, 0.3)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="rgba(71, 118, 194, 0.3)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <YAxis 
            label={{ value: "Nav Assets", angle: -90, position: "insideLeft", fill: axisLabelColor, fontSize: 12 }} 
            tickFormatter={(value) => `${value.toLocaleString()} ₹`} 
            domain={["auto", "auto"]}
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <Tooltip
            content={
              <CustomLineTooltip
                format={(val) => {
                  const numVal = typeof val === "number" ? val : parseFloat(val) || 0;
                  return `${numVal.toLocaleString()} ₹`;
                }}
              />
            }
            animationDuration={200}
          />
          <Legend wrapperStyle={{ color: legendColor, fontSize: 12 }} />
          <Area type="monotone" dataKey="value" stroke="rgba(71, 118, 194, 0.89)" strokeWidth={2} fill={fill ? "url(#colorValue)" : "none"} fillOpacity={fill ? 1 : 0} animationDuration={800} animationBegin={0} isAnimationActive={true} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// TWRR Movement Chart
export const TWRRMovementChart = ({ labels, datasets, fill = true }) => {
  if (!labels || !datasets || labels.length === 0 || datasets.length === 0) {
    return <div>No data available</div>;
  }

  const datasetItem = datasets[0];
  const chartData = labels.map((label, index) => ({
    name: label,
    value: (datasetItem?.portfolioTwrr?.[index] || 0) * 100,
  }));

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  const legendColor = getLegendColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "280px", maxHeight: "400px" }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorTWRR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(71, 118, 194, 0.725)" stopOpacity={fill ? 0.8 : 0} />
              <stop offset="95%" stopColor="rgba(71, 118, 194, 0.725)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <YAxis 
            label={{ value: "Annualised TWRR (%)", angle: -90, position: "insideLeft", fill: axisLabelColor, fontSize: 12 }} 
            tickFormatter={(value) => `${value.toFixed(2)}%`} 
            domain={[0, "auto"]}
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <Tooltip
            content={
              <CustomLineTooltip
                format={(val) => {
                  const numVal = typeof val === "number" ? val : parseFloat(val) || 0;
                  return `${numVal.toFixed(2)}%`;
                }}
              />
            }
            animationDuration={200}
          />
          <Legend wrapperStyle={{ color: legendColor, fontSize: 12 }} />
          <Area type="monotone" dataKey="value" name={datasetItem?.portfolioName || "Portfolio"} stroke="rgba(71, 118, 194, 0.5)" strokeWidth={2} fill={fill ? "url(#colorTWRR)" : "none"} fillOpacity={fill ? 1 : 0} animationDuration={800} animationBegin={0} isAnimationActive={true} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Macro Economics Historical Chart
export const MacroEconomicsHistoricalChart = ({ data }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = data.labels.map((label, index) => {
    const dataPoint = { name: label };
    data.data?.forEach((item) => {
      if (item.label) {
        dataPoint[item.label] = item.data?.[index] || 0;
      }
    });
    return dataPoint;
  });

  const dataKeys = data.data?.map((item) => item.label).filter(Boolean) || [];

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  const legendColor = getLegendColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "280px", maxHeight: "400px" }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <YAxis 
            tickFormatter={(value) => value.toFixed(2)} 
            domain={[0, "auto"]}
            tick={{ fill: tickColor, fontSize: 11 }}
          />
          <Tooltip
            content={
              <CustomLineTooltip
                format={(val) => {
                  const numVal = typeof val === "number" ? val : parseFloat(val) || 0;
                  return numVal.toFixed(2);
                }}
              />
            }
            animationDuration={200}
          />
          <Legend wrapperStyle={{ color: legendColor, fontSize: 12 }} />
          {dataKeys.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colors[colors.length - index - 1]} strokeWidth={1} dot={false} animationDuration={800} animationBegin={index * 100} isAnimationActive={true} />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper function to sample data for better performance with intelligent sampling
const sampleData = (data, maxPoints = 1000) => {
  if (data.length <= maxPoints) return data;
  
  // Use a more intelligent sampling strategy that preserves important points
  const step = Math.ceil(data.length / maxPoints);
  const sampled = [];
  
  // Always include first point
  sampled.push(data[0]);
  
  // Sample with step, but also check for significant changes
  for (let i = step; i < data.length - step; i += step) {
    sampled.push(data[i]);
  }
  
  // Always include the last point
  if (sampled[sampled.length - 1] !== data[data.length - 1]) {
    sampled.push(data[data.length - 1]);
  }
  
  return sampled;
};

// Memoized tooltip component for better performance
const StockChartTooltip = React.memo(({ active, payload, corpActionKey }) => {
  if (!active || !payload || payload.length === 0) return null;
  
  const data = payload[0].payload;
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
      <p style={{ margin: "0 0 5px 0", fontWeight: "600", color: darkMode ? "#ffffff" : "#333" }}>{data.name}</p>
      {data[`${corpActionKey}_action`] && (
        <p style={{ margin: "2px 0", color: darkMode ? "#ffffff" : "#333" }}>
          {data[`${corpActionKey}_action`]}: {data[`${corpActionKey}_desc`]}
        </p>
      )}
      {payload.map((entry, index) => {
        const darkerColor = darkMode ? "#ffffff" : darkenColor(entry.color || "#666");
        return (
          <p key={index} style={{ margin: "2px 0", color: darkerColor, fontWeight: "500" }}>
            {entry.name}: {(Number(entry.value) || 0).toFixed(2)}
          </p>
        );
      })}
    </div>
  );
});

StockChartTooltip.displayName = 'StockChartTooltip';

// Stock Analysis Historical Graph - Optimized for performance
export const StockAnalysisHistoricalGraph = React.memo(({ labels = [], datasets = [], options: customOptions = {} }) => {
  if (!labels || labels.length === 0 || !datasets || datasets.length === 0) {
    return <div>No data available</div>;
  }

  // Memoize chart data transformation for better performance
  const chartData = React.useMemo(() => {
    const rawData = labels.map((label, index) => {
      const dataPoint = { name: label };
      datasets.forEach((dataset) => {
        if (dataset.label) {
          const value = dataset.data?.[index];
          if (dataset.label === "Corporate Actions" && value && typeof value === "object") {
            // Handle corporate actions data structure
            dataPoint[dataset.label] = value.y || value.price || null;
            dataPoint[`${dataset.label}_action`] = value.actionType;
            dataPoint[`${dataset.label}_desc`] = value.description;
          } else if (dataset.label !== "Corporate Actions") {
            // Handle price data - use null for missing values to maintain smooth line
            dataPoint[dataset.label] = value !== null && value !== undefined ? Number(value) : null;
          }
        }
      });
      return dataPoint;
    });
    
    // Sample data if too large for better performance - increased limit for smoother charts
    return sampleData(rawData, 1000);
  }, [labels, datasets]);

  const lineKeys = React.useMemo(() => {
    return datasets.filter((ds) => ds.label !== "Corporate Actions").map((ds) => ds.label);
  }, [datasets]);

  const corpActionKey = React.useMemo(() => {
    return datasets.find((ds) => ds.label === "Corporate Actions")?.label;
  }, [datasets]);

  // Calculate optimal X-axis interval based on data length for better performance
  const xAxisInterval = React.useMemo(() => {
    const dataLength = chartData.length;
    if (dataLength <= 50) return 0; // Show all labels
    if (dataLength <= 100) return 1; // Show every other
    if (dataLength <= 200) return 2; // Show every 3rd
    if (dataLength <= 500) return Math.floor(dataLength / 20); // Show ~20 labels
    return Math.floor(dataLength / 15); // Show ~15 labels for large datasets
  }, [chartData.length]);

  // Memoize tooltip content
  const tooltipContent = React.useCallback(
    ({ active, payload }) => (
      <StockChartTooltip active={active} payload={payload} corpActionKey={corpActionKey} />
    ),
    [corpActionKey]
  );

  const darkMode = isDarkMode();
  const textColor = getTextColor();
  const axisLabelColor = getAxisLabelColor();
  const tickColor = getTickColor();
  const gridColor = getGridColor();
  const legendColor = getLegendColor();
  
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "280px", maxHeight: "400px" }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={280} maxHeight={380}>
        <ComposedChart 
          data={chartData} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          syncId="stock-analysis-chart"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            reversed 
            interval={xAxisInterval}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 11, fill: tickColor }}
            minTickGap={30}
          />
          <YAxis 
            label={{ value: "Price", angle: -90, position: "insideLeft", fill: axisLabelColor, fontSize: 12 }} 
            tickFormatter={(value) => value.toFixed(2)}
            tick={{ fontSize: 11, fill: tickColor }}
            domain={['auto', 'auto']}
            width={60}
          />
          <Tooltip
            content={tooltipContent}
            animationDuration={0}
            cursor={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.3)' : '#ccc', strokeWidth: 1 }}
            allowEscapeViewBox={{ x: false, y: true }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: legendColor }} />
          {lineKeys.map((key, index) => (
            <Area 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke="rgba(221, 41, 221, 0.49)" 
              fill="rgba(221, 41, 221, 0.49)" 
              fillOpacity={index === 0 ? 0.6 : 0} 
              strokeWidth={1.5} 
              dot={false} 
              connectNulls={false}
              animationDuration={0}
              isAnimationActive={false}
              activeDot={{ r: 4, strokeWidth: 1 }}
            />
          ))}
          {corpActionKey && (
            <Scatter 
              dataKey={corpActionKey} 
              fill="#FFFFFF" 
              stroke="#000000" 
              strokeWidth={1.5} 
              animationDuration={0}
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  if (prevProps.labels?.length !== nextProps.labels?.length) return false;
  if (prevProps.datasets?.length !== nextProps.datasets?.length) return false;
  
  // Deep comparison of labels
  if (JSON.stringify(prevProps.labels) !== JSON.stringify(nextProps.labels)) return false;
  
  // Deep comparison of datasets
  if (JSON.stringify(prevProps.datasets) !== JSON.stringify(nextProps.datasets)) return false;
  
  return true;
});

StockAnalysisHistoricalGraph.displayName = 'StockAnalysisHistoricalGraph';

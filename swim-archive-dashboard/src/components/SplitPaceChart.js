import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';




/**
 * Converts seconds into a formatted string like "1'42"".
 * @param {number} totalSeconds - The total number of seconds.
 * @returns {string} Formatted time string.
 */
const formatTime = (totalSeconds) => {
  if (totalSeconds === 0) return "0'00\"";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
};

/**
 * Custom Tooltip component for Recharts.
 * Displays split pace information.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const timeInSeconds = payload[0].value;
    return (
      <div style={{
        backgroundColor: 'rgba(26, 60, 52, 0.9)', // Deep Ink Green with opacity
        padding: '10px',
        border: '1px solid #FDF8E1',
        borderRadius: '4px',
        fontFamily: 'monospace', // Monospace for data
        color: '#FDF8E1',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <p style={{ margin: 0 }}>{`100m Split #${label}: ${formatTime(timeInSeconds)}`}</p>
      </div>
    );
  }
  return null;
};

/**
 * Calculates 100m split times from raw swim distance data.
 * @param {Array<Object>} swimDistanceArray - Array of { qty: number, date: string }
 * @returns {Array<{ split: number, time: number }>} - Array of split times in seconds.
 */
const calculatePaceSplits = (swimDistanceArray) => {
  const splits = [];
  let currentCumulativeDistance = 0;
  let lastSplitCumulativeDistance = 0;
  let lastSplitCumulativeTimeInSeconds = 0; // Cumulative time in seconds up to the *end* of the last split

  swimDistanceArray.forEach((entry, index) => {
    const timeElapsedInThisEntry = 60; // Each entry represents 1 minute
    const distanceCoveredInThisEntry = entry.qty;
    const currentCumulativeTimeInSeconds = (index + 1) * 60; // Total time from start to *end* of this entry

    const previousCumulativeDistance = currentCumulativeDistance;
    currentCumulativeDistance += distanceCoveredInThisEntry;

    // Check if we crossed a 100m boundary
    while (currentCumulativeDistance >= (splits.length + 1) * 100) {
      const targetDistance = (splits.length + 1) * 100;

      // Calculate the exact time when targetDistance was reached
      let timeToReachTargetFromStart;

      if (distanceCoveredInThisEntry === 0) {
        // If no distance covered in this minute, time doesn't change
        timeToReachTargetFromStart = currentCumulativeTimeInSeconds;
      } else {
        // Interpolate the time within the current minute interval
        const distanceIntoCurrentEntry = targetDistance - previousCumulativeDistance;
        const fractionOfMinute = distanceIntoCurrentEntry / distanceCoveredInThisEntry;
        timeToReachTargetFromStart = (index * 60) + (fractionOfMinute * timeElapsedInThisEntry);
      }
      
      // Calculate the actual split time for this 100m segment
      const splitTime = timeToReachTargetFromStart - lastSplitCumulativeTimeInSeconds;

      splits.push({
        split: splits.length + 1,
        time: Math.max(0, Math.round(splitTime)) // Ensure non-negative and round to nearest second
      });
      lastSplitCumulativeTimeInSeconds = timeToReachTargetFromStart;
      lastSplitCumulativeDistance = targetDistance;
    }
  });

  return splits;
};

/**
 * React Component for 100m Split Pace Bar Chart.
 * @param {Object} props
 * @param {Array<Object>} props.swimDistanceData - The raw swim distance data array.
 */
const SplitPaceChart = ({ swimDistanceData = MOCK_SWIM_DISTANCE_DATA }) => {
  // Process the data using useMemo to optimize performance
  const processedData = useMemo(() => calculatePaceSplits(swimDistanceData), [swimDistanceData]);

  // Define custom styles for fonts
  const serifFontFamily = 'Georgia, serif'; // Example serif font
  const monospaceFontFamily = 'Menlo, monospace'; // Example monospace font

  return (
    <div style={{
      backgroundColor: '#1A3C34', // Deep Ink Green background
      padding: '20px',
      borderRadius: '8px',
      color: '#FDF8E1', // Creamy off-white for general text
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '400px', // Ensure visibility for responsive container
      boxSizing: 'border-box'
    }}>
      <h2 style={{ fontFamily: serifFontFamily, marginBottom: '20px', fontSize: '1.8em' }}>
        100m 分段配速
      </h2>
      {processedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={processedData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false} // Only horizontal dashed lines
              stroke="#FDF8E120" // Very faint creamy color
            />
            <XAxis
              dataKey="split"
              axisLine={false} // Hide X-axis line
              tickLine={false} // Hide X-axis tick marks
              tick={{ fill: '#FDF8E1', fontFamily: monospaceFontFamily }} // Creamy color, monospace font
              tickFormatter={(value) => `#${value}`}
            />
            <YAxis
              axisLine={false} // Hide Y-axis line
              tickLine={false} // Hide Y-axis tick marks
              tick={{ fill: '#FDF8E1', fontFamily: monospaceFontFamily }} // Creamy color, monospace font
              tickFormatter={formatTime} // Custom formatter for time
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
            <Bar
              dataKey="time"
              fill="#FDF8E1" // Creamy off-white for bars
              radius={[4, 4, 0, 0]} // Rounded top corners
              // A subtle stroke can add to the "高级感细节"
              stroke="#FDF8E1" // Creamy border
              strokeWidth={0.5} // Very thin border
              opacity={0.9} // Slightly transparent
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ fontFamily: monospaceFontFamily, color: '#FDF8E190' }}>
          暂无足够数据生成 100m 分段配速图。
        </p>
      )}
    </div>
  );
};

export default SplitPaceChart;



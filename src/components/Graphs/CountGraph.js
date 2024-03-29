import React, {useState, useEffect} from 'react';
import LineGraph from './LineGraph';

export function CountGraph({
  data,
  dataField,
  timeRange,
  date,
  dataType,
  zeroFlag,
}) {
  const [processedData, setProcessedData] = useState([]);
  const [maxData, setMaxData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.length > 0 && dataField) {
      let queryField = '';
      if (dataField.name === 'numOfAP') queryField = 'accessPoint';
      if (dataField.name === 'numOfApps') queryField = 'app';
      const tempData = data.map(d => ({
        timestamp: d.timestamp,
        value: d.value[queryField].length,
      }));
      setMaxData(Math.max(...tempData.map(d => d.value)));
      setProcessedData(tempData);
    } else setProcessedData([]);
  }, [data, dataField]);

  useEffect(() => {
    setLoading(true);
  }, [data, dataField, timeRange, date]);

  useEffect(() => {
    if ((data.length > 0 && processedData.length > 0) || zeroFlag)
      setLoading(false);
  }, [data, processedData, zeroFlag]);

  const axisName = `${dataType} ${dataField.name}`;

  return (
    <LineGraph
      loading={loading}
      processedData={processedData}
      axisName={axisName}
      maxData={maxData}
    />
  );
}

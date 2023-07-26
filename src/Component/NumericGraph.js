import React, {useState, useEffect} from 'react';
import LineGraph from './LineGraph';

export default function NumericGraph({
  data,
  dataField,
  dataType,
  timeRange,
  date,
  zeroFlag,
}) {
  const [processedData, setProcessedData] = useState([]);
  const [maxData, setMaxData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.length > 0 && dataField) {
      const tempData = data.map(d => ({
        timestamp: d.timestamp,
        value: d.value[dataField.name],
      }));
      setProcessedData(tempData);
      setMaxData(Math.max(...tempData.map(d => d.value)));
    } else setProcessedData([]);
  }, [data, dataField]);

  useEffect(() => {
    setLoading(true);
  }, [data, dataField, timeRange, date]);

  //for the development, the after the date changed, new data will be fetched.
  //but this is mock data, so the data will not be changed.
  //I include date at useEffect's dependency array to make sure the data will be fetched again.
  //after attach the normal api, you should remove the date from the dependency array.

  useEffect(() => {
    if ((data.length > 0 && processedData.length > 0) || zeroFlag) {
      setLoading(false);
    }
  }, [data, processedData, zeroFlag, date]);

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

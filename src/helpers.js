export const searchURL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=${process.env.REACT_APP_API_KEY}`;
export const seriesURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&outputsize=full&apikey=${process.env.REACT_APP_API_KEY}`;

const convertTimestamp = (strDate) => {
  return new Date(strDate).getTime();
};

export const getData = (results = {}) => {
  const series = results?.["Time Series (5min)"] || {};
  const seriesKeys = Object.keys(series);

  const data = seriesKeys?.map((el) => ({
    ...series[el],
    timestamp: el,
  }));

  const price = [];
  const volume = [];
  const rows = [];

  for (let i = 0; i < data.length; i++) {
    price.push([
      convertTimestamp(data[i]["timestamp"]),
      Number(data[i]["1. open"]),
      Number(data[i]["2. high"]),
      Number(data[i]["3. low"]),
      Number(data[i]["4. close"]),
    ]);

    volume.push([
      convertTimestamp(data[i]["timestamp"]),
      Number(data[i]["5. volume"]),
    ]);

    rows.push({
      time: data[i]["timestamp"],
      open: Number(data[i]["1. open"]).toFixed(2),
      high: Number(data[i]["2. high"]).toFixed(2),
      low: Number(data[i]["3. low"]).toFixed(2),
      close: Number(data[i]["4. close"]).toFixed(2),
      volume: data[i]["5. volume"],
    });
  }
  return {
    price: price?.reverse(),
    volume: volume?.reverse(),
    rows,
  };
};

export const getOptions = (selectedValue, results) => ({
  title: {
    text: `${selectedValue?.label} stock price chart`,
  },

  yAxis: [
    {
      labels: {
        align: "right",
        x: -3,
      },
      title: {
        text: "OHLC",
      },
      height: "60%",
      lineWidth: 2,
      resize: {
        enabled: true,
      },
    },
    {
      labels: {
        align: "right",
        x: -3,
      },
      title: {
        text: "Volume",
      },
      top: "65%",
      height: "35%",
      offset: 0,
      lineWidth: 2,
    },
  ],

  tooltip: {
    split: true,
  },

  series: [
    {
      type: "candlestick",
      name: "AAPL",
      data: getData(results)?.price,
    },
    {
      type: "column",
      name: "Volume",
      data: getData(results)?.volume,
      yAxis: 1,
    },
  ],
});

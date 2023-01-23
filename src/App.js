import { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Table from "./components/Table";
import Search from "./components/Search";
import { getData, getOptions, seriesURL } from "./helpers";
import "./App.css";

const App = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  const [results, setResults] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedValue?.label) {
      const fetchData = async () => {
        try {
          const res = await fetch(
            `${seriesURL}&symbol=${selectedValue?.label}`
          );
          const json = await res.json();
          setResults(json);
          setError(null);
        } catch (error) {
          setError(error);
        }
      };

      fetchData();
    }
  }, [selectedValue]);

  const handleChange = (val) => {
    setSelectedValue(val);
  };

  return (
    <div className="App">
      <div className="Select">
        <Search handleChange={handleChange} />
      </div>

      {error && (
        <div>
          Oops! There is a problem with displaying data. Try again later!{" "}
        </div>
      )}

      {selectedValue?.label && !error && (
        <div className="DataWrapper">
          <div className="Chart">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"stockChart"}
              options={getOptions(selectedValue, results)}
            />
          </div>
          <Table
            rows={getData(results)?.rows}
            title={`${selectedValue?.label} stock price table`}
          />
        </div>
      )}
    </div>
  );
};

export default App;

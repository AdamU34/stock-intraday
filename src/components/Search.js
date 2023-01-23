import AsyncSelect from "react-select/async";
import { searchURL } from "../helpers";

const Search = ({ handleChange }) => {
  const loadOptions = (inputValue) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(makeSearch(inputValue));
      }, 2000);
    });
  };

  const makeSearch = async (inputValue) => {
    try {
      const res = await fetch(`${searchURL}&keywords=${inputValue}`);
      const json = await res.json();
      return json?.bestMatches?.map((el) => ({
        value: el?.["1. symbol"],
        label: el?.["1. symbol"],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      onChange={handleChange}
      isDisabled={false}
      isLoading={false}
      isClearable={true}
    />
  );
};

export default Search;

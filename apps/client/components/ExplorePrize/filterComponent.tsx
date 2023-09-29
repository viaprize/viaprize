import { MultiSelect, Select } from "@mantine/core";
import { useState } from "react";

function Filter() {
  const [proficiencyData, setProficiencyData] = useState([
    { value: "1", label: "Programming" },
    { value: "2", label: "Python" },
    { value: "3", label: "JavaScript" },
    { value: "4", label: "Writing" },
    { value: "5", label: "Design" },
    { value: "6", label: "Translation" },
    { value: "7", label: "Research" },
    { value: "8", label: "Real estate" },
    { value: "9", label: "Apps" },
    { value: "10", label: "Hardware" },
    { value: "11", label: "Art" },
    { value: "12", label: "Meta" },
    { value: "13", label: "AI" },
  ]);

  const [prioritiesData, setPrioritiesData] = useState([
    { value: "1", label: "Climate Change" },
    { value: "2", label: "Network Civilizations" },
    { value: "3", label: "Open-Source" },
    { value: "4", label: "Community Coordination" },
    { value: "5", label: "Health" },
    { value: "6", label: "Education" },
  ]);

  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <MultiSelect
        creatable
        data={proficiencyData}
        getCreateLabel={(query) => `+ Create ${query}`}
        label="Proficiency"
        maw="300px"
        onCreate={(query) => {
          const item = { value: query, label: query };
          setProficiencyData((current) => [...current, item]);
          return item;
        }}
        placeholder="Select items"
        searchable
      />
      <MultiSelect
        creatable
        data={prioritiesData}
        getCreateLabel={(query) => `+ Create ${query}`}
        label="Priorities"
        maw="300px"
        onCreate={(query) => {
          const item = { value: query, label: query };
          setPrioritiesData((current) => [...current, item]);
          return item;
        }}
        placeholder="Select items"
        searchable
      />
      <Select
        data={["Data", "Price"]}
        label="Sort By:"
        nothingFound="No options"
        onSearchChange={setSearchValue}
        placeholder="sort by"
        searchValue={searchValue}
        searchable
      />
    </>
  );
}

export default Filter;

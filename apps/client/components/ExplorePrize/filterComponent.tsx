import { useState } from "react";
import { MultiSelect, Select } from "@mantine/core";

const Filter = () => {
  const [proficiencydata, setProficiencyData] = useState([
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

  const [prioritiesdata, setPrioritiesData] = useState([
    { value: "1", label: "Climate Change" },
    { value: "2", label: "Network Civilizations" },
    { value: "3", label: "Open-Source" },
    { value: "4", label: "Community Coordination" },
    { value: "5", label: "Health" },
    { value: "6", label: "Education" },
  ]);

  const [searchValue, onSearchChange] = useState("");

  return (
    <>
      <MultiSelect
        label="Proficiency"
        maw={"300px"}
        data={proficiencydata}
        placeholder="Select items"
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setProficiencyData((current) => [...current, item]);
          return item;
        }}
      />
      <MultiSelect
        maw={"300px"}
        label="Priorities"
        data={prioritiesdata}
        placeholder="Select items"
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setPrioritiesData((current) => [...current, item]);
          return item;
        }}
      />
      <Select
        label="Sort By:"
        placeholder="sort by"
        searchable
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        nothingFound="No options"
        data={["Data", "Price"]}
      />
    </>
  );
};

export default Filter;

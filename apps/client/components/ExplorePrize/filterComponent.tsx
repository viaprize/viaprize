import {
  Box,
  Checkbox,
  Group,
  RangeSlider,
  Select,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import {
  IconCoin,
  IconCurrencyDollar,
  
} from "@tabler/icons-react";
import { useState } from "react";

function toTuple(arr: number[]): [number, number] {
  return [arr[0], arr[1]];
}

function Filter() {
  // const proficiencyOptions = [
  //   { value: "1", label: "Programming" },
  //   { value: "2", label: "Python" },
  //   { value: "3", label: "JavaScript" },
  //   { value: "4", label: "Writing" },
  //   { value: "5", label: "Design" },
  //   { value: "6", label: "Translation" },
  //   { value: "7", label: "Research" },
  //   { value: "8", label: "Real estate" },
  //   { value: "9", label: "Apps" },
  //   { value: "10", label: "Hardware" },
  //   { value: "11", label: "Art" },
  //   { value: "12", label: "Meta" },
  //   { value: "13", label: "AI" },
  // ];

  // const priorityOptions = [
  //   { value: "1", label: "Climate Change" },
  //   { value: "2", label: "Network Civilizations" },
  //   { value: "3", label: "Open-Source" },
  //   { value: "4", label: "Community Coordination" },
  //   { value: "5", label: "Health" },
  //   { value: "6", label: "Education" },
  // ];

  // const [searchValue, setSearchValue] = useState("");
  const [rangeValues, setRangeValues] = useState([0, 500]);

  return (
    <Box maw={400} mx="auto">
      <Text>Price range ($)</Text>
      <RangeSlider
        mt="xl"
        styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
        color="blue"
        label={null}
        defaultValue={toTuple(rangeValues)}
        thumbSize={26}
        thumbChildren={[
          <IconCurrencyDollar size="1rem" key="1" />,
          <IconCoin size="1rem" key="2" />,
        ]}
        onChange={setRangeValues}
      />
      <Group position="apart">
        <Box my="md" styles={{}}>

          <b>{rangeValues[0]}</b>
        </Box>
        <Box mt="md">
          <b>{rangeValues[1]}</b>
        </Box>
      </Group>
      <Select
        mb="md"
        label="Categories"
        placeholder="Pick value"
        data={["Proficiency", "Priorities"]}
        defaultValue="Proficiency"
        allowDeselect={false}
      />
      <Checkbox.Group
        defaultValue={["react"]}
        label="Sub Categories"
        // onChange={() => {}}


      >
        <Stack mt="xs">
          <Checkbox value="react" label="React" />
          <Checkbox value="svelte" label="Svelte" />
          <Checkbox value="ng" label="Angular" />
          <Checkbox value="vue" label="Vue" />
        </Stack>
      </Checkbox.Group>
    </Box>
  );
}

export default Filter;

// import {
//   Box,
//   Checkbox,
//   Group,
//   RangeSlider,
//   Select,
//   Stack,
//   Text,
//   rem,
// } from "@mantine/core";
// import { IconCoin, IconCurrencyDollar } from "@tabler/icons-react";
// import Link from "next/link";
// import { useState } from "react";
// const categoryOptions = ["Proficiency", "Priorities"];
//   const proficiencyOptions = [
//      "Programming",
//       "Python" ,
//      "JavaScript" ,
//       "Writing" ,
//      "Design" ,
//      "Translation" ,
//       "Research" ,
//      "Real estate" ,
//       "Apps" ,
//     "Hardware" ,
//       "Art" ,
//       "Meta" ,
//       "AI"
//   ];

//   const priorityOptions = [
//     "Climate Change" ,
//      "Network Civilizations" ,
//      "Open-Source" ,
//     "Community Coordination" ,
//       "Health" ,
//      "Education"

//   ];

// function toTuple(arr: number[]): [number, number] {
//   return [arr[0], arr[1]];
// }

// function Filter({
//   searchParams,
// }: {
//   searchParams: Record<string, string | string[] | undefined>;
// }) {

//   // const [searchValue, setSearchValue] = useState("");
//   const [rangeValues, setRangeValues] = useState([0, 500]);
//   const [selectedCategory, setSelectedCategory] = useState("Proficiency");
//   const options = selectedCategory === "Proficiency" ? proficiencyOptions : priorityOptions;
//   const category=(searchParams.category || "Proficiency") as string;
//   const subCategory=(searchParams.subCategory || "Programming") as string;

//   return (
//     <Box maw={400} mx="auto">
//       <Text>Price range ($)</Text>
//       <RangeSlider
//         mt="xl"
//         styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
//         color="blue"
//         label={null}
//         defaultValue={toTuple(rangeValues)}
//         thumbSize={26}
//         thumbChildren={[
//           <IconCurrencyDollar size="1rem" key="1" />,
//           <IconCoin size="1rem" key="2" />,
//         ]}
//         onChange={setRangeValues}
//       />
//       <Group position="apart">
//         <Box my="md" styles={{}}>
//           <b>{rangeValues[0]}</b>
//         </Box>
//         <Box mt="md">
//           <b>{rangeValues[1]}</b>
//         </Box>
//       </Group>
//        <Link

//                     href={`?${new URLSearchParams({
//                       category=category,z

//                     })}`}>
//       <Select
//         mb="md"
//         label="Categories"
//         placeholder="Pick value"
//         data={categoryOptions}
//         defaultValue="Proficiency"
//         allowDeselect={false}

//       />
//       </Link>

//       <Checkbox.Group
//         defaultValue={[]}
//         label="Sub Categories"
//         // onChange={() => {}}
//       >
//         <Stack mt="xs">
//        {options.map((option, index) => (
//   <Link
//     key={index}
//     href={`?${new URLSearchParams({
//       subCategory: subCategory,
//     })}`}
//   >
//     <Checkbox key={option} value={option} label={option} />
//   </Link>
// ))}
//         </Stack>
//       </Checkbox.Group>

//     </Box>
//   );
// }

// export default Filter;

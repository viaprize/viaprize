import { Group, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export function SearchFilters() {
  return (
    <div className="p-5">
      <Text size="25px" weight={500}>
        Explore Prizes
      </Text>
      <Text size="sm" weight={300}>
        you can explore prizes and work on them
      </Text>
      <Group mb="xs" mt="md" position="apart">
        <TextInput
          icon={<IconSearch size="1rem" />}
          placeholder="Search"
          style={{ width: "500px" }}
        />
        {/* <Flex  gap='md'>
    <Filter />
    </Flex> */}
      </Group>
    </div>
  );
}

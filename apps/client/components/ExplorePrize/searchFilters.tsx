import { Button, Drawer, Group, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import Filter from "./filterComponent";
// import Filter from "./filterComponent";

export function SearchFilters() {
  const [opened, { open, close }] = useDisclosure(false);
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
        <Group position="right">
          <Button onClick={open}>Filter</Button>
          <Button>Sort</Button>
        </Group>
      </Group>
      <Drawer opened={opened} onClose={close} title="Filters" position="right">
        <Filter />
      </Drawer>
    </div>
  );
}

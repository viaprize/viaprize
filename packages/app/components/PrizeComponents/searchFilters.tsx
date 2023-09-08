import { TextInput ,Text, Button, Group, Flex} from "@mantine/core"
import { IconChevronDown, IconSearch } from "@tabler/icons-react"
import Filter from "./filterComponent"


export const SearchFilters = () => {
  return (
    <div className="p-5">
        <Text size='25px' weight={500}>Explore Prizes</Text>
        <Text size='sm' weight={300}>you can explore prizes and work on them</Text>
        <Group position="apart" mt="md" mb="xs">
        <TextInput
        style={{ width: '500px' }}
      placeholder="Search"
      icon={<IconSearch size="1rem" />}
    />
    <Flex  gap='md'>
    {/* <Button color='dark'>
        filter
    </Button> */}
    <Filter />
    <Button color="dark" >
        sort by <IconChevronDown/>
    </Button>
    </Flex>
    </Group>

    </div>
  )
}

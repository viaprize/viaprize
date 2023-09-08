import { TextInput ,Text, Button, Group, Flex} from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"


export const SearchFilters = () => {
  return (
    <div>
        <Text size='30px'>Explore Prizes</Text>
        <Text size='sm' weight={300}>you can explore prizes and work on them</Text>
        <Group position="apart" mt="md" mb="xs">
        <TextInput
      placeholder="Search"
      icon={<IconSearch size="1rem" />}
    />
    <Flex>
    <Button>
        filter
    </Button>
    <Button>
        filter
    </Button>
    </Flex>
    </Group>

    </div>
  )
}

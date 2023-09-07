import PrizeForm from '@/components/Prize/Prize';
import { Box, Tabs, Text } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';

const Prize = () => {
  return (
    <Box>
          <Text sx={{ fontSize: "2rem", fontWeight: "bold", padding:"40px" }}>Submit Your Prize Here</Text>

        <Tabs variant="pills" radius="md"  defaultValue="gallery">
        <Tabs.List position='center' display={"flex"} sx={{
            justifyContent:"space-evenly"
        }} mx={"xl"}>
            <Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}>Prize</Tabs.Tab>
            <Tabs.Tab value="messages" icon={<IconMessageCircle size="0.8rem" />}>About</Tabs.Tab>
            <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>Don't Know</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery" p={"xl"}>
            <PrizeForm />
        </Tabs.Panel>

        <Tabs.Panel value="messages" >
            Messages tab content
        </Tabs.Panel>

        <Tabs.Panel value="settings" >
            Settings tab content
        </Tabs.Panel>
        </Tabs>
        </Box>
  );
}

export default Prize;
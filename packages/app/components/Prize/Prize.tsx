import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box } from '@mantine/core';

const PrizeForm = () => {
  const form = useForm({
    initialValues: {
      Total_Funds: '',
      Submission_Time: '',
      Voting_Time:'',
      Admins:'',
      Proposser_Address:'',
      Description:''
    },
  });

  return (
    <Box maw={320} mx="auto">
      <TextInput label="Total_Funds" placeholder="total funds in ETH" {...form.getInputProps('Total_Funds')} />
      <TextInput mt="md" label="Submission_Time" placeholder="time in days" {...form.getInputProps('Submission_Time')} />
      <TextInput mt="md" label="Voting_Time" placeholder="time in days" {...form.getInputProps('Voting_Time')} />
      <TextInput mt="md" label="Admins" placeholder="seperate admins addresses by comma" {...form.getInputProps('Admins')} />
      <TextInput mt="md" label="Proposser_Address" placeholder="address" {...form.getInputProps('Proposser_Address')} />
      <TextInput mt="md" label="Description" placeholder="description" {...form.getInputProps('Description')} />

      <Group position="center" mt="xl">
        <Button
          variant="outline"
        >
            Submit Proposal
        </Button>
      </Group>
    </Box>
  );
}

export default PrizeForm;
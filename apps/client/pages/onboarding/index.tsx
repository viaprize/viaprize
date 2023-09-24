import {
  Autocomplete,
  Button,
  Card,
  Center,
  Text,
  TextInput,
} from "@mantine/core";

import useAppUser from "@/context/hooks/useAppUser";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import { toast } from "sonner";

export default function Details() {
  const timeoutRef = useRef<number>(-1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const { createNewUser } = useAppUser();
  const uploadUserMutation = useMutation(createNewUser, {
    onSuccess: () => {
      router
        .push("/prize/explore-prizes")
        .then(console.log)
        .catch(console.error);
    },
  });

  const router = useRouter();
  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setEmail(val);
    setData([]);

    if (val.trim().length === 0 || val.includes("@")) {
      setLoading(false);
    } else {
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);
        setData(
          ["gmail.com", "outlook.com", "yahoo.com"].map(
            (provider) => `${val}@${provider}`,
          ),
        );
      }, 1000);
    }
  };

  const handleLogin = () => {
    try {
      toast.promise(
        uploadUserMutation.mutateAsync({
          email,
          name,
          username,
        }),
        {
          loading: "Logging In",
          success: "Logged In Successfully",
          error: "Error Logging In",
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Center className="h-[80dvh]">
      <Card shadow="md" radius="md" withBorder className="w-[50vw]">
        <Text>Enter your details to get started</Text>
        <TextInput
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value);
          }}
          label="Username"
          placeholder="Enter your username"
          my="sm"
        />
        <TextInput
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
          label="Name"
          placeholder="Enter your name"
          my="sm"
        />
        <Autocomplete
          value={email}
          onChange={handleChange}
          label="Email"
          placeholder="Enter your email"
          data={data}
          my="sm"
        />
        <Button
          onClick={handleLogin}
          loading={loading || uploadUserMutation.isLoading}
          disabled={loading || uploadUserMutation.isLoading}
          color="blue"
          fullWidth
          my="sm"
        >
          Get Started
        </Button>
      </Card>
    </Center>
  );
}

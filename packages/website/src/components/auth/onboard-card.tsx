"use client";
import { containsUppercase } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@viaprize/ui/button";
import { Checkbox } from "@viaprize/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@viaprize/ui/form";
import { Input } from "@viaprize/ui/input";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: "Username must be at least 5 characters",
    })
    .max(40, {
      message: "Username must be at most 40 characters",
    })
    .refine((s) => !s.includes(" "), "No Spaces!")
    .refine((s) => !s.includes("@"), "No @!")
    .refine((s) => containsUppercase(s), "No uppercase"),
  email: z.string().email(),
  name: z.string().max(255),
  shouldGenerateWallet: z.boolean().default(false),
  walletAddress: z.string().optional(),
});

interface OnBoardCardProps {
  name?: string | null;
  email?: string | null;
  walletAddress?: string | null;
}

export default function OnboardCard(props: OnBoardCardProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: props.email || "",
      name: props.name || "",
      shouldGenerateWallet: !props.walletAddress,
      walletAddress: props.walletAddress || "",
    },
  });
  const watchShouldGenerateWallet = form.watch("shouldGenerateWallet");
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-balance text-muted-foreground">Onboard User</p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Username" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your unique name on the platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Name"
                            disabled={!!props.name}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your unique name on the platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Email"
                            disabled={!!props.email}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your unique name on the platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shouldGenerateWallet"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Generate Wallet Address if you are new to crypto
                          </FormLabel>
                          <FormDescription>
                            Warning: This will be a custodial wallet generated
                            by the platform
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  {!watchShouldGenerateWallet && (
                    <FormField
                      control={form.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wallet Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Wallet Address"
                              disabled={!!props.email}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is an evm wallet address that starts with 0x
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </form>
              </Form>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Change your mind ? Click here to log out
            <Button
              variant={"link"}
              onClick={async () => {
                await signOut();
              }}
              className="underline"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

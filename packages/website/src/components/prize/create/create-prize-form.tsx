"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/trpc/react";
import { cn } from "@viaprize/ui";
import { Button } from "@viaprize/ui/button";
import { Calendar } from "@viaprize/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@viaprize/ui/form";
import { Input } from "@viaprize/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@viaprize/ui/popover";
import { Textarea } from "@viaprize/ui/textarea";

const formSchema = z.object({
  image: z.instanceof(File).refine((file) => file.size <= 5000000, {
    message: "Image must be less than 5MB",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  submissionStartDate: z.date({
    required_error: "Submission start date is required.",
  }),
  submissionDuration: z.number().min(1, {
    message: "Submission duration must be at least 1 minute.",
  }),
  votingStartDate: z.date({
    required_error: "Voting start date is required.",
  }),
  votingDuration: z.number().min(1, {
    message: "Voting duration must be at least 1 minute.",
  }),
});
interface CreatePrizeFormProps {
  imageUploadUrl: string;
}

export const CreatePrizeForm: React.FC<CreatePrizeFormProps> = ({
  imageUploadUrl,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      submissionDuration: 60,
      votingDuration: 60,
    },
  });

  const mutation = api.prizes.createPrize.useMutation({
    onSuccess() {
      // Show success message
      console.log("Success");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.image);
    console.log(values.image.size);
    console.log(values.image);

    console.log(imageUploadUrl, "imageUploadUrl");
    const image = await fetch(imageUploadUrl, {
      body: values.image,
      method: "PUT",
      headers: {
        "Content-Type": values.image.type,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          values.image.name
        )}"`,
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!image.ok) {
      form.setError("image", {
        message: "Failed to upload image",
      });
      return;
    }
    const extractedUrl = `${new URL(imageUploadUrl).origin}${
      new URL(imageUploadUrl).pathname
    }`;
    await mutation.mutateAsync({
      title: values.title,
      description: values.description,
      submissionStartDate: values.submissionStartDate.toISOString(),
      submissionDuration: values.submissionDuration,
      votingStartDate: values.votingStartDate.toISOString(),
      votingDuration: values.votingDuration,
      imageUrl: extractedUrl,
    });

    // Here you would typically send the form data to your backend
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" h-full">
        <Button type="submit">Submit</Button>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contest Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </FormControl>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 max-w-xs rounded"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter contest title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter contest description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="submissionStartDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Submission Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="submissionDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submission Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="votingStartDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Voting Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="votingDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voting Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

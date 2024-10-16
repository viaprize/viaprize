import type { FileWithPreview } from '@/components/ui/image-cropper'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@viaprize/ui/form'
import { Input } from '@viaprize/ui/input'
import { Textarea } from '@viaprize/ui/textarea'
import React, { useEffect } from 'react'
import type { FileWithPath } from 'react-dropzone'
import type { UseFormReturn } from 'react-hook-form'
import type { FormValues } from './form-schema'
import ImageCropperUpload from './image-ui/image-picker'

export function TitleDescriptionStep({
  form,
}: {
  form: UseFormReturn<FormValues>
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fullDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Description</FormLabel>
            <FormControl>
              <Textarea {...field} className="min-h-[400px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="imageLocalUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload An Image</FormLabel>
            <FormControl>
              <ImageCropperUpload
                onImageChange={(file) => {
                  if (!file) {
                    return
                  }
                  form.setValue('imageLocalUrl', file)
                }}
                image={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

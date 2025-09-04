"use client"

import type { UseFormReturn } from "react-hook-form"
import { KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { PasswordChangeValues } from "@/lib/validations/settings"

interface PasswordFormProps {
  form: UseFormReturn<PasswordChangeValues>
  onSubmit: (values: PasswordChangeValues) => Promise<void>
  isSubmitting: boolean
}

export function PasswordForm({ form, onSubmit, isSubmitting }: PasswordFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>Updating Password...</>
          ) : (
            <>
              <KeyRound className="mr-2 h-4 w-4" />
              Change Password
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMemberAPI } from "@/services2/operations/auth";

interface MemberFormData {
  email: string;
  name: string;
  phone?: string;
  password: string;
  role?: string;
  isOrder?: boolean;
  isProduct?: boolean;
}

const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().default("member"),
  isOrder: z.boolean().default(false),
  isProduct: z.boolean().default(false),
});



 
const AddMember: React.FC<{ setIsMemberOpen: (open: boolean) => void ,fetchMembers: () => void }> = ({
  setIsMemberOpen,
  fetchMembers
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MemberFormData>({
    resolver: zodResolver(schema),
  });


  




  const onSubmit = async (data: MemberFormData) => {
    await createMemberAPI(data);
    setIsMemberOpen(false);
    fetchMembers()
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            {...register("name")}
            type="name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Phone</label>
          <input
            {...register("phone")}
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-4 flex items-center">
          <label className="mr-2 text-sm font-medium">Order Permission</label>
          <input
            type="checkbox"
            checked={watch("isOrder")}
            onChange={() => setValue("isOrder", !watch("isOrder"))}
            className="h-5 w-5"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="mr-2 text-sm font-medium">Product Permission</label>
          <input
            type="checkbox"
            checked={watch("isProduct")}
            onChange={() => setValue("isProduct", !watch("isProduct"))}
            className="h-5 w-5"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Member
        </button>
      </form>
    </div>
  );
};

export default AddMember;

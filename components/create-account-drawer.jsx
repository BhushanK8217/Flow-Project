'use client';
import React, { useEffect, useState } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle,DrawerClose } from './ui/drawer';
import { useForm } from 'react-hook-form';
import { accountSchema } from '@/app/lib/schema';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Button } from "@/components/ui/button";
import useFetch from '@/hooks/use-fetch';
import { createAccount } from '@/actions/dashboard';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";


const CreateAccountDrawer = ({children}) => {
    const [open,setOpen]=useState(false);

    const {register,
         handleSubmit ,
          formState:{errors},
          setValue,
          watch,
          reset} = useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name:"",
            type:"CURRENT",
            balance:"",
            isDefault:false,
        }
    })

    const {data: newAccount,error,fn:createAccountfn,loading: createAccountLoading}=useFetch(createAccount)

    useEffect(() => {
      if (newAccount) {
        toast.success("Account created successfully");
        reset();
        setOpen(false);
      }
    }, [newAccount, reset]);
  
    useEffect(() => {
      if (error) {
        toast.error(error.message || "Failed to create account");
      }
    }, [error]);

    const onSubmit = async(data)=>{
      await createAccountfn(data);
    }

  return (
    <Drawer open={open} onOpenChange={setOpen}> 
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
    </DrawerHeader>

    <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-base font-medium cursor-pointer"
                >
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type='submit' className='flex-1' disabled={createAccountLoading}>
                {createAccountLoading ? (
                  <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/>creating...
                  </>
                ):(
                  "Create Account"
                )
                }
              </Button>
            </div>
        </form>
    </div>
    
  </DrawerContent>
</Drawer>

  )
}

export default CreateAccountDrawer
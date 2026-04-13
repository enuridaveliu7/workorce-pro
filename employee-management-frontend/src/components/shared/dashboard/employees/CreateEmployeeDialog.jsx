import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { error: "Username must have at least 2 characters." }),
  email: z.string().min(2, { error: "Invalid email address." }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters." }),
});

const CreateEmployeeDialog = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  function onSubmit(data) {
    console.log(data);
    toast.success("Success", {
      description: "Employee registered successfully",
    });
  }
  return (
    <Dialog>
      <form id="employee-form" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create new Employee
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new Employee</DialogTitle>
            <DialogDescription>
              Provide employee details that you want to create.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="employee-name">Username</FieldLabel>
                  <Input
                    {...field}
                    id="employee-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="UserName"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="employee-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="employee-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="employee-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="employee-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="employee-form">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default CreateEmployeeDialog;

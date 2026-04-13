import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Department name must be at least 2 characters long " }),
});
const DepartmentCard = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (data) => {
    console.log(data);
    toast.success("Bravo ✅");
  };
  return (
    <Card className={"lg:w-96 w-full"}>
      <CardHeader>
        <CardTitle>Edit Department</CardTitle>
        <CardDescription>Update the department's name</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="department-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="departmenet-form-title">
                    Department Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="department-form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Department Name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="department-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default DepartmentCard;

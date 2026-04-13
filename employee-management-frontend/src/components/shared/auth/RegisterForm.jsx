import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";

const formSchema = z
    .object({
        username: z
            .string()
            .min(2, { message: "Username must be at least 2 characters." }),
        email: z.email({ error: "Please enter a valid email address." }),
        password: z
            .string()
            .min(6, { error: "Password must be at least 6 characters long." }),
        confirmPassword: z
            .string()
            .min(6, { error: "Password must be at least 6 characters long." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Password don't match.",
        path: ["confirmPassword"],
    });

const RegisterForm = () => {
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to register.");
            }

            toast.success("Account Created!", {
                description:
                    "You have been registered successfully. Please log in.",
            });

            navigate("/login");
        } catch (error) {
            toast.error(error.message || "Failed to register.");
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-2">
            <div>
                <h1 className="text-primary font-bold text-2xl mb-1">
                    Create an Account
                </h1>
                <p className="text-muted-foreground">
                    Enter your information below to create your account.
                </p>
            </div>

            <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Username</FieldLabel>
                        <Input
                            {...field}
                            id="form-rhf-demo-title"
                            placeholder="Username..."
                            aria-invalid={fieldState.invalid}
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
                        <FieldLabel>Email</FieldLabel>
                        <Input
                            {...field}
                            id="form-rhf-demo-title"
                            placeholder="Email..."
                            aria-invalid={fieldState.invalid}
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
                        <FieldLabel>Passowrd</FieldLabel>
                        <Input
                            {...field}
                            type="password"
                            placeholder="******"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Confirm Password</FieldLabel>
                        <Input
                            {...field}
                            type="password"
                            placeholder="******"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button type="submit">Register</Button>
        </form>
    );
};

export default RegisterForm;

import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { useNavigate } from "react-router";

const formSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(6, { error: "Password must be at least 6 characters long." }),
});

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const result = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!result.ok) {
                const errorData = await result.json();
                throw new Error(errorData.message || "Failed to log in.");
            }

            const responseData = await result.json();

            localStorage.setItem("token", responseData.token);
            localStorage.setItem("user", JSON.stringify(responseData.user));

            dispatch(login(responseData.user));
            navigate("/overview");
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 space-y-2">
            <div>
                <h1 className="text-primary font-bold text-2xl mb-1">Login</h1>
                <p className="text-muted-foreground">
                    Welcome back, please login to continue.
                </p>
            </div>

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
                            id="form-rhf-demo-title"
                            placeholder="******"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button type="submit">Login</Button>
        </form>
    );
};

export default LoginForm;

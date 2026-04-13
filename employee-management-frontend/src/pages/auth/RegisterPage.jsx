import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Aside from "../../components/shared/auth/Aside";
import RegisterForm from "../../components/shared/auth/RegisterForm";

const RegisterPage = () => {
    return (
        <div className="h-screen md:flex">
            <Aside />
            <div className="flex md:w-1/2 h-screen justify-center py-10 items-center bg-white relative">
                <Button
                    variant="ghost"
                    asChild
                    className="absolute top-10 right-10"
                >
                    <Link to="/login">Login</Link>
                </Button>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;

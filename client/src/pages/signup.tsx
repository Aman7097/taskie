import { z } from "zod";
import Button from "../components/button";
import Input from "../components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegister, googleSignIn } from "../api/axios";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const schema = z
  .object({
    firstName: z
      .string({ required_error: "This field is required" })
      .min(1, "This field is required"),
    lastName: z
      .string({ required_error: "This field is required" })
      .min(1, "This field is required"),
    email: z
      .string({ required_error: "This field is required" })
      .email({ message: "Enter a valid email" })
      .min(1, "This field is required"),
    password: z
      .string({ required_error: "This field is required" })
      .min(6, "Password must be atleast 6 characters"),
    confirmPassword: z
      .string({ required_error: "This field is required" })
      .min(6, "Password must be atleast 6 characters"),
  })
  .refine(
    (data) => {
      if (data.password === data.confirmPassword) return true;
    },
    {
      path: ["password"],
      message: "Password doesn't match",
    }
  );

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log(data, "HEREE");
      const response = await userRegister(data);
      if (response.token) {
        toast.info("Signup successful", { toastId: "alert" });
        sessionStorage.setItem("id", response.user.id);
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await googleSignIn(tokenResponse.access_token);
        if (response.token) {
          toast.info("Signup successful", { toastId: "alert" });
          sessionStorage.setItem("id", response.user.id);
          window.location.href = "/";
        }
        // Handle successful Google sign-in (e.g., redirect to dashboard)
      } catch (error) {
        toast.error("Something went wrong", { toastId: "error" });
        console.error("Error during Google sign-in:", error);
        // Handle Google sign-in error (e.g., show error message to user)
      }
    },
    onError: (errorResponse) => {
      toast.error("Something went wrong", { toastId: "error" });
      console.error("Google Sign-In Error:", errorResponse);
      // Handle Google sign-in error (e.g., show error message to user)
    },
  });
  return (
    <div className="container max-w-[520px] mx-auto my-10 px-2">
      <h1 className="mb-2 text-2xl font-semibold text-primary">Signup</h1>
      <div className="w-full px-4 py-10 border-2 border-opacity-50 rounded-xl border-primary">
        <form className="mb-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("firstName")}
            placeholder="Enter first name"
            error={errors.firstName && errors.firstName.message}
          />
          <Input
            {...register("lastName")}
            placeholder="Enter last name"
            error={errors.lastName && errors.lastName.message}
          />
          <Input
            {...register("email")}
            placeholder="Enter email"
            error={errors.email && errors.email.message}
          />
          <Input
            {...register("password")}
            type="password"
            placeholder="Enter password"
            error={errors.password && errors.password.message}
          />
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="Enter password again"
            error={errors.confirmPassword && errors.confirmPassword.message}
          />
          <Button variant="primary" className="justify-center w-full">
            Signup
          </Button>
        </form>
        <div className="flex flex-col items-center space-y-3">
          <p>
            Already have an account?{" "}
            <a href="/login">
              <span className="text-primary">Login here</span>
            </a>
          </p>
          <Button variant="primary" onClick={() => googleLogin()}>
            Login with <span className="font-semibold">Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;

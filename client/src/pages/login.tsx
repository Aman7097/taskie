import Input from "../components/input";
import Button from "../components/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLogin } from "../api/axios";
import { googleSignIn } from "../api/axios";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const schema = z.object({
  email: z
    .string({ required_error: "This field is required" })
    .email({ message: "Enter a valid email" })
    .min(1, "This field is required"),
  password: z
    .string({ required_error: "This field is required" })
    .min(1, "This field is required"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log(data);
      const response = await userLogin(data);
      console.log(response, "response");
      if (response.message === "Invalid credentials") {
        toast.error("Invalid credentials", { toastId: "alert" });
      }
      if (response.token) {
        toast.info("Login successful", { toastId: "alert" });
        sessionStorage.setItem("id", response.user.id);
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await googleSignIn(tokenResponse.access_token);

        if (response.token) {
          toast.info("Login successful", { toastId: "alert" });
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
      <h1 className="mb-2 text-2xl font-semibold text-primary">Login</h1>
      <div className="w-full px-4 py-10 border-2 border-opacity-50 rounded-xl border-primary">
        <form className="mb-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("email")}
            type="email"
            placeholder="Enter email"
            error={errors.email && errors.email.message}
          />
          <Input
            {...register("password")}
            type="password"
            placeholder="Enter password"
            error={errors.password && errors.password.message}
          />
          <Button
            type="submit"
            variant="primary"
            className="justify-center w-full"
          >
            Login
          </Button>
        </form>
        <div className="flex flex-col items-center space-y-3">
          <p>
            Don't have an account?{" "}
            <a href="/signup">
              <span className="text-primary">Signup here</span>
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

export default Login;

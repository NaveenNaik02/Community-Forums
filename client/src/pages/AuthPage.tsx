import { SignIn, SignUp } from "@clerk/clerk-react";

export const SignInPage = () => (
  <div className="flex justify-center items-center h-screen">
    <SignIn routing="path" path="/sign-in" />
  </div>
);

export const SignUpPage = () => (
  <div className="flex justify-center items-center h-screen">
    <SignUp routing="path" path="/sign-up" />
  </div>
);

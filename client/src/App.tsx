import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      vite app
      <Button>Click me</Button>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </>
  );
}

export default App;

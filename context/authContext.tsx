import { useState, PropsWithChildren, Dispatch, SetStateAction } from "react";
import { useSignUp, useSignIn, useAuth } from "@clerk/clerk-expo";
import { createContext } from "@/utils/context";
import { useStorageState } from "@/utils/useStorageState";

type AuthProps = {
  signIn: (emailAddress: string, password: string) => Promise<boolean | null>;
  signOut: () => void;
  register: (emailAddress: string, password: string) => void;
  verify: (code: string) => Promise<boolean | null>;
  setPendingVerification: Dispatch<SetStateAction<boolean>>;
  session?: string | null;
  isLoading: boolean;
  loading: boolean;
  pendingVerification: boolean;
};

const [useContext, Provider] = createContext<AuthProps>();

export const useSession = useContext;

const SessionProvider = ({ children }: PropsWithChildren) => {
  const { signOut } = useAuth();

  const [[isLoading, session], setSession] = useStorageState("session");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setloading] = useState(false);

  const onSignUp = useSignUp();
  const onSignIn = useSignIn();

  const onRegister = async (emailAddress: string, password: string) => {
    setloading(true);
    if (!onSignUp.isLoaded) {
      return;
    }

    try {
      await onSignUp.signUp.create({
        emailAddress,
        password,
      });

      await onSignUp.signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
      setloading(false);
    } catch (err: any) {
      setloading(false);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerify = async (code: string) => {
    setloading(true);
    if (!onSignUp.isLoaded) {
      return null;
    }

    try {
      const completeSignUp =
        await onSignUp.signUp.attemptEmailAddressVerification({
          code,
        });

      await onSignUp.setActive({ session: completeSignUp.createdSessionId });
      setSession(`${completeSignUp.createdSessionId}`);

      setPendingVerification(false);
      setloading(false);
      return true;
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setloading(false);
      return false;
    }
  };

  const SignIn = async (emailAddress: string, password: string) => {
    setloading(true);
    if (!onSignIn.isLoaded) {
      return false;
    }

    try {
      const completeSignIn = await onSignIn.signIn.create({
        identifier: emailAddress,
        password,
      });

      // This is an important step,
      // This indicates the user is signed in
      await onSignIn.setActive({ session: completeSignIn.createdSessionId });

      setSession(`${completeSignIn.createdSessionId}`);
      setloading(false);
      return true;
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setloading(false);
      return false;
    }
  };

  const SignOut = async () => {
    signOut();
    setSession(null);
  };

  const value = {
    signIn: SignIn,
    signOut: SignOut,
    register: onRegister,
    verify: onVerify,
    session,
    isLoading,
    loading,
    pendingVerification,
    setPendingVerification,
  };

  return <Provider value={value}>{children}</Provider>;
};

export default SessionProvider;

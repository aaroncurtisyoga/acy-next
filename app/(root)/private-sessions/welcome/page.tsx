"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const WelcomePage: FC = () => {
  const router = useRouter();
  const { goToNextStep } = useWizardForm();
  const { isSignedIn, isLoaded } = useAuth();

  // Handle redirects after authentication
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      goToNextStep();
      router.push("/private-sessions/select-package");
    }
  }, [isSignedIn, isLoaded, goToNextStep, router]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-6 tracking-tight text-primary-500">
          Train With Me
        </h1>

        <p className="text-lg mb-6">
          Create or sign up your account to start purchasing private yoga
          sessions.
        </p>

        <p className="text-gray-600 mb-8">
          Private sessions allow me to connect with you on a personal level,
          focusing on your unique needs. Whether we&#39;re working on specific
          postures, meditation, improving movement, or mentoring for teaching,
          my goal is to share everything I&#39;ve learned to help you achieve
          your goals.
        </p>
      </div>

      <div className="border-t border-b py-8 my-8">
        <h2 className="text-xl font-semibold text-center mb-6">
          What to expect:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-500 font-semibold">1</span>
            </div>
            <h3 className="font-medium mb-2">Create Account</h3>
            <p className="text-sm text-gray-600">
              Sign up or sign in to your account
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-500 font-semibold">2</span>
            </div>
            <h3 className="font-medium mb-2">Select Package</h3>
            <p className="text-sm text-gray-600">
              Choose the session that fits your needs
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-500 font-semibold">3</span>
            </div>
            <h3 className="font-medium mb-2">Complete Payment</h3>
            <p className="text-sm text-gray-600">
              Secure checkout with instant confirmation
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[440px] mx-auto mt-10 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-4 text-center">
            Sign In or Create Account
          </h3>
          {/* Embedded Clerk SignIn component */}
          <SignIn
            routing="path"
            path="/private-sessions/welcome"
            signUpUrl="/private-sessions/welcome"
            // Falls back to this page, then handle redirect via useEffect
            fallbackRedirectUrl="/private-sessions/welcome"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none p-0",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

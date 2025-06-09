import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Shield } from "lucide-react";

const PhoneAuth = () => {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleSendCode = () => {
    e.preventDefault();
    console.log("Sending code to:", phoneNumber);
    // Add phone verification logic here
    setStep("verification");
  };

  const handleVerifyCode = () => {
    e.preventDefault();
    console.log("Verifying code:", verificationCode);
    // Add code verification logic here
  };

  if (step === "verification") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Verification Code
          </h3>
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit code to {phoneNumber}
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Enter Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="h-12 rounded-xl border-border focus:border-primary text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Verify Code
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <button
                type="button"
                onClick={handleSendCode}
                className="text-primary hover:underline"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-primary hover:underline"
              >
                Change Number
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Phone Verification
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your phone number to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSendCode} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
              +1
            </div>
            <Phone className="absolute left-8 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-16 h-12 rounded-xl border-border focus:border-primary"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Standard messaging rates may apply
          </p>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Send Verification Code
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-xl border-border hover:bg-muted"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.064 7.51A9.996 9.996 0 0112 2c2.695 0 4.959.99 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 001.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 012 12c0-1.614.386-3.14 1.064-4.49z" />
          </svg>
          Continue with Google
        </Button>
      </form>
    </div>
  );
};

export default PhoneAuth;

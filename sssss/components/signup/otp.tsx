"use client";

import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"; // Import your existing components

export default function Otp() {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)} // This will directly update the state with the OTP value
      >
        <InputOTPGroup>
          {/* Define 6 slots for OTP input */}
          {[...Array(6)].map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {/* Displaying the current OTP value */}
      <div className="text-center text-sm">{value}</div>
    </div>
  );
}

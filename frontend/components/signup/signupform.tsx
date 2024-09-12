'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import { FormField } from "./formfield";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import axios from "axios";
import { PasswordInput } from "../ui/passwordinput";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [otp, setOtp] = useState(""); // Separate state for OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent state
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification status

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Handle form submission (registration)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isOtpSent) {
      // Registration request
      try {
        const response = await axios.post("http://localhost:8080/api/auth/register", formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setIsOtpSent(true); // OTP has been sent
      } catch (error) {
        console.error("Error during registration:", error);
      }
    } else {
      // OTP verification request
      try {
        const response = await axios.post("http://localhost:8080/api/auth/verify-otp", {
          username: formData.username,
          otp: otp, // Sending only username and OTP for verification
        });
        if (response.status === 200) {
          setIsOtpVerified(true);
          alert("Signup successful!");
        } else {
          alert("Invalid or expired OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error during OTP verification:", error);
      }
    }
  };

  return (
    <>
      {!isOtpVerified ? (
        <form onSubmit={handleSubmit} className={!isOtpSent ? "grid grid-cols-1 gap-6 md:grid-cols-2" : "flex flex-col items-center justify-center w-full"}> {/* Conditional layout */}
          {/* Registration Fields */}
          {!isOtpSent ? (
            <>
              <FormField id="fName" label="First Name" type="text" value={formData.fName} onChange={handleChange} />
              <FormField id="lName" label="Last Name" type="text" value={formData.lName} onChange={handleChange} />
              <FormField id="username" label="Username" type="text" value={formData.username} onChange={handleChange} />
              <FormField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
              <PasswordInput id="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
              <PasswordInput id="cpassword" label="Confirm Password" value={formData.cpassword} onChange={handleChange} />
              <div className="col-span-1 md:col-span-2">
                <Button type="submit" className="w-full">Create Account</Button>
              </div>
            </>
          ) : (
            <>
              {/* OTP Input Section */}
              <div className="space-y-2 flex flex-col w-full items-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)} // Handle OTP input change
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <div className="w-full max-w-xs">
                  <Button type="submit" className="w-full">Verify OTP</Button>
                </div>
              </div>
            </>
          )}
        </form>
      ) : (
        <p className="text-center text-green-600">Signup successful! You can now log in.</p>
      )}
    </>
  );
}

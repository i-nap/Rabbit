import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/passwordinput";
import { PhoneInput } from "../ui/phoneinput";
import { FormField } from "./formfield";


export default function SignupForm() {
  return (
    <>
      <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField id="fName" label="First Name" type="text" />

        <FormField id="lName" label="Last Name" type="text" />

        <FormField id="email" label="Email" type="email" />

        <PhoneInput id="phone" label="Phone" />

        <FormField id="password" label="Password" type="password" />

        <PasswordInput id="cpassword" label="Confirm Password"/>
        <div className="col-span-1 md:col-span-2 space-y-[1rem]">
          <div className="flex items-start">
            <Checkbox id="marketing" />
            <Label htmlFor="marketing" className="ml-2">
              Yes, I want to receive emails.
            </Label>
          </div>
          <div className="flex items-start mt-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="ml-2">
              I agree to all the{" "}
              <a href="/terms" className="underline text-blue-600">
                Terms
              </a>
              ,{" "}
              <a href="/privacy" className="underline text-blue-600">
                Privacy Policy
              </a>
              , and{" "}
              <a href="/fees" className="underline text-blue-600">
                Fees
              </a>
              .
            </Label>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </div>

        <div className="col-span-1 md:col-span-2 text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="underline text-blue-600">
              Log in
            </a>
          </p>
        </div>


      </form>
    </>
  );
}

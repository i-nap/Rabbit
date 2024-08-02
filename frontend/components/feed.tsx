import { ComboBoxResponsive } from "./ui/combobox-feed";
import { Button } from "@/components/ui/button";
import { CirclePlus, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ComboBoxResponsiveCreate } from "./ui/combobox-createapost";


export default function Feed() {
  return (
    <>
      <div className="pt-32 flex flex-col w-full h-full ">
        <div className="flex w-full space-x-4 items-center justify-between">
          <h1 className="text-3xl font-head  m-0 p-0">Popular</h1>
          <div className="flex items-center">
            <span className="font-lato mr-4">Popular in:</span>
            <ComboBoxResponsive />
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <Button className="ml-6">
                    <CirclePlus className="h-4 w-4" />{" "}
                    <span className="ml-1">Create</span>
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-head">Create Post</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 w-full h-ful">
                    <ComboBoxResponsiveCreate/>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export { Feed };

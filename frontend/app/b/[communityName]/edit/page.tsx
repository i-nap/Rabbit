'use client'

import SideBarRight from "@/components/sidebar-right";
import SideBarLeft from "@/components/sidebar-left";
import EditCommunity from "@/components/b/edit";
export default function Home() {
  return (
    <div className="flex w-full h-screen">
      <div className="w-[18%] h-full fixed left-0 top-0">
        <SideBarLeft />
      </div>
      <div className="pt-32 w-[64%] ml-[18%] mr-[18%] p-[3rem]">
        <EditCommunity />
      </div>
      <div className="w-[18%] h-full fixed right-0 top-0">
        <SideBarRight />
      </div>
    </div>
  );
}

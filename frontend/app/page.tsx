import SideBarRight from "@/components/sidebar-right";
import { Feed } from "../components/feed";
import SideBarLeft from "../components/sidebar-left";
import SideBar from "../components/sidebar-left";
export default function Home() {
  return (
    <div className="flex w-full h-screen">
      <div className="w-[18%] h-full fixed left-0 top-0">
        <SideBarLeft />
      </div>
      <div className="w-[64%] ml-[18%] mr-[18%] px-[3rem]">
        <Feed />
      </div>
      <div className="w-[18%] h-full fixed right-0 top-0 border-l">
        <SideBarRight />
      </div>
    </div>
  );
}

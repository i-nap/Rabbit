import { Feed } from "../components/feed";
import LeftSide from '../components/leftSide';
export default function Home() {
  return (
    <div className="flex w-full h-screen">
      <div className="w-[18%] h-full fixed left-0 top-0">
        <LeftSide />
      </div>
      <div className="w-[64%] ml-[18%] mr-[18%] px-[3rem]">
        <Feed />
      </div>
      <div className="w-[18%] h-full fixed right-0 top-0 border-l">
        
      </div>
    </div>
  );
}

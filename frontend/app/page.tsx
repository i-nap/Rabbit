import { Feed } from "../components/feed";
import LeftSide from '../components/leftSide';
export default function Home() {
  return (
    <div className="flex w-full h-screen">
      <div className="w-[20%] h-full fixed left-0 top-0">
        <LeftSide />
      </div>
      <div className="w-[60%] ml-[20%] mr-[20%]">
        <Feed />
      </div>
      <div className="w-[20%] h-full fixed right-0 top-0">
        gand
      </div>
    </div>
  );
}

import RightSide from '@/components/signup/rightside';
import LeftSide from '../../components/signup/leftside';
export default function SignupPage() {
  return (
    <>
      <div className="flex w-full min-h-screen">
        <div className="w-[40%] bg-black pt-[3rem]"><LeftSide/></div>
        <div className="w-[60%] flex flex-col justify-center items-center pt-[3rem]"><RightSide/></div>
      </div>
    </>
  );
}

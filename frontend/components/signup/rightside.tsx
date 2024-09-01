import SignupForm from './signupform';

export default function RightSide() {
    return (
        <>
            <div className="p-4 md:p-8 lg:p-12">
                <h2 className="mb-6 text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">Register</h2>
                <div className="max-w-lg mb-6">
                    <h3 className="text-xl font-medium text-gray-800">Lorem ipsum dolor sit amet.</h3>
                    <span className='text-gray-500'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </span>
                </div>
                <div className='w-full max-w-lg'>
                    <SignupForm />
                </div>
            </div>
        </>
    );
}

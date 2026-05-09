export const ErrorPage: React.FC = () => {
    return (
        <div className="relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
            <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
            </div>
            <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
            </div>


            <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
                <h1 className="mb-8 text-title-md font-bold text-black dark:text-white/90 xl:text-title-2xl">
                    Not Found
                </h1>
{/* 
                <img src="../../assets/error-page/404.svg" alt="404" className="dark:hidden" />
                <img src="src/images/error/404-dark.svg" alt="404" className="hidden dark:block" /> */}

                <p className="mb-6 mt-10 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
                    We can’t seem to find the page you are looking for!
                </p>

                <a href="/" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-black dark:border-gray-700 dark:bg-black dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                    Back to Home Page
                </a>
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-gray-500 dark:text-gray-400">
                © <span id="year">2025</span> - School App
            </p>
        </div>
    )
}
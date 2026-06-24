import Link from 'next/link';
import 'pattern.css/dist/pattern.css';

export default function Home() {
  return (
    <>
      <main className="grid h-screen place-items-center overflow-hidden border-x-[0.39rem] border-y-[2.65rem] border-[#111] bg-milk bg-size-[10px_10px] px-6 py-24 selection:bg-black selection:text-white sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 border-b-[3px] border-b-[#a51f0f] pb-5 text-3xl font-bold tracking-wide text-pencil lg:text-5xl">
            MURASAKI<span className="text-lime-600">.</span>
            <span className="pattern-dots-sm slategray font-noto-serif-sc text-4xl font-medium text-green-600 decoration-black md:text-4xl lg:text-7xl">
              Docs
            </span>
            <span className="tracking-wider"> 文档管理系统</span>
            <span className="text-lime-600">.</span>
          </h1>
          <p className="mt-6 animate-fade-in-delay-5 text-base text-gray-600">
            信息归档 文件管理
          </p>
          <div className="mt-6 flex animate-fade-in-delay-10 items-center justify-center gap-x-5">
            <Link
              href="/login"
              scroll={false}
              className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              登{''} {''}入
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

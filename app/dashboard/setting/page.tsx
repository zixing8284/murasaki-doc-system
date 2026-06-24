export default function SettingPage() {
  return (
    <>
      <section className="h-full w-full">
        <div className="m-auto box-content max-w-file-list md:max-w-file-list-md xl:max-w-screen-xl">
          <div className="pb-[18px] md:pb-[48px] md:pl-file-list-md">
            <h2 className="pb-3 text-[20px] font-extralight leading-[1.3] md:pb-6 md:text-[25px]">
              One 分类
            </h2>
            <ul className="m-0 list-none p-0 md:w-file-list-md xl:w-[1060px]">
              <li className="-mt-[1px] md:flex md:justify-between">
                <button
                  type="button"
                  className="relative block w-full justify-between border-b border-t border-[#1c1d17] py-1 text-[#1c1d17] no-underline before:absolute before:-bottom-[1px] before:-left-[4px] before:-right-[10px] before:-top-[1px] before:bg-[#1c1d17] before:opacity-0 before:transition-opacity before:content-[''] hover:text-white hover:before:opacity-100 hover:before:delay-0 dark:text-white md:flex md:h-[30px] md:w-full md:whitespace-nowrap md:py-0 md:leading-[30px]"
                >
                  <span className="relative md:max-w-[75%] md:overflow-hidden md:text-ellipsis md:whitespace-nowrap">
                    标题记录123 456-4哈-哈哈
                  </span>
                  <span className="relative pl-2 hover:text-white max-md:text-muted-foreground md:max-w-[25%] md:overflow-hidden md:text-ellipsis md:whitespace-nowrap">
                    2024/04/23
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

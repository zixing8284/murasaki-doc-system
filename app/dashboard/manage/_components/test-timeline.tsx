import Link from 'next/link';

export default function Test() {
  return (
    <>
      {/* second */}
      <section className="mx-auto w-full max-w-3xl py-12 md:py-16 lg:py-20">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              The Quantum Computing Timeline
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              A visual history of the key milestones in quantum computing.
            </p>
          </div>
          <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-gray-500/20 dark:after:bg-gray-400/20">
            <div className="grid gap-8">
              <div className="relative grid gap-2 text-sm">
                <div className="absolute left-0 top-1 z-10 aspect-square w-3 translate-x-[-29.5px] rounded-full bg-gray-900 dark:bg-gray-50" />
                <div className="font-medium">
                  March 14, 1879 - Invention of Quantum Computing
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  Scientists at a leading research institution unveil a
                  groundbreaking breakthrough in quantum computing.
                </div>
              </div>
              <div className="relative grid gap-2 text-sm">
                <div className="absolute left-0 top-1 z-10 aspect-square w-3 translate-x-[-29.5px] rounded-full bg-gray-900 dark:bg-gray-50" />
                <div className="font-medium">
                  April 1, 1939 - First Quantum Computer
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  The first quantum computer is built by a team of researchers
                  in a laboratory in the United States.
                </div>
              </div>
              <div className="relative grid gap-2 text-sm">
                <div className="absolute left-0 top-1 z-10 aspect-square w-3 translate-x-[-29.5px] rounded-full bg-gray-900 dark:bg-gray-50" />
                <div className="font-medium">
                  June 12, 1954 - Quantum Computing Research
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  A group of scientists in Europe publish a paper on quantum
                  computing research.
                </div>
              </div>
              <div className="relative grid gap-2 text-sm">
                <div className="absolute left-0 top-1 z-10 aspect-square w-3 translate-x-[-29.5px] rounded-full bg-gray-900 dark:bg-gray-50" />
                <div className="font-medium">
                  December 31, 1979 - Quantum Computing Breakthrough
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  A team of researchers in Asia makes a significant breakthrough
                  in quantum computing.
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="#"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

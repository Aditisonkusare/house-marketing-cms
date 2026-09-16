import Link from "next/link";

export function RegisterCta() {
  return (
    <section className="border-t border-gray-200 bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Stay up to date</h2>
          <p className="mt-1 text-sm text-gray-300">
            Register for updates on new house types, phases, and news.
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
        >
          Register for updates
        </Link>
      </div>
    </section>
  );
}

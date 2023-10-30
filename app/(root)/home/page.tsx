import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function page() {
  return (
    <>
      <section className="mb-6 flex w-full flex-row items-center justify-between">
        <h1 className="text-dark100_light900 text-3xl font-normal">Home</h1>
      </section>
    </>
  );
}

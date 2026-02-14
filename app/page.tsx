import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Local Community Platform
      </h1>
      <p className="mb-8 max-w-lg text-lg text-gray-600">
        Connect with your neighbors, share updates, and participate in local
        activities.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}

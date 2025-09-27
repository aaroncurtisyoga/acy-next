import Link from "next/link";
import { Button } from "@heroui/react";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-foreground-200 dark:text-foreground-800 select-none">
            404
          </h1>
          <div className="relative -mt-8 md:-mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground-900 dark:text-foreground-100">
              Page Not Found
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-foreground-600 dark:text-foreground-400 text-lg mb-8 leading-relaxed max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            as={Link}
            href="/"
            color="primary"
            size="lg"
            startContent={<Home className="w-4 h-4" />}
            className="font-medium min-w-[140px]"
          >
            Home
          </Button>

          <Button
            as={Link}
            href="/"
            variant="bordered"
            size="lg"
            startContent={<Search className="w-4 h-4" />}
            className="font-medium min-w-[140px] border-2"
          >
            View Events
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-divider">
          <p className="text-sm text-foreground-500 dark:text-foreground-400">
            Need help?{" "}
            <Link
              href="mailto:info@acyyoga.com"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

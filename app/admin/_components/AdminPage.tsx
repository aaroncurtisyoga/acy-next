import { FC, ReactNode } from "react";
import { cn } from "@/app/_lib/utils";

interface AdminPageProps {
  title: ReactNode;
  /** Optional supporting line under the title. */
  description?: ReactNode;
  /** Rendered next to the title (e.g. a count badge). */
  badge?: ReactNode;
  /** Rendered on the right of the header (e.g. primary actions). */
  actions?: ReactNode;
  /** "narrow" caps content at max-w-4xl (forms, single-column lists). */
  width?: "default" | "narrow";
  /** Let the content grow to fill the viewport height (used by the calendar). */
  fill?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Shared shell for every admin page. Owns the page's padding, max-width,
 * header, and vertical rhythm so pages line up as you navigate between them.
 */
const AdminPage: FC<AdminPageProps> = ({
  title,
  description,
  badge,
  actions,
  width = "default",
  fill = false,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full p-4 md:p-6",
        width === "narrow" ? "max-w-4xl" : "max-w-screen-2xl",
        fill && "flex flex-1 flex-col",
        className,
      )}
    >
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-3xl uppercase text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {badge}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </header>
      {fill ? <div className="flex flex-1 flex-col">{children}</div> : children}
    </div>
  );
};

export default AdminPage;

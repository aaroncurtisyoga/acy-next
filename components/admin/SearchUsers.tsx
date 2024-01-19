"use client";

import { usePathname, useRouter } from "next/navigation";

const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      {/* Todo: refactor to use shad cn components */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get("search") as string;
          router.push(pathname + "?search=" + queryTerm);
        }}
      >
        <label htmlFor="search">Search for Users</label>
        <input id="search" name="search" type="text" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SearchUsers;

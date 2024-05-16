"use client";
import React, { useEffect, useState } from "react";
import SearchBox from "./search-box";
import { Search } from "lucide-react";

const SearchBoxMenuButton = () => {
  const [searchBoxStatus, setSearchBoxStatus] = useState<boolean>(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setSearchBoxStatus(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <>
      <button
        className="border py-1 px-2 rounded  min-w-64 bg-muted md:flex hidden items-center justify-between"
        onClick={() => setSearchBoxStatus(!searchBoxStatus)}
      >
        <span className="text-muted-foreground text-xs">Search</span>
        <span className="text-muted-foreground text-xs border p-1 rounded bg-background">
          ctrl + k
        </span>
      </button>

      <button
        className="md:hidden block"
        onClick={() => setSearchBoxStatus(!searchBoxStatus)}
      >
        <Search size={18} />
      </button>

      {searchBoxStatus && (
        <SearchBox
          searchBoxStatus={searchBoxStatus}
          setSearchBoxStatus={setSearchBoxStatus}
        />
      )}
    </>
  );
};

export default SearchBoxMenuButton;

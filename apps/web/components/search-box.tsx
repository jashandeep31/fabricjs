"use client";
import {
  useClickAway,
  useDebounce,
  useLockBodyScroll,
} from "@uidotdev/usehooks";
import { Search, StickyNote, X } from "lucide-react";
import Link from "next/link";
import Flexsearch from "flexsearch";
import React, { useEffect, useState } from "react";
import { search_queries } from "@/search_queries";

// Move the search index creation outside the component
const searchIndex = new Flexsearch.Index({
  tokenize: "full",
});

// Add items to the search index
search_queries.forEach((item, index) => {
  searchIndex.add(index, item.name);
});

const SearchBox = ({
  searchBoxStatus,
  setSearchBoxStatus,
}: {
  searchBoxStatus: boolean;
  setSearchBoxStatus: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // handling the click away and the close method using the `escape` key
  const ref = useClickAway<HTMLDivElement>(() => {
    setSearchBoxStatus(false);
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchBoxStatus(false);
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
  useLockBodyScroll();

  // search fucntionality code
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSearchQueries, setFilteredSearchQueries] = useState(
    search_queries.slice(0, 6)
  );
  const debounceSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debounceSearch) {
      const resultsArray = searchIndex.search(searchTerm);
      setFilteredSearchQueries(
        search_queries.filter((item, index) => resultsArray.includes(index))
      );
    }
  }, [debounceSearch]);

  return (
    <div
      className={`bg-black/80 h-screen w-screen fixed top-0 left-0 z-20  items-center justify-center duration-300 ${searchBoxStatus ? "flex" : "hidden"}`}
    >
      <div
        ref={ref}
        className={`rounded-md   md:w-2/3  lg:w-1/3 border bg-background  h-[70%]  md:max-h-[50%] relative flex flex-col ${searchBoxStatus ? "searchbox" : ""}`}
      >
        <div className="flex items-center justify-between gap-2 border-b p-3 ">
          <Search size={18} className="text-muted-foreground" />
          <input
            onChange={(e) =>
              e.target.value === ""
                ? setFilteredSearchQueries(search_queries.slice(0, 6))
                : setSearchTerm(e.target.value)
            }
            autoFocus={true}
            className="w-full bg-transparent border-none  py-1 focus:outline-none px-1"
          />
          <button onClick={() => setSearchBoxStatus(false)}>
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-3 flex-1 overflow-y-auto">
          <p className="px-3 text-sm text-medium text-muted-foreground mb-2">
            Results
          </p>
          {filteredSearchQueries.map((item, index) => (
            <Link
              href="/"
              className="card flex p-3  items-center gap-3  hover:bg-foreground/10 duration-300 rounded "
              key={index}
            >
              <div className="   h-14  flex items-center">
                <StickyNote size={20} className="text-muted-foreground" />
              </div>
              <div className="text-area">
                <h2>{item.name}</h2>
                <p className="text-xs  text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
                  voluptate tempora provident quam maiores fuga id corrupti
                  illum, facilis explicabo. Cum, et ea? Non, explicabo?
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;

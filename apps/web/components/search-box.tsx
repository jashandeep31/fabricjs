"use client";
import {
  useClickAway,
  useDebounce,
  useLockBodyScroll,
} from "@uidotdev/usehooks";
import { Search, StickyNote, X } from "lucide-react";
import Flexsearch from "flexsearch";
import React, { useCallback, useEffect, useState } from "react";
import { search_queries } from "@/search_queries";
import { useRouter } from "next/navigation";

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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSearchQueries, setFilteredSearchQueries] = useState(
    search_queries.slice(0, 6)
  );
  const debounceSearch = useDebounce(searchTerm, 100);

  // handling the click away and the close method using the `escape` key
  const ref = useClickAway<HTMLDivElement>(() => {
    setSearchBoxStatus(false);
  });
  useLockBodyScroll();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchBoxStatus(false);
      } else if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) =>
          prev === filteredSearchQueries.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) =>
          prev === 0 ? filteredSearchQueries.length - 1 : prev - 1
        );
      }
    },
    [filteredSearchQueries.length, setSearchBoxStatus]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // search fucntionality code
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
        className={`rounded-md w-screen  md:w-2/3  lg:w-1/3 border bg-background  h-[70%]  md:max-h-[50%] relative flex flex-col ${searchBoxStatus ? "searchbox" : ""}`}
      >
        <div className="flex items-center justify-between gap-2 border-b p-3 ">
          <Search size={18} className="text-muted-foreground" />
          <form
            action=" "
            onSubmit={(e) => {
              e.preventDefault();
              setSearchBoxStatus(false);
              router.push(filteredSearchQueries[highlightedIndex]?.link || "/");
            }}
            className="flex-1"
          >
            <input
              onChange={(e) =>
                e.target.value === ""
                  ? setFilteredSearchQueries(search_queries.slice(0, 6))
                  : setSearchTerm(e.target.value)
              }
              autoFocus={true}
              className="w-full bg-transparent border-none  py-1 focus:outline-none px-1"
            />
          </form>
          <button
            onClick={() => setSearchBoxStatus(false)}
            className="hover:border-slate-500 rounded hover:bg-slate-50 duration-300 border border-transparent"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-3 flex-1 overflow-y-auto">
          <p className="px-3 text-sm text-medium text-muted-foreground mb-2">
            Results
          </p>
          {filteredSearchQueries.map((item, index) => (
            <button
              onClick={() => {
                router.push(item.link);
                setSearchBoxStatus(false);
              }}
              className={`card flex p-3  items-center gap-3  ${highlightedIndex === index ? "bg-foreground/10" : "hover:bg-foreground/5"} duration-300 rounded  w-full `}
              key={index}
            >
              <div className="h-14  flex items-center">
                <StickyNote size={20} className="text-muted-foreground" />
              </div>
              <div className="text-area w-full text-start">
                <h2>{item.name} </h2>
                <p className="text-xs  text-muted-foreground">{item.link}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;

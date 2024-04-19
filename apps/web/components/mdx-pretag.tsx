"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ClipboardCheck, ClipboardList } from "lucide-react";

const MdxPreTagRenderer = ({
  className,
  __rawString__,
  __output__ = false,
  __title__,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & {
  __rawString__?: string;
  __title__?: string;
  __output__?: boolean;
}) => {
  const [tab, settab] = useState<"code" | "output">("code");
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const copyToClipboardFunction = (code: string) => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 1500);
  };
  return (
    <div className="  overflow-x-auto ">
      <div
        className={`flex items-center ${
          __output__ ? "justify-between" : "justify-end"
        }  mb-2`}
      >
        <div
          className={`overflow-hidden rounded-md bg-muted p-1 mt-6  ${
            !__output__ ? "hidden" : "inline-block"
          } `}
        >
          <button
            onClick={() => settab("code")}
            className={`${
              tab === "code" ? "bg-background" : "bg-muted"
            } rounded-md px-3 py-1 text-sm`}
          >
            Code
          </button>
          <button
            onClick={() => settab("output")}
            className={`${
              tab === "output" ? "bg-background" : "bg-muted"
            } rounded-md px-3 py-1 text-sm`}
          >
            Output
          </button>
        </div>
        <div>
          <button
            className="rounded border bg-transparent p-1 text-muted-foreground hover:bg-secondary"
            onClick={() => copyToClipboardFunction(__rawString__ ?? " ")}
          >
            {hasCopied ? (
              <ClipboardCheck size={16} />
            ) : (
              <ClipboardList size={16} />
            )}
          </button>
        </div>
      </div>
      <div className="rounded-lg border bg-zinc-950 p-1 text-white ">
        <p className=" m-0 p-0 text-center  text-muted-foreground">
          {__title__}
        </p>
        {tab === "code" ? (
          <pre
            className={cn(" max-h-[650px]  rounded-lg p-1 ", className)}
            {...props}
          />
        ) : (
          <div>
            <iframe
              srcDoc={__rawString__}
              className="mt-4 min-h-64 w-full resize-y rounded-md bg-white "
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              Drag from bottom right corner to adjust size
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MdxPreTagRenderer;

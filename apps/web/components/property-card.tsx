"use client";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PropertyCard = ({ property }: any) => {
  const RenderExtendedTable = ({ extendedTable }: any) => {
    return (
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Attribute</TableHead>
            <TableHead className="w-full">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {extendedTable.ExtendedPropertyTableRow.map(
            (row: any, rowIndex: number) => (
              <TableRow key={rowIndex}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="shrink-0">{row.type}</TableCell>
                <TableCell className="shrink-0">{row.attribute}</TableCell>
                <TableCell className="w-full">
                  {row.extendedRow === true
                    ? "Thisisextended"
                    : row.description}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="mt-6 scroll-m-20" id={property.uniqueId}>
      <h3 className="font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
        <Link
          className="inline-flex items-center gap-1 hover:underline duration-300 "
          href={property.currentUrl}
        >
          <ArrowDownRight size={16} />
          <span>{property.name}</span>
        </Link>
      </h3>
      <p className="leading-7  text-sm text-muted-foreground">
        {property.description}
      </p>

      <div className="my-4">
        {property.PropertyTable.map((table: any, index: number) => (
          <Table key={index} className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="">Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Attribute</TableHead>
                <TableHead className="w-full">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.PropertyTableRow.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="shrink-0">{row.type}</TableCell>
                  <TableCell className="shrink-0">{row.attribute}</TableCell>
                  <TableCell className="w-full">
                    {row.extendedRow === true ? (
                      <RenderExtendedTable
                        extendedTable={row.ExtendedPropertyTable}
                        key={rowIndex}
                      />
                    ) : (
                      row.description
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}
      </div>

      <div>
        <Link
          className="text-xs bg-foreground/15  inline-flex items-center gap-1  hover:underline rounded-full px-2 py-1"
          href={property.prevUrl}
        >
          <span>Legacy Docs</span>
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;

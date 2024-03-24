import { Department, FilterBased, Terminal } from "../Domain";
import {
  getCoreRowModel,
  ColumnDef,
  flexRender,
  useReactTable,
  createColumnHelper,
  Cell,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  createLazyFileRoute,
  Link,
  createRoute,
  createFileRoute,
} from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/terminals")({
  component: Terminals,
});

const columnHelper = createColumnHelper<Department[]>();

function useTerminals() {
  return useQuery({
    queryKey: ["terminals"],
    queryFn: async () => {
      const { data } = await axios.get("https://api.sunucu.com/terminals");
      return data;
    },
  });
}

const columns: ColumnDef<Department>[] = [
  {
    header: "TÜM TERMINALLER",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorFn: (cell) => `(${cell.shopCode}) ${cell.depName}`,
        header: "BÖLÜM BAZINDA",
        footer: (info) => info.column.id,
      },
      {
        header: "FILTRE BAZINDA",
        accessorKey: "filterBaseds",
        //accessorFn: (filter)=>{(filter.filterBaseds as FilterBased).filterCode},
        cell: (info) => (
          <>
            {info.cell.getValue().map((filter: FilterBased, i: number) => (
              <Link
                to="/terminal/$terminalId"
                params={{ terminalId: filter.filterCode }}
                key={i}
              >
                <Badge
                  badgeContent={filter.linkCount}
                  color="secondary"
                  sx={{ margin: 1 }}
                >
                  <Button
                    sx={{ borderColor: "grey.500", border: 1 }}
                    className="filter"
                  >
                    {filter.filterCode}
                  </Button>
                </Badge>
              </Link>
            ))}
          </>
        ),
        footer: (info) => info.column.id,
      },
    ],
  },
];

function Terminals() {
  const { status, data, error, isFetching } = useTerminals();
  const [filteredData, setFilteredData] = useState<Department[]>([]);
  useEffect(() => {
    const filteredData: Department[] = [];
    if (Array.isArray(data?.data)) {
      (data?.data as Department[]).forEach(
        ({ depCode, shopCode, depName, filterBaseds }) => {
          const new_filterBaseds: FilterBased[] = (
            filterBaseds as FilterBased[]
          ).map((obj) => {
            const { userDesc, termName, ...rest } = obj; // Destructure the object and exclude userDesc and termName keys
            return rest; // Return the modified object without userDesc and termName
          });
          const obj: Department = {
            depCode,
            shopCode,
            depName,
            filterBaseds: new_filterBaseds,
          };
          filteredData.push(obj);
        }
      );
      setFilteredData(filteredData);
      console.log(filteredData);
    }
  }, [data]);

  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
  });
  if (filteredData.length < 1) return <div>Never mind!</div>;
  return (
    <TableContainer>
      <Table style={{ width: "100%", textAlign: "center" }}>
        <TableHead>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableCell
                  key={header.id}
                  style={{
                    color: "#D32720",
                    textDecoration: "underline",
                    fontWeight: "bold",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

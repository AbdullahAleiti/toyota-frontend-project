import { Link, createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { DefectRecord } from "../Domain";
import { useDebouncedCallback } from 'use-debounce';
import {
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	Row,
	flexRender,
	getSortedRowModel,
	SortingState,
	OnChangeFn,
	getFilteredRowModel,
	CoreInstance
} from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button, Stack, TextField } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export const Route = createFileRoute("/defects/$filterCode")({
	loader: ({ context: { queryClient }, params: { filterCode } }) =>
		queryClient.ensureQueryData({
			queryKey: ["defects", { filterCode }],
			queryFn: () => fetchDefects(filterCode),
		}),
	component: DefectTable,
});

const fetchDefects = async (filterCode: string) => {
	try {
		const { data: defects } = await axios.get<DefectRecord[]>(
			`https://api.sunucu.com/defects/${filterCode}`
		);
		console.log(defects);
		return defects;
	} catch (e) {
		throw new Error("Error");
	}
};

const Control = ({ table }: { table: CoreInstance<DefectRecord> }) => {
	const debounced = useDebouncedCallback(
		(value) => {
			table.getColumn("bodyNo")?.setFilterValue(value)
			console.log("Filtered")
		},
		700
	);
	return (
		<Stack className="pt-4" direction={"row"} spacing={2}>
			<TextField id="outlined-basic" label="Body No" variant="outlined" onChange={(t) => debounced(t.target.value)} />
			<Link to="/terminals">
				<Button variant="outlined">Çıkış</Button>
			</Link>
		</Stack>)
}

function DefectTable() {
	const defects = Route.useLoaderData();
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const [sorting, setSorting] = useState<SortingState>([])

	const columns = useMemo<ColumnDef<DefectRecord>[]>(
		() => [
			{
				accessorKey: "depCode",
				id: "depCode",
				header: "Bildiren",
				size: 90,
			},
			{
				accessorKey: "bodyNo",
				id: "bodyNo",
				header: "Body",
				size: 90,
				filterFn: (row, columnId, filterValue) => {
					return String(row.getValue(columnId)).startsWith(String(filterValue))// true or false based on your custom logic
				},
			},
			{
				accessorKey: "assyNo",
				header: "Assy No",
				size: 110
			},
			{
				accessorKey: "vinNo",
				header: "Vin No",
				size: 170
			},
			{

				accessorKey: "rgbCode",
				header: "Renk",
				cell: (column) => (
					<div>{column.getValue<DefectRecord>().colorExtCode}</div>
				),
			},
			{
				header: "Kaydet",
				cell: ({ row }) => {
					return (<Button className=" h-8" variant="contained" onClick={() => { 
						console.log(row.original.defectId) 
					}}>Kaydet</Button>)
				}
			},
			{
				header: "İşlem",
				cell: ({ row }) => {
					const onEdit = () => {
						console.log("edited ", row.original.defectId)
					}
					const onDelete = () => {
						console.log("deleted ", row.original.defectId)
					}
					return (
						<Stack direction={"row"} spacing={1}>
							<Button className="h-8" color="error" variant="contained" onClick={onEdit}>Güncelle</Button>
							<Button className="h-8" color="error" variant="contained" onClick={onDelete}>Sil</Button>
						</Stack>)
				},
				size: 210
			}
		],
		[]
	);

	const table = useReactTable({
		data: defects,
		columns: columns,
		state: {
			sorting
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const { rows } = table.getRowModel();

	//scroll to top of table when sorting changes
	const handleSortingChange: OnChangeFn<SortingState> = updater => {
		setSorting(updater)
		if (table.getRowModel().rows.length) {
			rowVirtualizer.scrollToIndex?.(0)
		}
	}

	//since this table option is derived from table row model state, we're using the table.setOptions utility
	table.setOptions(prev => ({
		...prev,
		onSortingChange: handleSortingChange,
	}))

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => tableContainerRef.current,
		estimateSize: () => 30,
		measureElement:
			typeof window !== 'undefined' &&
				navigator.userAgent.indexOf('Firefox') === -1
				? element => element?.getBoundingClientRect().height
				: undefined,
		overscan: 20,
	});

	return (
		<>
			<div ref={tableContainerRef} style={{ height: "500px", overflow: "auto" }}>
				{
					<Table stickyHeader style={{ display: 'grid' }}>
						<TableHead style={{
							display: 'grid',
							position: 'sticky',
							top: 0,
							zIndex: 1,
						}}>
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow
									key={headerGroup.id}
									style={{ display: 'flex', width: '100%' }}
								>
									{headerGroup.headers.map(header => {
										return (
											<TableCell
												key={header.id}
												style={{
													display: 'flex',
													width: header.getSize(),
												}}
											>
												<div
													{...{
														className: header.column.getCanSort()
															? 'cursor-pointer select-none'
															: '',
														onClick: header.column.getToggleSortingHandler(),
													}}
													style={{ overflowX: "visible", height: "24px" }}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{{
														asc: '🔼',
														desc: '🔽',
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											</TableCell>
										)
									})}
								</TableRow>
							))}
						</TableHead>
						<TableBody
							style={{
								display: 'grid',
								height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
								position: 'relative', //needed for absolute positioning of rows
							}}
						>
							{rowVirtualizer.getVirtualItems().map(virtualRow => {
								const row = rows[virtualRow.index] as Row<DefectRecord>
								return (
									<TableRow
										data-index={virtualRow.index} //needed for dynamic row height measurement
										ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
										key={row.id}
										style={{
											display: 'flex',
											position: 'absolute',
											transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
											width: '100%',
										}}
									>
										{row.getVisibleCells().map(cell => {
											return (
												<TableCell
													key={cell.id}
													style={{
														display: 'flex',
														width: cell.column.getSize(),
													}}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											)
										})}
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				}
			</div>
			<Control table={table} />
		</>
	);
}
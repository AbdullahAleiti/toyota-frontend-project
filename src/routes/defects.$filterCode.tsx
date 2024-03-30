import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { DefectRecord } from "../Domain";
import {
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	Row,
	flexRender
} from "@tanstack/react-table";
import { useCallback, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button, Stack } from "@mui/material";

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

function DefectTable() {
	const defects = Route.useLoaderData();
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const columns = useMemo<ColumnDef<DefectRecord>[]>(
		() => [
			{
				accessorKey: "depCode",
				header: "Bildiren",
				size: 90
			},
			{
				accessorKey: "bodyNo",
				header: "Body",
				size: 90
			},
			{
				accessorKey: "assyNo",
				header: "Assy No",
				size: 90
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
				cell: ({row}) => {
					return (<Button className=" h-8" variant="contained" onClick={()=>{console.log(row.original.defectId)}}>Kaydet</Button>)
				}
			},
			{
				header: "İşlem",
				cell: ({row})=>{
					const onEdit = ()=>{
						console.log("edited ",row.original.defectId)
					}
					const onDelete = ()=>{
						console.log("deleted ",row.original.defectId)
					}
					return (
						<Stack direction={"row"} spacing={1}>
							<Button className="h-8" color="error" variant="contained" onClick={onEdit}>Güncelle</Button>
							<Button className="h-8" color="error" variant="contained" onClick={onDelete}>Sil</Button>
						</Stack>)
				}
			}
		],
		[]
	);

	const table = useReactTable({
		data: defects,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const { rows } = table.getCoreRowModel();

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => tableContainerRef.current,
		estimateSize: () => 30,
		measureElement:
			typeof window !== 'undefined' &&
				navigator.userAgent.indexOf('Firefox') === -1
				? element => element?.getBoundingClientRect().height
				: undefined,
		overscan: 0,
	});

	return (
		<div ref={tableContainerRef} style={{ height: "600px", overflow: "auto" }}>
			<table style={{ display: 'grid' }}>
				<thead
					style={{
						display: 'grid',
						position: 'sticky',
						top: 0,
						zIndex: 1,
						backgroundColor:"white"
					}}
				>
					{table.getHeaderGroups().map(headerGroup => (
						<tr
							key={headerGroup.id}
							style={{ display: 'flex', width: '100%' }}
						>
							{headerGroup.headers.map(header => {
								return (
									<th
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
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
											{{
												asc: ' 🔼',
												desc: ' 🔽',
											}[header.column.getIsSorted() as string] ?? null}
										</div>
									</th>
								)
							})}
						</tr>
					))}
				</thead>
				<tbody
					style={{
						display: 'grid',
						height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
						position: 'relative', //needed for absolute positioning of rows
					}}
				>
					{rowVirtualizer.getVirtualItems().map(virtualRow => {
						const row = rows[virtualRow.index] as Row<DefectRecord>
						return (
							<tr
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
										<td
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
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	);
}

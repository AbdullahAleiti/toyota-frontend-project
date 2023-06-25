import { Department , FilterBased } from "../domain";
import terminalsData from "../mock-data/terminal.json"
import {
    getCoreRowModel,
    ColumnDef,
    flexRender,
    useReactTable,
    createColumnHelper,
    Cell
  } from '@tanstack/react-table'
import { useState } from 'react'

const columnHelper = createColumnHelper<Department[]>()
/*
function FilterBox({props : Department}) : Cell<Department,Department[]>{
    return <div></div>
}*/
const columns : ColumnDef<Department>[] = [
    {
        header: "TÜM TERMINALLER",
        footer: props => props.column.id,
        columns: [
            {
                accessorFn: cell => `(${cell.shopCode}) ${cell.depName}`,
                header: "BÖLÜM BAZINDA",
                footer: info => info.column.id
            },
            {
                header: "FILTRE BAZINDA",
                accessorKey: "filterBaseds",
                //accessorFn: (filter)=>{(filter.filterBaseds as FilterBased).filterCode},
                cell: (info) => (
                    <div key={info.cell.id}>
                        {info.cell.getValue().map((filter : FilterBased) => {
                            return <div className="filter">{filter.filterCode}</div>
                        })}
                    </div>
                ),
                footer: info => info.column.id
            }
        ]
    },
]

export default function Terminals() {
    const [data,setData] = useState(()=>{
        const filteredData : Department[] = []
        terminalsData.data.map(({depCode,shopCode,depName,filterBaseds})=>{
            const new_filterBaseds : FilterBased[] =  filterBaseds.map(obj => {
                const { userDesc, termName, ...rest } = obj; // Destructure the object and exclude userDesc and termName keys
                return rest; // Return the modified object without userDesc and termName
            });
            const obj : Department = {depCode,shopCode,depName,filterBaseds:new_filterBaseds}
            filteredData.push(obj)
        }) 
        return filteredData
    })

    const table = useReactTable({columns,data,getCoreRowModel: getCoreRowModel()}) 

    return (
      <div>
        <table style={{width:"100%"}}>
            <thead>
                {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                        {hg.headers.map(header => (
                            <th key={header.id}>{flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell,cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      )
}
export type Department = {
    depName?:string,
    depCode?:string,
    shopCode?: string,
    filterBaseds?: FilterBased[]
}

export type FilterBased = {
    filterCode?:string,
    linkCount?:number
}
export type Department = {
    depName?:string,
    depCode?:string,
    shopCode?: string,
    filterBaseds?: FilterBased[],
}

export type Terminal = {
    termId?: number,
    depCode?: string,
    termName?: string,
    searchType?: string,
    lastAssyNo?: number,
    searchRequired?: string,
    line?: number,
    filterCode?: string
}
export type FilterBased = {
    filterCode?:string,
    linkCount?:number,
    userDesc?:string,
    termName?:string
}
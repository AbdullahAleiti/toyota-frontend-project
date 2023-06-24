export type department = {
    name:string,
    shopCode: string,
    filters: filter[]
}

type filter = {
    code:string,
    linkCount:number
}
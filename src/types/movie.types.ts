export type Movie = {
    title: string,
    poster: string,
    release_date: Date,
    duration: number,
    video: string,
    description: string,
    status: boolean,
    category_id?: string[]
}
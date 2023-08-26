export interface Game {
    id: number,
    name: string,
    releaseDate: string,
    description: string,
    price: number,
    mainImage: string,
    downloadLink: string,
    fk_id_category: string
}
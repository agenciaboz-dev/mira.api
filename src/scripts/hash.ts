import Hashids from "hashids"

const hashid = new Hashids("mira", 10)

export const encrypt = (id: number) => hashid.encode(id)
export const decrypt = (hash: string) => Number(hashid.decode(hash))

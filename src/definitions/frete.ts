export interface Volume {
    quantity: number
    width: number
    height: number
    length: number
    weight: number
}

export interface Quotation {
    from: string
    to: string
    invoice_amount: number
    volumes: Volume[]
    cargo_types?: string[]
    recipient?: string
}

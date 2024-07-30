export interface Graph {
    modelo: string,
    model_score: number,
    created_at: string
}

export interface Stadistic {
    sexo: Sexo,
    edad: Age,
    color_piel: ColorSk
}

export interface Sexo {
    M: number,
    F: number
}

export interface Age {
    "infante": number,
    "adulto mayor": number,
    "adulto": number,
    "adolecente": number,
    "adulto joven": number
}

export interface ColorSk {
    moreno: number,
    blanco: number,
    negro: number
}

export interface Episode {
    data: EpisodeData
}

export interface EpisodeData {
    info: EpisodeInfo
    results: EpisodeResult[]
}

export interface EpisodeInfo {
    count: number
    pages: number
    next: string
    prev: any
}

export interface EpisodeResult {
    id: number
    name: string
    air_date: string
    episode: string
    characters: string[]
    url: string
    created: string
}



export interface Character {
    message: string
    data: CharResult[]
}

export interface CharData {
    info: CharInfo
    data: CharResults
}

export interface CharInfo {
    count: number
    pages: number
    next: string
    prev: any
}

export interface CharResults {
    info: CharInfo;
    results: CharResult[]
}

export interface CharResult {
    id: number
    name: string
    status: string
    species: string
    type: string
    gender: string
    origin: CharOrigin
    location: Location
    image: string
    episode: string[]
    url: string
    created: string
}

export interface CharMap {
    id: number
    name: string
    image: string
}

export interface CharOrigin {
    name: string
    url: string
}

export interface CharLocation {
    name: string
    url: string
}

export interface EpisodeMetadata {
  name: string
  charCount: number
}

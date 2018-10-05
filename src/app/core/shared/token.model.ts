export class Token{
    constructor(
        public id: number,
        public description: string,
        public price?: number,
        public available?: boolean
    ){}
}

export class Crowdsale{
    constructor(
        public address: string,
        public openingTime: number,
        public closingTime: number,
        public hasClosed: boolean,
        public released: boolean,
    ){}
}
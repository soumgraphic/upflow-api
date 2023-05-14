export class DocumentResponse{
    constructor(
        public id : string, 
        public name: string,
        public docUrl: string,
        public thumbnail: string,
        public thumbnailUrl: string
    ){};
}
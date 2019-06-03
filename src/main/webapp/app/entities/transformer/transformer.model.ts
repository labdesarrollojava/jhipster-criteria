import { BaseEntity } from './../../shared';

export class Transformer implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public power?: number,
    ) {
    }
}

export interface ITransformer {
  id?: number;
  name?: string;
  power?: number;
}

export class Transformer implements ITransformer {
  constructor(public id?: number, public name?: string, public power?: number) {}
}

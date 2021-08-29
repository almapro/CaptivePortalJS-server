import {Entity, model, property} from '@loopback/repository';

@model()
export class Client extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuid'
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  mac: string;

  @property({
    type: 'string',
  })
  ip?: string;


  constructor(data?: Partial<Client>) {
    super(data);
  }
}

export interface ClientRelations {
  // describe navigational properties here
}

export type ClientWithRelations = Client & ClientRelations;

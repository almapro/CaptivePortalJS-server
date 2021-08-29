import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'Db',
  connector: 'neo4j-driver',
  url: 'neo4j://127.0.0.1',
  database: 'captive',
  username: 'captiveportal',
  password: '1994',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

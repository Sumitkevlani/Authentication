import { Logger, Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';
//Creating connection with the database
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () =>
        new Promise((resolve, reject) => {
          Logger.debug('Connecting to Database');
          MongoClient.connect(
            'mongodb+srv://oyebusydev:oyeBusydev@cluster0.8bp5k.mongodb.net/ob-next?retryWrites=true&w=majority',
            {},
            (error, client) => {
              if (error) {
                Logger.error('MongoDb Connection Failed');
                reject(error);
              } else {
                Logger.debug('Database Connection Successful');
                resolve(client.db('ob-next'));
              }
            },
          );
        }),
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}

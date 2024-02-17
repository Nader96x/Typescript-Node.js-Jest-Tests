import {MongoMemoryServer} from 'mongodb-memory-server';

export async function connect(): Promise<MongoMemoryServer> {
    return MongoMemoryServer.create();

}
import { MongoClient, Db } from "mongodb";
import bcrypt from "bcrypt";

export interface IUser {
    _Id?: number;
    login: string;
    password: string;
}

class DatabaseC {
    mongoLink: string;
    client: MongoClient;
    dbName: string;

    establishConnection = async (mongoString: string, databaseName: string) => {
        this.mongoLink = mongoString;
        this.dbName = databaseName;
        console.log(`establishing connection to database`);
        if (this.mongoLink) {
            try {
                console.log("still ok 1");
                this.client = new MongoClient(this.mongoLink, {
                    connectTimeoutMS: 3000,
                    serverSelectionTimeoutMS: 3000,
                });
                await this.client.connect();
                console.log("still ok 2");
            } catch (err) {
                throw err;
            }
        } else {
            throw new Error(`mongolink is not valid`);
        }
    };

    validateCollection = (collectionName: string): Promise<string> =>
        new Promise((res, rej) => {
            if (this.client) {
                this.client
                    .db(this.dbName)
                    .listCollections({ name: collectionName })
                    .next()
                    .then((collinfo) => {
                        if (collinfo == null) {
                            this.client
                                .db(this.dbName)
                                .createCollection(collectionName)
                                .then(() => {
                                    console.log(`Database: collection ${collectionName} created`);
                                    res(collectionName);
                                })
                                .catch((err) => rej(err));
                        } else {
                            console.log(`Database: collection ${collectionName} exists`);
                            res(collectionName);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        rej(err);
                    });
            } else {
                throw new Error("error when validating collection");
            }
        });
    getUser = async (login: number, collectionName: string) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            const gotUser = await this.client
                .db(this.dbName)
                .collection(collectionName)
                .findOne({ login: login });
            // console.log(gotUser);
            return gotUser as unknown as IUser | null;
        } catch (error) {
            throw error;
        }
    };

    hashPassword = async (password: string) => {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    };

    saveUser = async (user: IUser, collectionName: string) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            user.password = await this.hashPassword(user.password);
            console.log("savind user: ", user.login);
            await this.client.db(this.dbName).collection(collectionName).insertOne(user);
        } catch (err) {
            throw err;
        }
    };
}

export default DatabaseC;

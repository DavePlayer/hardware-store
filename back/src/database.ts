import { MongoClient, Db, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export interface IUser {
    _id?: string;
    login: string;
    password: string;
    isAdmin: boolean;
    userName: String;
    imgPath: string;
}

export interface Iitem {
    _id?: ObjectId | undefined;
    nameAndCompany: string;
    date: string;
    rentedTo: number | null;
    beingRepaired: boolean;
}

interface IaddedItem extends Iitem {
    _id?: ObjectId | undefined;
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
                console.log("connecting to server");
                this.client = new MongoClient(this.mongoLink, {
                    connectTimeoutMS: 10000,
                    serverSelectionTimeoutMS: 10000,
                });
                await this.client.connect();
                console.log("connected to server");
                const admin = await this.getUser("admin@example.com", "users");
                // initial user. Should be deleted afterwards
                if (admin != null) {
                    const password = await this.hashPassword("admin");
                    await this.client
                        .db(this.dbName)
                        .collection("users")
                        .updateOne({ _id: new ObjectId(admin._id) }, { $set: { password } });
                }
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
    getUser = async (login: string, collectionName: string) => {
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
    getAllUsers = async (collectionName: string) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            const gotUsers = await this.client
                .db(this.dbName)
                .collection(collectionName)
                .find({})
                .toArray();
            return gotUsers as unknown as Array<IUser> | null;
        } catch (error) {
            throw error;
        }
    };

    getItems = async (collectionName: string, userId: number) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            const items = await this.client
                .db(this.dbName)
                .collection(collectionName)
                .find({ $or: [{ rentedTo: null }, { rentedTo: userId }] })
                .toArray();
            return items as unknown as Array<Iitem> | null;
        } catch (error) {
            throw error;
        }
    };
    getItemsNotYours = async (collectionName: string, userId: number) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            const items = await this.client
                .db(this.dbName)
                .collection(collectionName)
                .find({ beingRepaired: false })
                .toArray();
            return items as unknown as Array<Iitem> | null;
        } catch (error) {
            throw error;
        }
    };

    getAllItems = async (collectionName: string, userId: number) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            const items = await this.client
                .db(this.dbName)
                .collection(collectionName)
                .find({})
                .toArray();
            return items as unknown as Array<Iitem> | null;
        } catch (error) {
            throw error;
        }
    };

    getItem = async (collectionName: string, itemId: number) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            const items = await this.client
                .db(this.dbName)
                .collection(collectionName)
                .findOne({ _id: new ObjectId(itemId) });
            return items as unknown as Iitem | null;
        } catch (error) {
            throw error;
        }
    };

    addItem = async (collectionName: string, item: IaddedItem) => {
        try {
            console.log(item);
            collectionName = await this.validateCollection(collectionName);
            await this.client.db(this.dbName).collection(collectionName).insertOne(item);
            return "added new item";
        } catch (error) {
            throw error;
        }
    };

    deleteItem = async (collectionName: string, itemId: number) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .deleteOne({ _id: new ObjectId(itemId) });
            return "properly deleted item";
        } catch (err) {
            throw err;
        }
    };

    rentItem = async (collectionName: string, userId: number, itemId: number) => {
        try {
            console.log(`renting item(${itemId}) to user(${userId})`);
            collectionName = await this.validateCollection(collectionName);
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .updateOne({ _id: new ObjectId(itemId) }, { $set: { rentedTo: userId } });
            return "properly rented item";
        } catch (err) {
            throw err;
        }
    };

    release = async (collectionName: string, itemId: number) => {
        try {
            console.log(`releasing item(${itemId})`);
            collectionName = await this.validateCollection(collectionName);
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .updateOne({ _id: new ObjectId(itemId) }, { $set: { rentedTo: null } });
            return "properly released item";
        } catch (err) {
            throw err;
        }
    };

    releseUserItems = async (_id: string, collectionName: string) => {
        try {
            console.log(`releasing items from user: (${_id})`);
            collectionName = await this.validateCollection(collectionName);
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .updateMany({ rentedTo: _id }, { $set: { rentedTo: null } });
            return "properly released items";
        } catch (err) {
            throw err;
        }
    };

    sendToRepair = async (collectionName: string, itemId: number) => {
        try {
            console.log(`releasing item(${itemId})`);
            collectionName = await this.validateCollection(collectionName);
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .updateOne({ _id: new ObjectId(itemId) }, { $set: { beingRepaired: true } });
            return "item sent to repair";
        } catch (err) {
            throw err;
        }
    };

    getFromRepair = async (collectionName: string, itemId: number) => {
        try {
            console.log(`releasing item(${itemId})`);
            collectionName = await this.validateCollection(collectionName);
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .updateOne({ _id: new ObjectId(itemId) }, { $set: { beingRepaired: false } });
            return "got item from repair";
        } catch (err) {
            throw err;
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
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .insertOne(user as any);
        } catch (err) {
            throw err;
        }
    };
    updateUser = async (user: IUser, collectionName: string) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            const { _id, ...update } = user;
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .updateOne({ _id: new ObjectId(user._id) }, { $set: { ...update } });
            return "updated user properly";
        } catch (err) {
            throw err;
        }
    };
    deleteUser = async (_id: string, collectionName: string) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            await this.client
                .db(this.dbName)
                .collection(collectionName)
                .deleteOne({ _id: new ObjectId(_id) });
            return "removed user properly";
        } catch (err) {
            throw err;
        }
    };
    getUserByID = async (_id: string, collectionName: string) => {
        try {
            collectionName = await this.validateCollection(collectionName);
            const gotUser = await this.client
                .db(this.dbName)
                .collection(collectionName)
                .findOne({ _id: new ObjectId(_id) });
            // console.log(gotUser);
            return gotUser as unknown as IUser | null;
        } catch (error) {
            throw error;
        }
    };
}

export default DatabaseC;

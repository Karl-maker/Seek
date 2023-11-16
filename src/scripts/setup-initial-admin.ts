import { config } from "../config";
import MongoDB, { IMongoDB } from "../helpers/database/mongo";
import { logger } from "../helpers/logger/basic-logging";
import { IAccountRepository } from "../modules/account-repository";
import { MongoAccountRepository } from "../modules/account-repository/mongo";

(async () => {

    try{
        const mongo_db_uri = config.database[config.environment].uri;
        const database: IMongoDB = new MongoDB(mongo_db_uri, {
            dbName: config.database[config.environment].name,
            user: config.database[config.environment].user,
            pass: config.database[config.environment].password, 
            retryWrites: true, 
            w: "majority" 
        });
        await database.connect(async() => {
            const accountRepository: IAccountRepository = new MongoAccountRepository(database);
            const account = await accountRepository.create({
                first_name: `Karl-Johan`,
                last_name: `Bailey`,
                password: `admin-password`,
                mobile: '+1 (868) 742-2549',
                role: 'admin',
                email: 'karljohanbailey98@gmail.com'
            });
            logger.info(`Admin created with details: `, account.element);
        }); 
        
        await database.disconnect();
    } catch(error) {
        logger.error(`on setup-initial-admin script`, error)
    }
})();
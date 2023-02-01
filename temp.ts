import { StatusEnum } from './config/enum';
import { create } from './model/statuses'; 

const main = async () => {
    const result = await create(4, StatusEnum.off);
    if (result) console.log(result);
    
};

main();
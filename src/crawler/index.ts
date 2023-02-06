import * as config from '../../config';
import { findAllStatuses, Status, findAllStatusesByChannelIds } from '../../model/statuses';
import { StatusEnum } from '../../config/enum';





const checkStatuses =  () => {
    setInterval(async () => {
        const status = await findAllStatusesByChannelIds([55, 128]);
        console.log(status);
    }, 3000)
}


checkStatuses();
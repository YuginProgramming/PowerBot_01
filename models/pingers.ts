import { Model, DataTypes } from 'sequelize';
import { PingerType } from '../config/enum';
import { sequelize } from './sequelize';

class Pinger extends Model {}
Pinger.init({
    type: {
        type: DataTypes.ENUM(...Object.values(PingerType)),
        allowNull: false
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: false,
    timestamps: false,
    modelName: 'pingers',
    sequelize
});

interface PingerFields {
    id: number,
    type: PingerType,
    channel_id: number,
    value: string
}

const findIpsByChannelId = async (channel_id: number): Promise<PingerFields[]|undefined> => {
    try {
        const res = await Pinger.findAll({ where: { channel_id: channel_id } });
        //console.log(res);
        return res.map((pinger: Pinger) => pinger.dataValues.value);
    } catch (error) {
        console.error(`Error reading IPs by channel id: ${error}`);
        throw error; // було return [];
    }
};

const updateIpByPingerId = async (id: number, ip: string): Promise<PingerFields|undefined> => {
    try {
        const updated = await Pinger.update({ value: ip }, { where: { id }, returning: true });
        if (updated) {
            console.log(`Successfully updated channel id: ${id}`);
        } else {
            console.error(`Error updating channel id: ${id} not found`);
        }
    } catch (error) {
        console.error(`Error updating channel id: ${error}`);
    }
};

async function deleteIpByPingerId(id: number): Promise<Boolean> {
    try {
        const pingerId = await Pinger.destroy({ where: { id } });
        console.log(`Successfully deleted channel id: ${id}`);
    } catch (error) {
        console.error(`Error deleting channel id: ${error}`);  
    }
};  

// addNewIp ('192.168.11.22', 234234)
// findIpsByChannelId(234234),
// updateIpByPingerId(2, '192.168.11.22'),
// deleteIpByPingerId(2)
    
export {
    Pinger,
    // addNewIp
    findIpsByChannelId,
    updateIpByPingerId,
    deleteIpByPingerId
};

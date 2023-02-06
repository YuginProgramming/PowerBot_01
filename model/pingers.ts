// + PingerEnum, 
// + addNewIp (channelId, ip)
// + find.One readIpsByChannelId (channelId) 
// + deleteIpByChannelId (channelId)
// + updateIpByChannelId (channelId, ip)
// find.All readIpsByChannelId (channelId) 

import { Sequelize, Model, DataTypes } from 'sequelize';
import { StatusEnum } from '../config/enum';
import { PingerType } from '../config/enum';

const sequelize = new Sequelize({
    storage: __dirname + '/pb.db',
    dialect: 'sqlite'
});

class Pinger extends Model {}
Pinger.init({
    type: {
        type: DataTypes.ENUM(PingerType.ip),
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

const readOneIpByChannelId = async (channel_id: number): Promise<PingerFields|null> => {
    const res = await Pinger.findOne({ where: { channel_id: channel_id }});
    //console.log(res?.dataValues.value);
    if (res) return res.dataValues.value;
    return res;
};

async function addNewChannelId(channel_id: number) {
    try {
      const pingerId = await Pinger.create({ channel_id: channel_id, type: 'IP', value: '33.20.3.1' });
      console.log(`Successfully added new channel id: ${channel_id}`);
    } catch (error) {
      console.error(`Error adding new channel id: ${error}`);
    }
  };

  async function deleteNewChannelId(channel_id: number) {
    try {
      const pingerId = await Pinger.destroy({ where: { channel_id: channel_id } });
      console.log(`Successfully deleted channel id: ${channel_id}`);
    } catch (error) {
      console.error(`Error deleting channel id: ${error}`);  
    }
  };  

  async function updateChannelId(channel_id: number, newValue: string) {
    try {
      const [updated] = await Pinger.update({ value: newValue }, { where: { channel_id: channel_id }, returning: true });
      if (updated) {
        console.log(`Successfully updated channel id: ${channel_id}`);
      } else {
        console.error(`Error updating channel id: ${channel_id} not found`);
      }
    } catch (error) {
      console.error(`Error updating channel id: ${error}`);
    }
  };

  const readIpsByChannelId = async (channel_id: number): Promise<PingerFields[]> => {
    try {
      const res = await Pinger.findAll({ where: { channel_id: channel_id } });
      //console.log(res);
      return res.map((pinger: Pinger) => pinger.dataValues.value);
    } catch (error) {
      console.error(`Error reading IPs by channel id: ${error}`);
      return [];
    }
  };


//readIpsByChannelId(1);
//addNewChannelId(5);
//deleteNewChannelId(2);
//updateChannelId(5, '44.20.3.1');
//readIpsByChannelId(5);

export {
    Pinger
};
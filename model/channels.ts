import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    storage: __dirname + '/pb.db',
    dialect: 'sqlite'
});

interface ChannelData {
    shortname: string,
    longname?: string,
    tg_id: string,
    pinger_id: number,
}

interface ChannelValues {
    id: number,
    shortname: string,
    longname: string,
    active: boolean,
    tg_id: string,
    pinger_id: number,
}

class Channel extends Model {}
Channel.init({
    shortname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    longname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    tg_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pinger_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: false,
    timestamps: false,
    modelName: 'channels',
    sequelize
});

const addNewChannel = async (ChannelData: ChannelData): Promise<ChannelValues|undefined> => {
    let res;
    try {
        res = await Channel.create({ 
            shortname: ChannelData.shortname,
            longname: ChannelData.longname,
            tg_id: ChannelData.tg_id,
            pinger_id: ChannelData.pinger_id,
        });
    } catch (err) {
        console.log(err);
    }
    const json = res?.toJSON();
    return json;
};

interface UpdateParams {
    id: number,
    pinger_id?: number,
    shortname?: string,
    longname?: string,
    tg_id?: string,
    active?: boolean,
}

const updateChannelById = async (UpdateParams: UpdateParams): Promise<boolean> => {
    const res = await Channel.update(
        {
            pinger_id: UpdateParams.pinger_id,
            shortname: UpdateParams.shortname,
            longname: UpdateParams.longname,
            tg_id: UpdateParams.tg_id,
            active: UpdateParams.active,
        },
        { where: { id: UpdateParams.id } });
    return res[0] ? true : false;
};

const deleteChannelById = async (id: number): Promise<boolean> => {
    const res = await Channel.update({ active: false }, { where: { id: id } });
    return res[0] ? true : false;
};

const findChannelsByPingerId = async (pinger_id: number): Promise<Array<ChannelValues>|undefined> => {
    const res = await Channel.findAll({ 
        where: { pinger_id: pinger_id }
    });
    console.log(res)
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

const findChannelById = async (id: number): Promise<ChannelValues|null> => {
    const res = await Channel.findOne({ where: { id: id } });
    if (res) return res.dataValues;
    return res;
};

export {
    Channel,
    addNewChannel,
    deleteChannelById,
    findChannelsByPingerId,
    findChannelById,
    updateChannelById,
};
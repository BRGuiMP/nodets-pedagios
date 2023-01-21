import { Model, DataTypes } from "sequelize";
import { sequelizeAtua } from "../instances/mysql";

export interface CfInstanceAtua extends Model {
    TabelaCte: any;
    TabelaRota: any;
    cd_ctrc: number
    nr_carta_frete: number
    id_pedagio: number
    dt_emissao: Date
    cd_rota: number
}

export interface CteInstanceAtua extends Model{
    cd_ctrc: number
    cd_agencia: number
    cd_pessoa_usuario_cancelamento: number
    nr_ctrc: number
    ds_serie: number
    dt_emissao: Date
}

export interface RotaInstanceAtua extends Model{
    cd_rota: number
    cd_cidade_origem: number
    cd_cidade_destino: number
    nm_rota: string
    ar_cd_cidade_trajeto: string
    vl_distancia_km: number
    id_ativo: number
}


export const TabelaRota = sequelizeAtua.define<RotaInstanceAtua>("TabelaRota", {
    cd_rota: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    cd_cidade_origem: {
        type: DataTypes.INTEGER
    },
    cd_cidade_destino: {
        type: DataTypes.INTEGER
    },
    nm_rota: {
        type: DataTypes.STRING
    },
    ar_cd_cidade_trajeto: {
        type: DataTypes.STRING
    },
    vl_distancia_km: {
        type: DataTypes.INTEGER
    },
    id_ativo: {
        type: DataTypes.INTEGER
    }
},
{
    tableName: 'tabelarota',
    timestamps: false
})


export const TabelaCte = sequelizeAtua.define<CteInstanceAtua>("TabelaCte", {
    cd_ctrc: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    cd_agencia: {
        type: DataTypes.INTEGER
    },
    cd_pessoa_usuario_cancelamento: {
        type: DataTypes.INTEGER
    },
    nr_ctrc: {
        type: DataTypes.INTEGER
    },
    ds_serie: {
        type: DataTypes.INTEGER
    },
    dt_emissao: {
        type: DataTypes.DATE
    }
},
{
    tableName: 'tabelacte',
    timestamps: false
})


export const TabelaCf = sequelizeAtua.define<CfInstanceAtua>("TabelaCf", {
    cd_ctrc: {
        type: DataTypes.INTEGER,
        references: {
            model: TabelaCte,
            key: 'cd_ctrc'
        }
    },
    nr_carta_frete: {
        type: DataTypes.INTEGER
    },
    id_pedagio: {
        type: DataTypes.INTEGER
    },
    dt_emissao: {
        type: DataTypes.DATE
    },
    cd_rota: {
        type: DataTypes.INTEGER,
        references: {
            model: TabelaRota,
            key: 'cd_rota'
        }
    }
},
{
    tableName: 'tabelacf',
    timestamps: false
})

TabelaRota.hasMany(TabelaCf, { foreignKey: 'cd_rota', as: 'TabelaRota'})
TabelaCf.belongsTo(TabelaRota, { foreignKey: 'cd_rota', as: 'TabelaRota'})


TabelaCte.hasOne(TabelaCf, { foreignKey: 'cd_ctrc'})
TabelaCf.belongsTo(TabelaCte, { foreignKey: 'cd_ctrc'})
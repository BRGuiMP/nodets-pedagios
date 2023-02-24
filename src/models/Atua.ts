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

export interface AgenciaInstanceAtua extends Model{
    cd_agencia: number
    nm_agencia: string
}

export interface CidadeInstanceAtua extends Model{
    cd_cidade: number
    nm_cidade: string
}

export const Cidade = sequelizeAtua.define<CidadeInstanceAtua>("Cidade", {
    cd_cidade: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    nm_cidade: {
        type: DataTypes.STRING
    }
},
{
    tableName: 'cidade',
    timestamps: false
})


export const TabelaAgencia = sequelizeAtua.define<AgenciaInstanceAtua>("TabelaAgencia", {
    cd_agencia: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    nm_agencia: {
        type: DataTypes.STRING
    }
},
{
    tableName: 'agencia',
    timestamps: false
})

export const TabelaRota = sequelizeAtua.define<RotaInstanceAtua>("TabelaRota", {
    cd_rota: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    cd_cidade_origem: {
        type: DataTypes.INTEGER,
        references: {
            model: Cidade,
            key: 'cd_cidade'
        }
    },
    cd_cidade_destino: {
        type: DataTypes.INTEGER,
        references: {
            model: Cidade,
            key: 'cd_cidade'
        }
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
    tableName: 'rota',
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
    },cd_cidade_origem: {
        type: DataTypes.INTEGER,
        references: {
            model: Cidade,
            key: 'cd_cidade'
        }
    },
    cd_cidade_destino: {
        type: DataTypes.INTEGER,
        references: {
            model: Cidade,
            key: 'cd_cidade'
        }
    },
    nr_embarque: {
        type: DataTypes.INTEGER
    }
},
{
    tableName: 'ctrc',
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
        primaryKey: true,
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
    tableName: 'carta_frete',
    timestamps: false
})

TabelaRota.hasMany(TabelaCf, { foreignKey: 'cd_rota', as: 'TabelaRota'})
TabelaCf.belongsTo(TabelaRota, { foreignKey: 'cd_rota', as: 'TabelaRota'})


TabelaCte.hasOne(TabelaCf, { foreignKey: 'cd_ctrc'})
TabelaCf.belongsTo(TabelaCte, { foreignKey: 'cd_ctrc'})


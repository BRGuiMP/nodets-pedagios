import { Model, DataTypes } from "sequelize";
import { sequelizePedagio } from "../instances/mysql";

export interface UsuarioInstancePed extends Model {
    idUsuario: number
    nome: string
    email: string
    senha: string
}

export interface RotaInstancePed extends Model {
    idRota: number
    nmRota: string
    tpRota: number
    cd_rota: number
}

export interface ClassificadorInstancePed extends Model {
    idClassificacao: number
    tpClassificacao: number
    descClassificacao: string
}

export interface CteClassificadoInstancePed extends Model {
    idCte: number
    idRota: number
    dtCadastro: Date
    descObs: string
    cd_ctrc: number
    dt_emissao: Date
    cd_agencia: number
    cd_pessoa_usuario_cancelamento: number
    nr_ctrc: number
    id_pedagio_cf: number
    idClassificacao: number
}

export const Usuario = sequelizePedagio.define<UsuarioInstancePed>("Usuario", {
    idUsuario: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    senha: {
        type: DataTypes.STRING
    }
},
{
    tableName: 'usuario',
    timestamps: false
})

export const Rota = sequelizePedagio.define<RotaInstancePed>("Rota", {
    idRota: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    nmRota: {
        type: DataTypes.STRING
    },
    tpRota: {
        type: DataTypes.INTEGER
    },
    cd_rota: {
        type: DataTypes.INTEGER
    }
},
{
    tableName: 'rota',
    timestamps: false
})

export const Classificador = sequelizePedagio.define<ClassificadorInstancePed>("Classificador", {
    idClassificacao: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    tpClassificacao: {
        type: DataTypes.INTEGER
    },
    descClassificacao: {
        type: DataTypes.STRING
    }
},
{
    tableName: 'classificador',
    timestamps: false
})

export const CteClassificado = sequelizePedagio.define<CteClassificadoInstancePed>("CteClassificado", {
    idCte: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    idRota: {
        type: DataTypes.INTEGER,
        references: {
            model: Rota,
            key: 'idRota'
        }
    },
    idClassificacao: {
        type: DataTypes.INTEGER,
        references: {
            model: Classificador,
            key: 'idClassificacao'
        }
    },
    dtCadastro: {
        type: DataTypes.DATE
    },
    descObs: {
        type: DataTypes.STRING
    },
    cd_ctrc: {
        type: DataTypes.INTEGER
    },
    dt_emissao: {
        type: DataTypes.DATE
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
    id_pedagio_cf: {
        type: DataTypes.INTEGER
    }
},
{
    tableName: 'cteclassificado',
    timestamps: false
})

Rota.hasMany(CteClassificado, { foreignKey: 'idRota', as: 'Rota'})
CteClassificado.belongsTo(Rota, { foreignKey: 'idRota', as: 'Rota'})

Classificador.hasMany(CteClassificado, { foreignKey: 'idClassificacao', as: 'Classificador'})
CteClassificado.belongsTo(Classificador, { foreignKey: 'idClassificacao', as: 'Classificador'})
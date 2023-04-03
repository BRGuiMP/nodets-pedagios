import { Model, DataTypes } from "sequelize";
import { sequelizePedagio } from "../instances/mysql";

export interface UsuarioInstancePed extends Model {
    idusuario: number
    nome: string
    email: string
    senha: string
}

export interface RotaInstancePed extends Model {
    idrota: number
    nmrota: string
    tprota: number
    cd_rota: number
}

export interface ClassificadorInstancePed extends Model {
    idclassificacao: number
    //tpClassificacao: number
    descclassificacao: string
}

export interface CteClassificadoInstancePed extends Model {
    idcte: number
    idrota: number
    dtcadastro: Date
    descobs: string
    cd_ctrc: number
    dt_emissao: Date
    cd_agencia: number
    cd_pessoa_usuario_cancelamento: number
    nr_ctrc: number
    id_pedagio_cf: number
    idclassificacao: number
}

export const Usuario = sequelizePedagio.define<UsuarioInstancePed>("Usuario", {
    idusuario: {
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
    idrota: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    nmrota: {
        type: DataTypes.STRING
    },
    tprota: {
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
    idclassificacao: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    /* tpClassificacao: {
        type: DataTypes.INTEGER
    }, */
    descclassificacao: {
        type: DataTypes.STRING
    }
},
{
    tableName: 'classificador',
    timestamps: false
})

export const CteClassificado = sequelizePedagio.define<CteClassificadoInstancePed>("CteClassificado", {
    idcte: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    idrota: {
        type: DataTypes.INTEGER,
        references: {
            model: Rota,
            key: 'idrota'
        }
    },
    idclassificacao: {
        type: DataTypes.INTEGER,
        references: {
            model: Classificador,
            key: 'idclassificacao'
        }
    },
    dtcadastro: {
        type: DataTypes.DATE
    },
    descobs: {
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

Rota.hasMany(CteClassificado, { foreignKey: 'idrota', as: 'Rota'})
CteClassificado.belongsTo(Rota, { foreignKey: 'idrota', as: 'Rota'})

Classificador.hasMany(CteClassificado, { foreignKey: 'idclassificacao', as: 'Classificador'})
CteClassificado.belongsTo(Classificador, { foreignKey: 'idclassificacao', as: 'Classificador'})
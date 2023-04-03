import { Request, Response } from 'express'
import { Op, Sequelize } from 'sequelize'

export const cadastro = async (req: Request, res: Response) => {

    res.render('pages/signup')
}

export const newCadastro = async (req: Request, res: Response) => {
    let {nome, email, senha} = req.body

    console.log(nome, email, senha)

    
    res.redirect('/')
}

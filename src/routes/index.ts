import { Router } from 'express';

import * as HomeController from '../controllers/homeController';
import * as ClassificaController from '../controllers/classificaController';

const router = Router();


router.get('/', HomeController.home);



router.get('/classificacte', ClassificaController.classificador);

router.get('/listagem', ClassificaController.listagem);
router.post('/listagem', ClassificaController.listagem);


router.post('/cte-correto/:id/:deEmissao/:ateEmissao/add', ClassificaController.cteCorreto);
router.post('/cte-correto-sem-rota/:id/:deEmissao/:ateEmissao/add', ClassificaController.cteCorretoSemRota)


/* router.post('/novousuario', HomeController.criandoUsuario);
router.post('/novocargo', HomeController.criandoCargo);

router.get('/usuario/:id/mais', HomeController.adiciona) 
router.get('/usuario/:id/menos', HomeController.subtrai)
router.get('/usuario/:id/excluir', HomeController.exclui)
 */


export default router;
import { Router } from 'express';
const router: Router = Router();

import multer from '../libs/multer';

import { postUploadDocumentCon, getDocumentsCon } from '../controllers/document.controller';

import { tokenValidation } from '../libs/verifyTokenAndRol';
//#region //*Documento conciliación
router.post('/upload-conciliation', [tokenValidation, multer.single('documento'), postUploadDocumentCon]);
router.get('/conciliations', [tokenValidation, getDocumentsCon]);

//#endregion
export default router;
import { Router } from 'express';
const router: Router = Router();

import multer from '../libs/multer';

import { tokenValidation, verifyRolAdmin } from '../libs/verifyTokenAndRol';
import { postUploadDocumentArq, deleteDocumentArq, getDocumentsArqAdmin, getDocumentArqByCodeAdmin, getDocumentsArq, getDocumentArqByCode, getDocumentXLSXConByCodeAdmin, getDocumentXLSXConByCode, getDocumentXLSXArqByCodeAdmin, getDocumentXLSXArqByCode, deleteDocumentCon, getDocumentConByCode, getDocumentConByCodeAdmin, getDocumentsCon, getDocumentsConAdmin, postUploadDocumentCon } from '../controllers/document.controller';

//#region //* Documento conciliación

router.post('/upload-conciliation', [tokenValidation, multer.single('documento'), postUploadDocumentCon]);

//* Admin
router.get('/admin-conciliations/:id', [verifyRolAdmin, getDocumentsConAdmin]);
router.get('/admin-conciliation/:id/:codigo', [verifyRolAdmin, getDocumentConByCodeAdmin]);
router.delete('/admin-conciliation/:id/:codigo', [verifyRolAdmin, deleteDocumentCon]);

router.get('/conciliation/:codigo', [tokenValidation, getDocumentConByCode]);
router.get('/conciliations', [tokenValidation, getDocumentsCon]);

router.get('/conciliation-pdf/:id/:codigo', [tokenValidation, getDocumentXLSXConByCode]);
// router.get('/conciliation-pdf/:id/:codigo', [verifyRolAdmin, getDocumentXLSXConByCodeAdmin]);

//#endregion

//#region //* Documento arqueo

router.post('/upload-arching', [tokenValidation, multer.single('documento'), postUploadDocumentArq]);

//* Admin
router.get('/admin-arches/:id', [verifyRolAdmin, getDocumentsArqAdmin]);
router.get('/admin-arching/:id/:codigo', [verifyRolAdmin, getDocumentArqByCodeAdmin]);
router.delete('/admin-arching/:id/:codigo', [verifyRolAdmin, deleteDocumentArq]);


router.get('/arching/:codigo', [tokenValidation, getDocumentArqByCode]);
router.get('/arches', [tokenValidation, getDocumentsArq]);

router.get('/arching-pdf/:id/:codigo', [tokenValidation, getDocumentXLSXArqByCode]);
// router.get('/arching-pdf/:id/:codigo', [verifyRolAdmin, getDocumentXLSXArqByCodeAdmin]);

//#endregion





export default router;
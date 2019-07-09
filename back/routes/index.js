const express = require('express');
const passport = require('passport');
const router = express.Router();
const storeController = require('../controllers/storeController');
const circularController = require('../controllers/circularController');
const customerController = require('../controllers/customerController');
const airlineController = require('../controllers/airlineController');
const sellRateController = require('../controllers/sellRateController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const CircularAirlineController = require('../controllers/circularAirlineController');
const quickSearchController = require('../controllers/quickSearchController');
const quotationController = require('../controllers/quotationController');
const settingsController = require('../controllers/settingsController');
const forwarderAgentController = require('../controllers/forwarderAgentController');
const appConfigController = require('../controllers/applicationController');
const syncController = require('../controllers/syncController');
const preferentialController = require('../controllers/preferentialController');
const ContractSellController = require('../controllers/contractsellController');
const TaskController = require('../controllers/task_management');
// const AddAWBNumberController = require('../controllers/addAWBNumber');

const ManageAWBStockController = require('../controllers/manageAWBStock');
const AwbTrackingDetailsController = require('../controllers/awbTrackingDeatilsController');
const airlineStatus = require('../controllers/airlineStatusController');
const CircularNotification = require('../controllers/circularNotification');
const MinimumSurchargeController = require('../controllers/minSurchargesController');

const BranchController = require('../controllers/branchController');


const requireAuth = passport.authenticate('jwtLogin', {session:false})
const requireSignin = passport.authenticate('local', {session:false})
const roleCheck = passport.authenticate('jwtRole', {session:false})
const adminCheck = passport.authenticate('adminRole', {session:false})
const appConfigCheck = passport.authenticate('checkAppConfig', {session:false})
const accountsCheck = passport.authenticate('accountsRole', {session:false})
const preferentialCheck = passport.authenticate('preferentialCheck', {session:false})

// Do work here

router.post('/circular/upload', requireAuth, appConfigCheck, requireAuth, circularController.post); 
router.post('/customer/customer-upload', requireAuth, customerController.post);
router.post('/common/search', requireAuth, circularController.search);
router.post('/sellRate/contactAirline', requireAuth, airlineController.saveRow);
router.post('/sellRate/sendSellRate', requireAuth, sellRateController.sellRate);
router.post('/sellRate/removeBuySellRate', requireAuth, sellRateController.removeBuySellRate);
router.post('/common/getSearch', requireAuth, circularController.getSearch);
router.get('/customer/customers', requireAuth, customerController.getCustomer);
router.get('/customer/customer-results', requireAuth, customerController.getCustomerResults);
router.post('/customer/customers', requireAuth, customerController.processCustomer);
router.post('/customer/create', requireAuth, customerController.create);
router.post('/customer/getCustomerIncharges', requireAuth, customerController.getCusIncharges);
router.post('/customer/createIncharge', requireAuth, customerController.createIncharge);
router.put('/customer/update', requireAuth, customerController.update);
router.delete('/customer/delete', requireAuth, customerController.delete);
router.delete('/customer/deleteFile', requireAuth, customerController.deleteFile); 
router.get('/customer/customerNameSearch', requireAuth, customerController.customerNameSearch); 
router.post('/customerGroup/createCustomerGroup', requireAuth, customerController.createCustomerGroup);  
router.get('/customerGroup/getCustomerGroups', requireAuth, customerController.getCustomerGroups); 
router.delete('/customerGroup/deleteGroup', requireAuth, customerController.deleteGroup); 
router.get('/common/login', userController.loginForm);
router.post('/common/login', requireSignin, authController.signin);
router.post('/common/signUp', userController.signUp);
router.post('/common/resetAccount', authController.forgot);
router.post('/common/register', userController.register);
router.post('/user/registerAgent', userController.registerAgent);
router.post('/common/logout', authController.logout);
router.post('/common/logoutAll', authController.logoutAll);
router.post('/common/forgot', authController.forgot);
router.post('/user/agentPassword', authController.agentPassword);
router.post('/common/getCustomerEmail', userController.getCustomerEmail);
router.post('/common/validateUsename', authController.validateUsername);
router.post('/common/setpassword/:token', authController.update);
router.post('/common/customerSearch', requireAuth, customerController.getCustomerBySearchQuery);
router.get('/airline/airlineFiles', requireAuth, airlineController.getAirlineFiles);
router.post('/airline/airlines', requireAuth, airlineController.processFile)
router.post('/airline/createAirline', requireAuth, airlineController.createAirline);;
router.post('/airline/airlineUpload', requireAuth, airlineController.upload);
router.delete('/airline/deleteAirlineFile', requireAuth, airlineController.deleteFile);
router.get('/airline/airlineResults', requireAuth, airlineController.airlineResults);
router.put('/airline/updateAirline', requireAuth, airlineController.updateAirline);
router.delete('/airline/deleteAirline', requireAuth, airlineController.deleteAirline);
router.post('/common/getQuotation', requireAuth, quotationController.generateQuotationData);
router.post('/common/downloadQuotation', requireAuth, quotationController.downloadQuotationNewFormat); 
router.post('/sellRate/updateQuotationStatus', requireAuth, quotationController.updateQuotationStatus);
router.post('/common/lastFiveQuotationsSearch', requireAuth, quotationController.lastFiveQuotationsSearch);
router.post('/common/quickSearchResults', requireAuth, quickSearchController.quickSearch);
router.post('/common/quotationLoss', quotationController.quotationLoss);

router.get('/circular/circularFiles', requireAuth,  circularController.circularFiles);
router.post('/circular/uploadCsv', requireAuth, appConfigCheck, circularController.associateCircular);
router.get('/circular/getSingleCircular', requireAuth, appConfigCheck, circularController.getSingleCircular);
router.post('/circular/saveExcelCircular', requireAuth, appConfigCheck, circularController.saveExcelCircular);
router.post('/circular/changeExcelStatus', requireAuth, appConfigCheck, circularController.changeExcelStatus);
router.post('/circular/processCsv', requireAuth, appConfigCheck,  circularController.ProcessCsv);
router.put('/circular/csvMapping', requireAuth, circularController.csvMapping);
router.put('/circular/finalCsvProcess', requireAuth, circularController.finalCsvProcess);
router.put('/circular/priceSheet', requireAuth, circularController.additionalSurcharge);
router.delete('/circular/deleteCircular', requireAuth,appConfigCheck,  circularController.deleteCircular);
router.put('/circular/disableCircular', requireAuth,appConfigCheck,  circularController.disableCircular);
router.put('/circular/enableCircular', requireAuth, circularController.enableCircular); 
router.post('/circular/downloadRateSheet', requireAuth, circularController.downloadRateSheet);
router.post('/settings/saveOrganaizationSettings', requireAuth, settingsController.saveOrganaizationSettings);
router.post('/settings/saveAirwayBillSettings', requireAuth, settingsController.saveAirBillSettings);
router.post('/common/organaizationSettingsResults', requireAuth, settingsController.organaizationSettingsResults);
router.get('/user/agent-results', requireAuth,  userController.getAgentResults); 
router.delete('/user/deleteAgent', requireAuth, userController.deleteAgent); 
router.put('/user/updateAgent', requireAuth, userController.updateAgent);
router.post('/common/saveProfileSettings', requireAuth, settingsController.saveProfileSettings);
router.post('/common/profileSettingsResults', requireAuth, settingsController.profileSettingsResults);
router.get('/circular/searchQuery', requireAuth, circularController.searchQuery);
router.post('/common/resetpassword', requireAuth, settingsController.resetPassword);
router.post('/common/getContactInfo', requireAuth, circularController.getContactInfo);
router.post('/common/editWeight', requireAuth, circularController.editWeight);
router.post('/sellRate/editRate', requireAuth, circularController.editRate);
router.post('/common/changetheme', requireAuth, settingsController.changeTheme); 
router.post('/common/saveProfileQuotationSettings', requireAuth, settingsController.saveProfileQuotationSettings);
router.post('/user/userPrivilege', requireAuth, userController.userPrivilege);
router.get('/forwarderAgent/forwarderAgentFiles', requireAuth, forwarderAgentController.getForwarderAgentFiles);
router.post('/forwarderAgent/forwarderAgents', requireAuth, forwarderAgentController.processFile)
router.post('/forwarderAgent/createForwarderAgent', requireAuth, forwarderAgentController.createForwarderAgent);;
router.post('/forwarderAgent/forwarderAgentUpload', requireAuth, forwarderAgentController.upload);
router.delete('/forwarderAgent/deleteForwarderAgentFile', requireAuth, forwarderAgentController.deleteFile);
router.get('/forwarderAgent/forwarderAgentResults', requireAuth, forwarderAgentController.forwarderAgentResults);
router.put('/forwarderAgent/updateForwarderAgent', requireAuth, forwarderAgentController.updateForwarderAgent);
router.delete('/forwarderAgent/deleteForwarderAgent', requireAuth, forwarderAgentController.deleteForwarderAgent);
router.get('/forwarderAgent/forwarderAgentSearch', requireAuth, forwarderAgentController.searchQuery);
router.get('/common/upgrade-details', requireAuth,  userController.getUpgradeDetails); 
router.get('/common/config-details', requireAuth, appConfigController.getConfigration);
router.post('/circular/initCircularSync', requireAuth, syncController.initCircularSync); 

router.post('/common/updateSync', syncController.changeStatusInCircularSync); 
router.post('/circular/syncCirculars', requireAuth, syncController.getProcessingCirculars);
router.post('/common/syncCustomerStatus', syncController.syncCustomerStatus); 
router.post('/common/refreshJwt', authController.refreshJwt);  

router.get('/preferential/preferential', requireAuth, preferentialController.preferentialData); 
router.get('/preferential/searchpreferential', requireAuth,  preferentialController.searchPreferentialQuery);
router.post('/preferential/circular', requireAuth,  preferentialController.getLatestCircularData); 
router.post('/preferential/registerpreferential', requireAuth,  preferentialController.registerPreferentialData); 
router.get('/preferential/getpreferential', requireAuth,  preferentialController.getPreferentialData); 
router.put('/preferential/updatepreferential', requireAuth,  preferentialController.updatePreferentialData); 
router.post('/preferential/generatesheet', requireAuth,  preferentialController.generatePreferentialSheet);
router.delete('/preferential/deletepreferential', requireAuth,  preferentialController.deletePreferential);
router.post('/preferential/selectedcircular', requireAuth,  preferentialController.findCircularBasedOnPAR);

router.post('/sellContract/contract', requireAuth, ContractSellController.createSellContract);
router.get('/sellContract/contract', requireAuth, ContractSellController.getSellContractList);
router.get('/sellContract/contract/:id', requireAuth, ContractSellController.getIndivdualSellContract);

router.get('/sellContract/circulars', requireAuth, ContractSellController.getCirculars);
router.post('/sellContract/contractrules', requireAuth, ContractSellController.createSellContractAirlineDetails);
router.post('/sellContract/rules', requireAuth, ContractSellController.deleteIndividualRuleFromContract);
router.get('/sellContract/circulars/:id', requireAuth, ContractSellController.getIndivdualCirculars);
router.post('/sellContract/updaterules', requireAuth, ContractSellController.updateIndividualRulesInContract);
router.get('/sellContract/customer', requireAuth, ContractSellController.findCustomerByName);
router.get('/sellContract/group', requireAuth, ContractSellController.findGroupByName);
router.post('/sellContract/group', requireAuth, ContractSellController.saveCustomersToContract);
router.delete('/sellContract/deletecontract', requireAuth, ContractSellController.deleteContract);
router.delete('/sellContract/deletecustomer', requireAuth, ContractSellController.deleteCustomersFromContract);
router.post('/common/circularexpiresnotifiy', requireAuth, ContractSellController.findExpiredCircularsForNotification);

router.post('/sellContract/generalrules', requireAuth, ContractSellController.createSellContractAirlineDetailsForGeneralContract);
router.put('/sellContract/updategeneralrules', requireAuth, ContractSellController.updateIndividualRulesInGeneralContract);
router.post('/sellContract/deletegeneralrules', requireAuth, ContractSellController.deleteIndividualRuleFromGeneralContract);
router.post('/sellContract/weight', requireAuth, ContractSellController.getGeneralContractRuleWeight);
router.put('/sellContract/disablecontract', requireAuth, ContractSellController.disableContract);


router.post('/circular/saveCircularAirline', requireAuth, CircularAirlineController.save);
router.post('/circular/deleteCircularAirline', requireAuth, CircularAirlineController.delete);
router.post('/circular/getCircularAirline', requireAuth, CircularAirlineController.getCircularAirline);
router.post('/circular/getAirlineCircularStatus', requireAuth, CircularAirlineController.getCirculars);
router.post('/circular/filterAirlineCirculars', requireAuth, CircularAirlineController.filter);
router.post('/circular/searchAirlineCirculars', requireAuth, CircularAirlineController.search);
router.post('/circular/getTask', requireAuth, TaskController.getTasks);
router.post('/circular/saveoutcome', requireAuth, TaskController.saveOutcome);
router.post('/circular/closeTask', requireAuth, TaskController.saveOutcome);
router.post('/circular/searchTask', requireAuth, TaskController.searchTask);
router.post('/circular/notOperational', requireAuth, TaskController.notOperational);
router.post('/circular/downloadCircularData', requireAuth, TaskController.downloadCircular);
router.post('/circular/changeAssignee', requireAuth, TaskController.changeAssignee);
router.post('/circular/filterTask', requireAuth, TaskController.filterTask);
router.post('/circular/getCircularList', requireAuth, TaskController.circularList);
router.post('/circular/getCircularMaster', requireAuth, TaskController.masterList);
router.post('/circular/editCircular', requireAuth, TaskController.editCircular);


router.post('/common/getUsers', requireAuth, quickSearchController.getUsers);

router.post('/booking/saveAWB', requireAuth, ManageAWBStockController.saveAWBStock);
router.get('/booking/awbstocklist', requireAuth, ManageAWBStockController.listAWBStock);
router.post('/booking/saveawbcontacts', requireAuth, ManageAWBStockController.saveAWBContactDetails);
router.post('/booking/getthresholdlimit', requireAuth, ManageAWBStockController.saveAWBContactDetails);
router.get('/booking/getawbcontacts', requireAuth, ManageAWBStockController.getAWBContactDetails); 
router.get('/booking/getawbstock', requireAuth, ManageAWBStockController.getAwbStockResults); 
router.delete('/booking/deleteawbstock', requireAuth, ManageAWBStockController.deleteAwbStock); 
router.post('/booking/sendawbrequest', requireAuth, ManageAWBStockController.sendAwbRequest);
router.post('/booking/saveawbbooking', requireAuth, ManageAWBStockController.saveAWBBookingDetails);
// awbstocklist

router.get('/booking/quotationlist', requireAuth, ManageAWBStockController.getQuotationList);


router.get('/booking/getIataAgentList', requireAuth, ManageAWBStockController.getIataAgentList);
router.get('/booking/getDefaultIataAgent', requireAuth, ManageAWBStockController.getDefaultIataAgent);
router.post('/booking/saveDefaultIataAgent', requireAuth, ManageAWBStockController.saveDefaultIataAgent);

router.post('/airwayBill/getbookingform', requireAuth, ManageAWBStockController.getBookingFormDetails);

router.post('/booking/getPriorityAWB', requireAuth, ManageAWBStockController.getPriorityAWB);
router.post('/airwayBill/saveBookingForm', requireAuth, ManageAWBStockController.saveBookingForm); 
router.delete('/booking/removeBookingFormawb', requireAuth, ManageAWBStockController.removeBookingFormawb); 
router.post('/booking/saveinfo', requireAuth, ManageAWBStockController.saveAWBInfo);
router.post('/airwayBill/awbSettings', requireAuth, ManageAWBStockController.saveAwbSettings); 
// getbookingform
// router.post('/addawbNumber', requireAuth, AddAWBNumberController.addAWBNumber);


router.get('/booking/getAllBookingConfirmedDetails', requireAuth, AwbTrackingDetailsController.getBookingContactedStatus);
router.get('/booking/getAwbDataFromWEbPage', requireAuth, AwbTrackingDetailsController.getAwbDataFromWEbPage);

router.post('/chaAgent/savecha', requireAuth, ManageAWBStockController.createChaAgent); 
router.get('/chaAgent/listcha', requireAuth, ManageAWBStockController.getChaAgentList); 
router.put('/chaAgent/updatecha', requireAuth, ManageAWBStockController.updateChaAgent); 
router.delete('/chaAgent/deletecha', requireAuth, ManageAWBStockController.deleteChaAgent); 

router.post('/iataAgent/saveiata', requireAuth, ManageAWBStockController.createIataAgent); 
router.get('/iataAgent/listiata', requireAuth, ManageAWBStockController.getIataAgentListData); 
router.put('/iataAgent/updateiata', requireAuth, ManageAWBStockController.updateIataAgent); 
router.delete('/iataAgent/deleteiata', requireAuth, ManageAWBStockController.deleteIataAgent); 

router.post('/booking/getiata', requireAuth, ManageAWBStockController.getIndividualIata); 
router.post('/booking/getcha', requireAuth, ManageAWBStockController.getIndividualCha); 
router.get('/booking/getthreshold', requireAuth, ManageAWBStockController.getThreshold); 
router.put('/booking/updatethreshold', requireAuth, ManageAWBStockController.updateThreshold); 
router.get('/booking/getpendingdraftcnt', requireAuth, ManageAWBStockController.getPendingAndDraftCount); 

router.get('/booking/getallcha', requireAuth, ManageAWBStockController.getAllChaResults);
router.post('/airwayBill/saveAwbForm', requireAuth, ManageAWBStockController.saveAwbForm); 

router.post('/shipperConsignee/saveshipconsignee', requireAuth, ManageAWBStockController.createShipConsignee); 
router.get('/shipperConsignee/listshipconsignee', requireAuth, ManageAWBStockController.listShipConsignee); 
router.put('/shipperConsignee/updateshipconsignee', requireAuth, ManageAWBStockController.updateShipConsignee); 
router.delete('/shipperConsignee/deleteshipconsignee', requireAuth, ManageAWBStockController.deleteShipConsignee); 
router.put('/shipperConsignee/getshipconsignee', requireAuth, ManageAWBStockController.getIndividualShipConsignee); 
router.get('/booking/getClearanceCalendarData', requireAuth, ManageAWBStockController.getClearanceCalendarDetails); 
router.get('/booking/getClearanceCount', requireAuth, ManageAWBStockController.getClearanceCount);
router.post('/booking/bulkupload', requireAuth, ManageAWBStockController.bulkUpload);
router.get('/shipperConsignee/getShipConsigdata', requireAuth, ManageAWBStockController.shipConsigdata);

router.post('/booking/getAirlineStatus', airlineStatus.getStatus); 
router.post('/settings/uploadImage', requireAuth, settingsController.saveLogo); 
router.delete('/settings/deleteLogo', requireAuth, settingsController.deleteLogo); 

router.get('/circular/newcirculars', requireAuth, CircularNotification.findNewCircularsForNotification);
router.post('/common/saveCrossDomainTracking', settingsController.saveCrossDomainTracking);

router.post('/userRole/save-user-role', requireAuth, userController.createRole);
router.get('/user/get-user-role', requireAuth, userController.getRole);
router.put('/userRole/update-user-role', requireAuth, userController.updateRole);
router.delete('/userRole/delete-user-role', requireAuth, userController.deleteRole);
router.post('/user/get-branch-origins', requireAuth, userController.getBranchAndOrigins);
router.get('/user/get-single-user', requireAuth, userController.getSingleUser);
router.get('/common/get-user-origin-list', requireAuth, userController.getUserOriginList); 
router.post('/userRole/get-app-business-object', requireAuth, userController.getAppBusinessObject);
// min surcharges

router.get('/circular/getMinSurcharges', requireAuth, MinimumSurchargeController.getMinimumSurcharges); 
router.get('/circular/getMinSurchargeDetails', requireAuth, MinimumSurchargeController.getMinimumSurchargeDetails); 
router.post('/circular/saveMinimumSurcharge', requireAuth, MinimumSurchargeController.saveMinimumSurcharge); 
router.get('/circular/searchMinSurcharges', requireAuth, MinimumSurchargeController.searchQuery); 

router.put('/settings/updateOrgs', requireAuth, settingsController.updateOrganaizationSettingsResults);

router.post('/settings/updateQuotationFormat', requireAuth, settingsController.saveQuotationNumberFormat);
router.post('/settings/getQuotationFormat', requireAuth, settingsController.getQuotationNumberFormat);
router.post('/settings/getCurrentQuotationFormat', requireAuth, settingsController.getCurrentQuotationFormat);

router.post('/common/resetQuotationNumberCount', settingsController.resetQuotationNumberCount);


router.get('/masterBranch/branchlist', requireAuth, BranchController.getBranchList);
router.put('/masterBranch/updatebranch', requireAuth, BranchController.updateBranch);
router.post('/masterBranch/createbranch', requireAuth, BranchController.createBranch);
router.delete('/masterBranch/deletebranch', requireAuth, BranchController.deleteBranch);
router.post('/masterBranch/defaultbranch', requireAuth, BranchController.setDefaultBranch);
router.get('/masterBranch/branch', requireAuth, BranchController.getBranch);
router.post('/masterBranch/getAllBranch', requireAuth, BranchController.getAllBranch);
router.post('/customer/getAllBranch', requireAuth, customerController.getAllBranch);



module.exports = router;
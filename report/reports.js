import { sendEmail } from '../email/emailHandler.js';
import { writeProgramadorasReportMaxiTV } from './maxiTVReport.js';
import './types.js';

/**@param {DealerData[]} dealerData  @param {ReportCSV} reportsCSV */
export async function generateExcelFiles(dealerData, reportsCSV) {
    await writeProgramadorasReportMaxiTV(dealerData);
    sendEmail();
}

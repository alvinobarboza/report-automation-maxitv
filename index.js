import 'dotenv/config';
import * as MAXITV from './reportDowload/maxitv.js';
import { validateMaxiTVReport } from './validations/maxiTvValidation.js';
import { generateExcelFiles } from './report/reports.js';

(async function () {
    const ids = await MAXITV.returnLatestIdFromReportType();
    const downloadedReports = await MAXITV.downloadAllReports(ids);
    const downloadedReportsCSVLines =
        MAXITV.linesfromDownloadReports(downloadedReports);
    const validatedUsers = validateMaxiTVReport(downloadedReportsCSVLines);

    generateExcelFiles(validatedUsers, downloadedReportsCSVLines);
})();

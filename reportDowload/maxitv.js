import { readCSVfile } from '../utils/ConvertB64toCSV.js';
import {
    downloadReport,
    getLastestEntryFromSchedule,
} from '../utils/moTV.call.js';

const LAST30DAYS = 'last30days';

/** @returns {Promise<ReportIds>} */
export async function returnLatestIdFromReportType() {
    /**@type {Entries[]} */
    const entries = await getLastestEntryFromSchedule();

    const reportsDates = {};
    const reportsId = {};

    for (const report of entries) {
        const temp = new Date(report.report_schedules_attachements_generated);

        if (
            !reportsDates[LAST30DAYS] &&
            report.report_schedules_attachements_note === LAST30DAYS
        ) {
            reportsDates[LAST30DAYS] = new Date(
                report.report_schedules_attachements_generated
            );
            reportsId[LAST30DAYS] = report.report_schedules_attachements_id;
        } else if (
            reportsDates[LAST30DAYS] < temp &&
            report.report_schedules_attachements_note === LAST30DAYS
        ) {
            reportsDates[LAST30DAYS] = temp;
            reportsId[LAST30DAYS] = report.report_schedules_attachements_id;
        }
    }

    return reportsId;
}

/**@param {ReportIds} ids @returns {Promise<ReportContents>}*/
export async function downloadAllReports(ids) {
    const tempObject = {};

    const content = await downloadReport(ids[LAST30DAYS]);
    tempObject[LAST30DAYS] = content;
    return tempObject;
}

/**@param {ReportContents} content @returns {ReportCSV}*/
export function linesfromDownloadReports(content) {
    const tempObject = {};
    const value = content[LAST30DAYS] ? content[LAST30DAYS] : '';
    const lines = readCSVfile(value);
    tempObject[LAST30DAYS] = lines;
    return tempObject;
}

/**
 * @typedef {object} ReportIds
 * @property {number} last30days
 */

/**
 * @typedef {object} ReportContents
 * @property {string} last30days
 */

/**
 * @typedef {object} ReportCSV
 * @property {string[]} last30days
 */

/**
 * @typedef {object} Entries
 * @property {Date} report_schedules_attachements_generated
 * @property {number} report_schedules_attachements_id
 * @property {string} report_schedules_attachements_note
 */

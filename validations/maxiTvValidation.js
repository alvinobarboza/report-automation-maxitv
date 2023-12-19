import * as CSV from './maxiTvConstantsCSV.js';

/**@param {ReportCSV} reportsCSV  */
export function validateMaxiTVReport(reportsCSV) {
    console.time('Validation');
    const data = validateCustomers(reportsCSV);
    console.timeEnd('Validation');

    return data;
}

/**@param {ReportCSV} reportData  @returns {DealerData[]}*/
function validateCustomers(reportData) {
    /**@type {GenericDealerData} */
    const dealerDataTemp = {};
    /**@type {GenericCustomerData} */
    const customerDataTemp = {};

    const insertedCustomer = new Set();

    const dealerData = [];

    for (const line of reportData.last30days) {
        const columns = removeDoubleQuotesFromCSV(line);

        if (
            columns[CSV.sub_viewersid] === 'viewersid' ||
            !(columns.length > 1)
        ) {
            continue;
        }

        const dealerid = columns[CSV.sub_dealerid];
        const viewersid = columns[CSV.sub_viewersid];

        if (customerDataTemp[viewersid]) {
            customerDataTemp[viewersid].products.push(columns[CSV.sub_product]);
        } else {
            customerDataTemp[viewersid] = {
                customersId: parseInt(columns[CSV.sub_customersid]),
                viewersId: parseInt(viewersid),
                login: columns[CSV.sub_login],
                products: [columns[CSV.sub_product]],
            };
        }

        if (dealerDataTemp[dealerid]) {
            if (!insertedCustomer.has(viewersid)) {
                dealerDataTemp[dealerid].customers.push(
                    customerDataTemp[viewersid]
                );
                insertedCustomer.add(viewersid);
                dealerDataTemp[dealerid].totalCustomers++;
            }
        } else {
            dealerDataTemp[dealerid] = {
                dealerId: parseInt(dealerid),
                dealerName: columns[CSV.sub_dealer],
                totalCustomers: 1,
                customers: [customerDataTemp[viewersid]],
            };
            insertedCustomer.add(viewersid);

            dealerData.push(dealerDataTemp[dealerid]);
        }
    }
    return dealerData;
}

/**@param {string} line @returns {string[]} */
function removeDoubleQuotesFromCSV(line) {
    return line.split(',').reduce((pre, curr) => {
        pre.push(curr.replaceAll('"', ''));
        return pre;
    }, []);
}

/**
 * @typedef {Object.<string, DealerData>} GenericDealerData
 */

/**
 * @typedef {Object.<string, CustomerData>} GenericCustomerData
 */

/**
 * @typedef {object} DealerData
 * @property {number} dealerId
 * @property {string} dealerName
 * @property {CustomerData[]} customers
 * @property {number} totalCustomers
 */

/**
 * @typedef {object} CustomerData
 * @property {number} viewersId
 * @property {number} customersId
 * @property {string} login
 * @property {string[]} products
 */

/**
 * @typedef {object} ReportCSV
 * @property {string[]} last30days
 */

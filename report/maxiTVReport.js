import excel from 'excel4node';
import * as DT from '../utils/dateManipulation.js';
import * as ExcelStyles from '../utils/excelStyles.js';
import './types.js';
import * as File from '../utils/fileHandler.js';

/**@param {DealerData[]} dealerData */
export async function writeProgramadorasReportMaxiTV(dealerData) {
    try {
        const stringDate = DT.getCurrentMonthYearShort();
        const amount = dealerData.reduce(
            (acc, curr) => (acc += curr.totalCustomers),
            0
        );

        const MAIN_HEADER_ROWS_COUNT = 6;
        const MAIN_HEADER = 'MaxiTV';
        const headerDashboad = ['Dealer', 'Total'];
        const headerCustomers = ['Dealer', 'SMS_ID', 'Login', 'Pacotes'];

        const workbook = new excel.Workbook();

        const workSheetResult = workbook.addWorksheet('Operadora');

        workSheetResult.column(1).setWidth(50);
        workSheetResult
            .cell(1, 1, 1, 2, true)
            .string(MAIN_HEADER)
            .style(ExcelStyles.headerStyleException);
        workSheetResult
            .cell(3, 1)
            .string('Período')
            .style(ExcelStyles.dataStyleException1);
        workSheetResult
            .cell(3, 2)
            .string(stringDate)
            .style(ExcelStyles.dataStyleException2);
        workSheetResult
            .cell(5, 1)
            .string('Assinantes cadastrados na Plataforma')
            .style(ExcelStyles.dataStyleException1);
        workSheetResult
            .cell(5, 2)
            .number(amount)
            .style(ExcelStyles.dataStyleException2);

        for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
            if (i % 2 === 0) {
                workSheetResult.row(i).setHeight(8);
                continue;
            }
        }
        workSheetResult.row(MAIN_HEADER_ROWS_COUNT + 1).filter();
        for (let i = 0; i < headerDashboad.length; i++) {
            workSheetResult
                .cell(MAIN_HEADER_ROWS_COUNT + 1, i + 1)
                .string(headerDashboad[i])
                .style(ExcelStyles.headerStyleException);
        }
        for (let i = 0; i < dealerData.length; i++) {
            workSheetResult
                .cell(i + MAIN_HEADER_ROWS_COUNT + 2, 1)
                .string(dealerData[i].dealerName)
                .style(ExcelStyles.dataStyleException3);
            workSheetResult
                .cell(i + MAIN_HEADER_ROWS_COUNT + 2, 2)
                .number(dealerData[i].totalCustomers)
                .style(ExcelStyles.dataStyleException2);
        }

        //------------------------ workSheet 2 ----------------------------
        const worksheetAllCustomers = workbook.addWorksheet('TodosClientes');

        worksheetAllCustomers.column(2).setWidth(20);
        worksheetAllCustomers.column(3).setWidth(25);
        worksheetAllCustomers.column(4).setWidth(25);
        worksheetAllCustomers.column(5).setWidth(20);

        worksheetAllCustomers.row(2).filter();
        for (let i = 0; i < headerCustomers.length; i++) {
            worksheetAllCustomers
                .cell(2, i + 2)
                .string(headerCustomers[i])
                .style(ExcelStyles.headerStyle);
        }

        let rowIndex = 0;
        for (const dealer of dealerData) {
            for (const customer of dealer.customers) {
                const products = customer.products.reduce((previ, curr) => {
                    previ += curr + ', ';
                }, '');
                worksheetAllCustomers
                    .cell(rowIndex + 3, 2)
                    .string(dealer.dealerName)
                    .style(ExcelStyles.dataStyle);
                worksheetAllCustomers
                    .cell(rowIndex + 3, 3)
                    .string(customer.viewersId)
                    .style(ExcelStyles.dataStyle);
                worksheetAllCustomers
                    .cell(rowIndex + 3, 4)
                    .string(customer.login)
                    .style(ExcelStyles.dataStyle);
                worksheetAllCustomers
                    .cell(rowIndex + 3, 5)
                    .date(products)
                    .style(ExcelStyles.dataStyle);
                rowIndex++;
            }
        }
        //---------------------------------------------------------------

        const filename = File.getPath(
            `RELATORIO DE ASSINANTES - MAXITV - Ref. ${DT.getCurrentMonth()}_${DT.getCurrentYear()}.xlsx`
        );
        File.insertFilenameToFilenames(filename);
        await workbook.write(filename);
    } catch (error) {
        console.log(error);
    }
}
